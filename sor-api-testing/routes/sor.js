import express from "express";
import {getPacjenci, getPacjent, addPacjent, updatePacjent, removePacjent, getTriage} from "../services/sor.js";
import {validatePacjent} from '../middleware/validation.js';

export const sorRouter = express.Router();

sorRouter.route('/')
    .get(async (req, res, next) => {
        try {
            if (req.query.triage) {
                const triageList = await getTriage();
                res.json(triageList);
            } else {
                const pacjenci = await getPacjenci(req.query);
                res.json(pacjenci);
            }
        } catch (error) {
            next(error);
        }
    })
    .post(validatePacjent, async (req, res, next) => {
        try {
            const newPacjent = await addPacjent(req.body);
            res.status(201).json(newPacjent);
        } catch (error) {
            next(error);
        }
    });

sorRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            const pacjent = await getPacjent(req.params.id);
            if (pacjent) {
                res.json(pacjent);
            } else {
                res.status(404).json({message: "Pacjent nie znaleziony"});
            }
        } catch (error) {
            next(error);
        }
    })
    .put(validatePacjent, async (req, res, next) => {
        try {
            const updatedPacjent = await updatePacjent(req.params.id, req.body);
            if (updatedPacjent) {
                res.json(updatedPacjent);
            } else {
                res.status(404).json({message: "Pacjent nie znaleziony"});
            }
        } catch (error) {
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const result = await removePacjent(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({message: "Pacjent nie znaleziony"});
            }
        } catch (error) {
            next(error);
        }
    });