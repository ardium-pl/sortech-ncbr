import moment from 'moment';
import { getConnection } from '../config/database.js';

const connection = await getConnection();

// Utility function to convert UTC date-time to Warsaw time, considering DST
const convertToWarsawTime = utcDate => {
  return moment.utc(utcDate).tz('Europe/Warsaw').format('YYYY-MM-DD HH:mm:ss');
};

// Pobiera stan zasobów dla danego dnia
export const getStanZasobow = async date => {
  const startDate = moment.utc(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment.utc(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const query = `
    SELECT *
    FROM stan_zasobow
    WHERE ostatnia_aktualizacja BETWEEN ? AND ?
    ORDER BY ostatnia_aktualizacja ASC
  `;

  const [rows] = await connection.query(query, [startDate, endDate]);

  // Convert each row's timestamp to local Warsaw time
  return rows.map(row => ({
    ...row,
    ostatnia_aktualizacja: convertToWarsawTime(row.ostatnia_aktualizacja),
  }));
};

// Pobiera pacjentów dla danego dnia
export const getPacjenci = async date => {
  const startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const query = `
        SELECT p.*, tp.nazwa, tp.czas_lekarza, tp.czas_pielegniarki, tp.czas_lozka, tp.czas_lozka_obserwacji
        FROM pacjenci p
                 JOIN typy_pacjenta tp ON p.typ = tp.id
        WHERE p.data_przyjecia BETWEEN ? AND ?
        ORDER BY p.data_przyjecia ASC
    `;

  const [rows] = await connection.query(query, [startDate, endDate]);
  return rows;
};

// Wstawia nowy stan zasobów do bazy danych
export const insertStanZasobow = async stan => {
  const query = `
        INSERT INTO stan_zasobow (ostatnia_aktualizacja, ilosc_lekarzy, ilosc_pielegniarek, ilosc_lozek,
                                  ilosc_lozek_obserwacji)
        VALUES (?, ?, ?, ?, ?)
    `;

  const [result] = await connection.query(query, [
    stan.ostatnia_aktualizacja,
    stan.ilosc_lekarzy,
    stan.ilosc_pielegniarek,
    stan.ilosc_lozek,
    stan.ilosc_lozek_obserwacji,
  ]);
  return result.insertId;
};

// Wstawia nowego pacjenta do bazy danych
export const insertPacjent = async pacjent => {
  const query = `
        INSERT INTO pacjenci (data_przyjecia, typ)
        VALUES (?, ?)
    `;

  const [result] = await connection.query(query, [pacjent.data_przyjecia, pacjent.typ]);
  return result.insertId;
};

// Pobiera dane godzinowe dla danego dnia
export const getHourlyData = async date => {
  const connection = await getConnection();
  try {
    const startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const prevDayLastHour = moment(date)
      .subtract(1, 'day')
      .endOf('day')
      .subtract(1, 'hour')
      .format('YYYY-MM-DD HH:mm:ss');

    // Zapytanie dla danych godzinowych wybranego dnia --> dla wielu rekordow per godzina
    // const queryCurrentDay = `
    //     SELECT DATE_FORMAT(ostatnia_aktualizacja, '%Y-%m-%d %H:00:00') as hour,
    //            AVG(ilosc_lekarzy)                                      as avg_ilosc_lekarzy,
    //            AVG(ilosc_pielegniarek)                                 as avg_ilosc_pielegniarek,
    //            AVG(ilosc_lozek)                                        as avg_ilosc_lozek,
    //            AVG(ilosc_lozek_obserwacji)                             as avg_ilosc_lozek_obserwacji
    //     FROM stan_zasobow
    //     WHERE ostatnia_aktualizacja BETWEEN ? AND ?
    //     GROUP BY hour
    //     ORDER BY hour
    // `;

    // Zapytanie dla danych godzinowych wybranego dnia --> dla pojedynczych rekordow per godzina
    const queryCurrentDay = `
            SELECT
                DATE_FORMAT(ostatnia_aktualizacja, '%Y-%m-%d %H:00:00') as hour,
                ilosc_lekarzy,
                ilosc_pielegniarek,
                ilosc_lozek,
                ilosc_lozek_obserwacji
            FROM stan_zasobow
            WHERE ostatnia_aktualizacja BETWEEN ? AND ?
            ORDER BY ostatnia_aktualizacja
        `;

    // Zapytanie dla ostatniej godziny poprzedniego dnia
    const queryPrevDay = `
            SELECT sz.ilosc_lekarzy,
                   sz.ilosc_pielegniarek,
                   sz.ilosc_lozek,
                   sz.ilosc_lozek_obserwacji,
                   sk.minuty_lekarz       as kolejka_lekarz,
                   sk.minuty_pielegniarka as kolejka_pielegniarka
            FROM stan_zasobow sz
                     LEFT JOIN stan_kolejki sk ON DATE (sz.ostatnia_aktualizacja) = sk.data
            WHERE sz.ostatnia_aktualizacja BETWEEN ? AND ?
            ORDER BY sz.ostatnia_aktualizacja DESC
                LIMIT 1
        `;

    const [rowsCurrentDay] = await connection.query(queryCurrentDay, [startDate, endDate]);
    const [rowsPrevDay] = await connection.query(queryPrevDay, [prevDayLastHour, startDate]);

    return {
      currentDayData: rowsCurrentDay,
      prevDayLastHourData: rowsPrevDay[0] || null,
    };
  } finally {
    await connection.end();
  }
};

export const addStanKolejki = async stanKolejki => {
  const connection = await getConnection();
  // On DUPLICATE KEY UPDATE - jeśli rekord istnieje to zaktualizuj dane, anty-crasher gdy rekord istnieje
  try {
    const { data, minuty_lekarz, minuty_pielegniarka } = stanKolejki;

    const query = `
            INSERT INTO stan_kolejki (data, minuty_lekarz, minuty_pielegniarka)
            VALUES (?, ?, ?) ON DUPLICATE KEY
            UPDATE minuty_lekarz =
            VALUES (minuty_lekarz), minuty_pielegniarka =
            VALUES (minuty_pielegniarka)
        `;

    const [result] = await connection.query(query, [data, minuty_lekarz, minuty_pielegniarka]);

    return result.insertId || result.affectedRows;
  } finally {
    await connection.end();
  }
};
