import moment from 'moment';
import {getConnection} from '../config/database.js';
import axios from "axios";
import { defaultValues, doctorData, nurseData } from './defaultValues.js';

const connection = await getConnection();

export async function dataService(queryDate){
    try {
        const currentDay = moment(new Date());

        if(queryDate > currentDay){
            const patientsData = await getPatientsData();
            
            let forecastDates = [];
            let forecastNs = [];

            patientsData[0].forEach(record =>{
                forecastDates.push(moment(record.Data).format('YYYY-MM-DD'));
                forecastNs.push(record.n);
            })

            const forecast = await forecastPatients(forecastDates, forecastNs, queryDate)
            const res = await parseForecast(forecast, queryDate);
            return res;
        }
        else{
            console.log("Query date is not in the future.");
            return null; 
        }
    } catch (error) {
        console.log("An error occured in the data service");
        return null;
    }
}

async function getPatientsData(){
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

    const patientData = await connection.query(query);
    return patientData;
}

async function forecastPatients(forecastDates, forecastNs, queryDate) {
    try {
        const response = await axios.post(process.env.R_URL, {
            train_set: {
                Data: forecastDates,
                n: forecastNs
            },
            future_dates: {
                Data: [queryDate.format('YYYY-MM-DD')]
            }
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
        statystykaChorych: defaultValues.statystykaChorych,
        czasZasobuNaPacjenta: defaultValues.czasZasobuNaPacjenta,
    }));

    return {
        daneGodzinowe,
        kolejka: {
            lekarz: 55,
            pielegniarka: 22
        }
    };
}

function getPatientDistribution(forecast, queryDate) {
    queryDate = queryDate.format('dddd').trim();   
    const distributionArray = defaultValues.distribution[queryDate];
    const distributionSum = distributionArray.reduce((acc, curr) => acc + curr, 0);
    
    return distributionArray.map(distributor => distributor / distributionSum * forecast);
}

function getResources(hourIndex) {
    const getCount = (hourIndex, data) =>
        hourIndex > data.rushHoursStart && hourIndex < data.rushHoursEnd
            ? data.rushHourHeadCount
            : data.normalHeadCount;

    return {
        liczbaLekarzy: getCount(hourIndex, doctorData),
        liczbaPielegniarek: getCount(hourIndex, nurseData),
        liczbaLozek: defaultValues.liczbaLozek,
        liczbaLozekObserwacyjnych: defaultValues.liczbaLozekObserwacyjnych
    };
}