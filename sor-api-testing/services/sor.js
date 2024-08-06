import {getConnection} from '../config/database.js';
import moment from 'moment';
const connection = await getConnection();
export const getStanZasobow = async (date) => {
    const startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const query = `
        SELECT *
        FROM stan_zasobow
        WHERE ostatnia_aktualizacja BETWEEN ? AND ?
        ORDER BY ostatnia_aktualizacja ASC
    `;

    const [rows] = await connection.query(query, [startDate, endDate]);
    return rows;
};

export const getPacjenci = async (date) => {
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

export const insertStanZasobow = async (stan) => {
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
        stan.ilosc_lozek_obserwacji
    ]);
    return result.insertId;
};

export const insertPacjent = async (pacjent) => {
    const query = `
        INSERT INTO pacjenci (data_przyjecia, typ)
        VALUES (?, ?)
    `;

    const [result] = await connection.query(query, [pacjent.data_przyjecia, pacjent.typ]);
    return result.insertId;
};