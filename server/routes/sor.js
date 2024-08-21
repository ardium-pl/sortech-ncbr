import express from 'express';
import moment from 'moment-timezone';
import {
  addStanKolejki,
  getHourlyData,
  getPacjenci,
  getStanZasobow,
  insertPacjent,
  insertStanZasobow,
} from '../services/sor.js';

// Configure moment to use UTC by default
moment.tz.setDefault('UTC');

export const sorRouter = express.Router();

sorRouter.get('/stan-zasobow', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Brak parametru date' });
    }

    const parsedDate = moment.utc(date);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Nieprawidłowy format daty' });
    }

    const stanZasobow = await getStanZasobow(parsedDate.toDate());
    res.json(stanZasobow);
  } catch (error) {
    next(error);
  }
});

sorRouter.get('/pacjenci', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Brak parametru date' });
    }

    const parsedDate = moment(date);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Nieprawidłowy format daty' });
    }

    const pacjenci = await getPacjenci(parsedDate.toDate());
    res.json(pacjenci);
  } catch (error) {
    next(error);
  }
});

sorRouter.post('/stan-zasobow', async (req, res, next) => {
  try {
    const stan = req.body;
    if (!stan || !stan.ostatnia_aktualizacja) {
      return res.status(400).json({ message: 'Nieprawidłowe dane' });
    }

    const insertedId = await insertStanZasobow(stan);
    res.status(201).json({ message: 'Stan zasobów dodany', id: insertedId });
  } catch (error) {
    next(error);
  }
});

sorRouter.post('/pacjenci', async (req, res, next) => {
  try {
    const pacjent = req.body;
    if (!pacjent || !pacjent.data_przyjecia || !pacjent.typ) {
      return res.status(400).json({ message: 'Nieprawidłowe dane pacjenta' });
    }

    const insertedId = await insertPacjent(pacjent);
    res.status(201).json({ message: 'Pacjent dodany', id: insertedId });
  } catch (error) {
    next(error);
  }
});

sorRouter.get('/hourly-data', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Brak parametru date' });
    }

    const parsedDate = moment(date, 'YYYY-MM-DD');
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Nieprawidłowy format daty' });
    }

    const data = await getHourlyData(parsedDate.toDate());
    res.json(data);
  } catch (error) {
    next(error);
  }
});

sorRouter.post('/stan-kolejki', async (req, res, next) => {
  try {
    const { data, minuty_lekarz, minuty_pielegniarka } = req.body;

    if (!data || !minuty_lekarz || !minuty_pielegniarka) {
      return res.status(400).json({ message: 'Brakuje wymaganych danych' });
    }

    const parsedDate = moment(data, 'YYYY-MM-DD');
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Nieprawidłowy format daty' });
    }

    const result = await addStanKolejki({
      data: parsedDate.format('YYYY-MM-DD'),
      minuty_lekarz: parseInt(minuty_lekarz),
      minuty_pielegniarka: parseInt(minuty_pielegniarka),
    });

    res.status(201).json({ message: 'Stan kolejki dodany/zaktualizowany', result });
  } catch (error) {
    next(error);
  }
});
