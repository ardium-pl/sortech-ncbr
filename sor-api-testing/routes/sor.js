import express from "express";
import {getStanZasobow, getPacjenci, insertStanZasobow, insertPacjent} from "../services/sor.js";
import moment from 'moment';

export const sorRouter = express.Router();

sorRouter.get("/stan-zasobow", async (req, res, next) => {
    try {
        const {date} = req.query;
        if (!date) {
            return res.status(400).json({message: "Brak parametru date"});
        }

        const parsedDate = moment(date);
        if (!parsedDate.isValid()) {
            return res.status(400).json({message: "Nieprawidłowy format daty"});
        }

        const stanZasobow = await getStanZasobow(parsedDate.toDate());
        res.json(stanZasobow);
    } catch (error) {
        next(error);
    }
});

sorRouter.get("/pacjenci", async (req, res, next) => {
    try {
        const {date} = req.query;
        if (!date) {
            return res.status(400).json({message: "Brak parametru date"});
        }

        const parsedDate = moment(date);
        if (!parsedDate.isValid()) {
            return res.status(400).json({message: "Nieprawidłowy format daty"});
        }

        const pacjenci = await getPacjenci(parsedDate.toDate());
        res.json(pacjenci);
    } catch (error) {
        next(error);
    }
});

sorRouter.post("/stan-zasobow", async (req, res, next) => {
    try {
        const {stan} = req.body;
        if (!stan || !stan.ostatnia_aktualizacja) {
            return res.status(400).json({message: "Nieprawidłowe dane"});
        }

        const insertedId = await insertStanZasobow(stan);
        res.status(201).json({message: "Stan zasobów dodany", id: insertedId});
    } catch (error) {
        next(error);
    }
});

sorRouter.post("/pacjenci", async (req, res, next) => {
    try {
        const {pacjent} = req.body;
        if (!pacjent || !pacjent.data_przyjecia || !pacjent.typ) {
            return res.status(400).json({message: "Nieprawidłowe dane pacjenta"});
        }

        const insertedId = await insertPacjent(pacjent);
        res.status(201).json({message: "Pacjent dodany", id: insertedId});
    } catch (error) {
        next(error);
    }
});

sorRouter.get("/hourly-data", async (req, res, next) => {
    try {
        const {date} = req.query;
        if (!date) {
            return res.status(400).json({message: "Brak parametru date"});
        }

        const parsedDate = moment(date, 'YYYY-MM-DD');
        if (!parsedDate.isValid()) {
            return res.status(400).json({message: "Nieprawidłowy format daty"});
        }

        const data = await getHourlyData(parsedDate.toDate());
        res.json(data);
    } catch (error) {
        next(error);
    }
});