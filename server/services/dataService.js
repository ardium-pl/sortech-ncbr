import moment from 'moment';
import {getConnection} from '../config/database.js';
import axios from "axios";
import { response } from 'express';

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


            const forecast = forecastPatients(forecastDates, forecastNs, queryDate)
            
            return forecast;
        }
        else{
            console.log("Query date is not in the future.");
            return null; 
        }
    } catch (error) {
        console.log("An error occurs in the structure");
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

async function forecastPatients(forecastDates, forecastNs, queryDate){

    const body = {
        trainSet:{
            Data: forecastDates,
            n: forecastNs
        },
        future_dates: {
            Data:[queryDate.format('YYYY-MM-DD')]
        }
    }

    console.log(body);

    axios.post(process.env.R_URL, body)
    .then(function(response) {
        console.log(response.data);
        return response;
    })
    .catch(function (error){
        console.log(error);
    })
}


// {
//     "daneGodzinowe": [
//       {
//         "hour": "0-1",
//         "liczbaPacjentow": 10,
//         "zasoby": {
//           "liczbaLekarzy": 3,
//           "liczbaPielegniarek": 5,
//           "liczbaLozek": 50,
//           "liczbaLozekObserwacyjnych": 50
//         },
//         "statystykaChorych": {
//           "triage": 1,
//           "resuscytacja": 0.01,
//           "stanZagrozeniaZycia": 0.02,
//           "pilnyPrzypadekOstry": 0.03,
//           "pilnyPrzypadekNieostry": 0.4,
//           "niepilny": 0.5,
//           "obserwacja": 0.04
//         },
//         "czasZasobuNaPacjenta": [
//           {
//             "rodzajPacjenta": "Triage",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Resuscytacja",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Stan zagrożenia życia",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Pilny przypadek ostry",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Pilny przypadek nieostry",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Niepilny",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           },
//           {
//             "rodzajPacjenta": "Obserwacja",
//             "lekarz": 0,
//             "pielegniarka": 15,
//             "lozko": 0,
//             "lozkoObserwacyjne": 0
//           }
//         ]
//       }
//     ],
//     "kolejka": {
//       "lekarz": 55,
//       "pielegniarka": 22
//     }
//   }