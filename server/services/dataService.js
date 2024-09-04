import axios from 'axios';
import moment from 'moment';
import { getConnection } from '../config/database.js';
import { defaultValues, doctorData, nurseData } from './defaultValues.js';
import { getStanZasobow } from './sor.js';

const connection = await getConnection();

export async function dataService(queryDate) {
  try {
    const currentDay = moment(new Date());

    if (queryDate > currentDay) {
      const patientsData = await getPatientsData();

      let forecastDates = [];
      let forecastNs = [];

      patientsData[0].forEach(record => {
        forecastDates.push(moment(record.Data).format('YYYY-MM-DD'));
        forecastNs.push(record.n);
      });

      const forecast = await forecastPatients(forecastDates, forecastNs, queryDate);
      const res = await parseForecast(forecast, queryDate);
      return res;
    }
    const patientsForDay = (await getPatientsByDay(queryDate)).map(v => ({
      id: v.id,
      typ: v.typ,
      data: moment(v.data_przyjecia),
    }));
    const patientTypes = await getPatientTypes();
    const resourceAmounts = (await getStanZasobow(queryDate)).map(v => ({
      ...v,
      ostatnia_aktualizacja: moment(v.ostatnia_aktualizacja),
    }));
    const kolejka = await getQueueState(queryDate);

    const statystykaChorych = calculatePatientStates(patientsForDay, patientTypes);
    const daneGodzinowe = splitPatientsIntoHours(patientsForDay, resourceAmounts);

    const sredniaWazonaCzasuZasobow = calculateWeightedAverage(statystykaChorych);


    return {
      daneGodzinowe,
      czasZasobuNaPacjenta: patientTypes,
      statystykaChorych,
      kolejka,
      sredniaWazonaCzasuZasobow,
    };
  } catch (error) {
    console.log('An error occured in the data service', error);
    return null;
  }
}

function calculatePatientStates(patientsForDay, patientTypes) {
  const patiendStats = patientsForDay.reduce(
    (acc, v) => {
      const typeString = patientTypes[v.typ - 1].rodzajPacjenta;
      acc[typeString]++;
      return acc;
    },
    patientTypes.reduce((acc, v) => {
      acc[v.rodzajPacjenta] = 0;
      return acc;
    }, {})
  );
  for (const type in patiendStats) {
    patiendStats[type] /= patientsForDay.length;
  }
  return patiendStats;
}
function splitPatientsIntoHours(patientsForDay, resourceAmounts) {
  const hourlyData = patientsForDay.reduce(
    (acc, v, i) => {
      acc[v.data.hour()].liczbaPacjentow++;
      return acc;
    },
    Array(24)
      .fill({})
      .map((_, i) => ({ godzina: `${i}-${i + 1}`, liczbaPacjentow: 0, zasoby: null }))
  );
  return resourceAmounts.reduce((acc, v) => {
    acc[v.ostatnia_aktualizacja.hour()].zasoby = {
      liczbaLekarzy: v.ilosc_lekarzy,
      liczbaPielegniarek: v.ilosc_pielegniarek,
      liczbaLozek: v.ilosc_lozek,
      liczbaLozekObserwacyjnych: v.ilosc_lozek_obserwacji,
    };
    return acc;
  }, hourlyData);
}

async function getPatientsByDay(momentDate) {
  const startOfDay = momentDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endOfDay = momentDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const query = `
    SELECT
      id,
      data_przyjecia,
      typ
    FROM
      pacjenci
    WHERE data_przyjecia BETWEEN ? AND ?;
  `;

  return (await connection.query(query, [startOfDay, endOfDay]))[0];
}
async function getQueueState(momentDate) {
  const startOfDay = momentDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');

  const query = `
    SELECT
      minuty_lekarz as lekarz,
      minuty_pielegniarka as pielegniarka
    FROM
      stan_kolejki
    WHERE data = ?
    LIMIT 1;
  `;

  return (await connection.query(query, [startOfDay]))[0][0] || null;
}
async function getPatientTypes() {
  return (
    await connection.query(
      `SELECT
        nazwa as rodzajPacjenta,
        czas_lekarza as lekarz,
        czas_pielegniarki as pielegniarka,
        czas_lozka as lozko,
        czas_lozka_obserwacji as lozkoObserwacyjne
      FROM typy_pacjenta`
    )
  )[0];
}

async function getPatientsData() {
  const query = `
    SELECT 
      DATE(data_przyjecia) AS Data,
      COUNT(*) AS n
    FROM 
      pacjenci
    GROUP BY 
      DATE(data_przyjecia)
    ORDER BY 
      Data ASC;
    `;

  return await connection.query(query);
}

async function getResourceStatistics() {
  const query = `
    SELECT 
      * 
    FROM 
      railway.typy_pacjenta;
  `;

  return await connection.query(query);
}

async function calculateWeightedAverage(statystykaChorych) {
  const [resources] = await getResourceStatistics();

  const resourceTypes = {
    lekarz: 'czas_lekarza',
    pielegniarka: 'czas_pielegniarki',
    lozko: 'czas_lozka',
    lozkoObserwacyjne: 'czas_lozka_obserwacji',
  };

  const multiplyPercentAndTime = resourceType =>
    resources.reduce((acc, { nazwa, [resourceType]: time }) => {
      const percent = statystykaChorych[nazwa] || 0;
      return acc + percent * time;
    }, 0);

  // First calculate all resource types except triage that's 5 minutes as defult
  const result = Object.entries(resourceTypes).reduce((acc, [key, resourceType]) => {
    acc[key] = multiplyPercentAndTime(resourceType);
    return acc;
  }, {});

  // Add triage key after all calculations
  result.triage = defaultValues.sredniWazonyCzasNaPacjenta.triage;

  return result;
}

async function forecastPatients(forecastDates, forecastNs, queryDate) {
  try {
    const response = await axios.post(process.env.R_URL, {
      train_set: {
        Data: forecastDates,
        n: forecastNs,
      },
      future_dates: {
        Data: [queryDate.format('YYYY-MM-DD')],
      },
    });

    const predictedN = response.data[0].n_pred;

    if (!predictedN) {
      throw new Error(`Error occurred with the forecast data`);
    }

    return predictedN;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function parseForecast(forecast, queryDate) {
  const patientDistribution = getPatientDistribution(forecast, queryDate);

  const daneGodzinowe = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}-${i + 1}`,
    liczbaPacjentow: patientDistribution[i],
    zasoby: getResources(i),
  }));

  return {
    daneGodzinowe,
    czasZasobuNaPacjenta: defaultValues.czasZasobuNaPacjenta,
    statystykaChorych: defaultValues.statystykaChorych,
    kolejka: {
      lekarz: 55,
      pielegniarka: 22,
    },
    sredniWazonyCzasZasobuNaPacjenta: defaultValues.sredniWazonyCzasNaPacjenta
  };
}

function getPatientDistribution(forecast, queryDate) {
  queryDate = queryDate.format('dddd').trim();
  const distributionArray = defaultValues.distribution[queryDate];
  const distributionSum = distributionArray.reduce((acc, curr) => acc + curr, 0);

  return distributionArray.map(distributor => (distributor / distributionSum) * forecast);
}

function getResources(hourIndex) {
  const getCount = (hourIndex, data) =>
    hourIndex > data.rushHoursStart && hourIndex < data.rushHoursEnd ? data.rushHourHeadCount : data.normalHeadCount;

  return {
    liczbaLekarzy: getCount(hourIndex, doctorData),
    liczbaPielegniarek: getCount(hourIndex, nurseData),
    liczbaLozek: defaultValues.liczbaLozek,
    liczbaLozekObserwacyjnych: defaultValues.liczbaLozekObserwacyjnych,
  };
}
