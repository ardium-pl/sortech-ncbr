import pool from '../config/database.js';

export const getPacjenci = async (filters = {}) => {
    let query = 'SELECT * FROM pacjenci WHERE 1=1';
    const values = [];

    if (filters.stan) {
        query += ' AND stan = ?';
        values.push(filters.stan);
    }

    if (filters.priorytet) {
        query += ' AND priorytet = ?';
        values.push(filters.priorytet);
    }

    query += ' ORDER BY priorytet ASC, data_przyjecia ASC';

    const [rows] = await pool.query(query, values);
    return rows;
};

export const getPacjent = async (id) => {
    const [rows] = await pool.query('SELECT * FROM pacjenci WHERE id = ?', [id]);
    return rows[0];
};

export const addPacjent = async (pacjent) => {
    const {imie, nazwisko, pesel, stan, priorytet} = pacjent;
    const [result] = await pool.query(
        'INSERT INTO pacjenci (imie, nazwisko, pesel, stan, priorytet, data_przyjecia) VALUES (?, ?, ?, ?, ?, NOW())',
        [imie, nazwisko, pesel, stan, priorytet]
    );
    return getPacjent(result.insertId);
};

export const updatePacjent = async (id, pacjent) => {
    const {imie, nazwisko, pesel, stan, priorytet} = pacjent;
    await pool.query(
        'UPDATE pacjenci SET imie = ?, nazwisko = ?, pesel = ?, stan = ?, priorytet = ? WHERE id = ?',
        [imie, nazwisko, pesel, stan, priorytet, id]
    );
    return getPacjent(id);
};

export const removePacjent = async (id) => {
    const [result] = await pool.query('DELETE FROM pacjenci WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

export const getTriage = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM pacjenci WHERE stan != "wypisany" ORDER BY priorytet ASC, data_przyjecia ASC LIMIT 10'
    );
    return rows;
};