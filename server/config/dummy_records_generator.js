import mysql from 'mysql2/promise';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
};
console.log('Konfiguracja połączenia:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
});

// Funkcja testowa połączenia
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Połączenie udane!');
    await connection.end();
  } catch (error) {
    console.error('Błąd połączenia:', error);
  }
}

// Testowanie połączenia przed generowaniem danych
await testConnection();

async function generateDummyRecords(numDays = 30, patientsPerDay = 20) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Pobierz istniejące typy pacjentów
    const [typyPacjenta] = await connection.query('SELECT id FROM typy_pacjenta');
    const typyPacjentaIds = typyPacjenta.map(typ => typ.id);

    // Generowanie danych dla każdego dnia
    const startDate = moment().startOf('day');
    for (let day = 0; day < numDays; day++) {
      const currentDate = moment(startDate).subtract(day, 'days');

      // Generowanie pacjentów
      for (let i = 0; i < patientsPerDay; i++) {
        const admissionTime = randomDate(currentDate.toDate(), moment(currentDate).add(1, 'days').toDate());
        const patientType = typyPacjentaIds[Math.floor(Math.random() * typyPacjentaIds.length)];
        await connection.query(
          `
                    INSERT INTO pacjenci (data_przyjecia, typ)
                    VALUES (?, ?)
                `,
          [admissionTime, patientType]
        );
      }

      // Generowanie stanu zasobów (co godzinę)
      for (let hour = 0; hour < 24; hour++) {
        const resourceTime = moment(currentDate).add(hour, 'hours');
        await connection.query(
          `
                    INSERT INTO stan_zasobow
                    (ostatnia_aktualizacja, ilosc_lekarzy, ilosc_pielegniarek, ilosc_lozek, ilosc_lozek_obserwacji)
                    VALUES (?, ?, ?, ?, ?)
                `,
          [
            resourceTime.format('YYYY-MM-DD HH:mm:ss'),
            Math.floor(Math.random() * 8) + 3, // lekarze (3-10)
            Math.floor(Math.random() * 11) + 5, // pielęgniarki (5-15)
            Math.floor(Math.random() * 21) + 10, // łóżka (10-30)
            Math.floor(Math.random() * 7) + 2, // łóżka obserwacyjne (2-8)
          ]
        );
      }

      // Generowanie stanu kolejki
      await connection.query(
        `
                INSERT INTO stan_kolejki (data, minuty_lekarz, minuty_pielegniarka)
                VALUES (?, ?, ?)
            `,
        [
          currentDate.format('YYYY-MM-DD'),
          Math.floor(Math.random() * 51) + 10, // czas oczekiwania na lekarza (10-60)
          Math.floor(Math.random() * 26) + 5, // czas oczekiwania na pielęgniarkę (5-30)
        ]
      );
    }

    console.log(`Wygenerowano dane dla ${numDays} dni.`);
  } catch (error) {
    console.error('Błąd podczas generowania danych:', error);
  } finally {
    await connection.end();
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

generateDummyRecords().catch(console.error);
