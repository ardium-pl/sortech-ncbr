import { Injectable, signal } from '@angular/core';
import { CONSTANTS } from './hourly-table/constants';
import { Hour } from './hour';
import { Summary1, Summary2 } from './summaries';
import { HOME, S } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class HourlyDataService {
  readonly currentDayOfWeek = 'poniedzialek';

  updateHours(changedHour: Hour) {
    this.rowData.update((hours) =>
      hours.map((hour) => (changedHour.id === hour.id ? changedHour : hour))
    );
  }

  applyHourCalculations(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set oczekiwaneWizyty
    hour.oczekiwaneWizyty =
      7 *
      CONSTANTS.pacjentDzien *
      CONSTANTS.godzina[hour.godzina] *
      CONSTANTS.dzien[this.currentDayOfWeek];

    // Set wydajnosci
    hour.wydajnoscPielegniarek =
      (hour.liczbaPielegniarek * 60) /
      CONSTANTS.sredniCzasNaPacjenta['pielegniarka'];

    hour.wydajnoscLekarzy =
      (hour.liczbaLekarzy * 60) / CONSTANTS.sredniCzasNaPacjenta['lekarz'];

    hour.wydajnoscLozek =
      hour.liczbaLozek / CONSTANTS.sredniCzasNaPacjenta['lozko'];

    hour.wydajnoscLozekObserwacja =
      hour.liczbaLozekObserwacja / CONSTANTS.sredniCzasNaPacjenta['obserwacja'];

    // Set waskaWydajnosc
    hour.waskaWydajnosc = Math.min(
      hour.wydajnoscPielegniarek,
      hour.wydajnoscLekarzy,
      hour.wydajnoscLozek,
      hour.wydajnoscLozekObserwacja
    );

    // Set waskiZasob
    switch (hour.waskaWydajnosc) {
      case hour.wydajnoscPielegniarek:
        hour.waskiZasob = 'Pielęgniarki';
        break;
      case hour.wydajnoscLekarzy:
        hour.waskiZasob = 'Lekarze';
        break;
      case hour.wydajnoscLozek:
        hour.waskiZasob = 'Łóżka';
        break;
      case hour.wydajnoscLozekObserwacja:
        hour.waskiZasob = 'Obs. Łóżka';
        break;
      default:
        hour.waskiZasob = 'Demand';
    }

    // Set mozliwoscPokryciaZopatrzenia
    hour.mozliwoscPokryciaZopatrzenia =
      hour.waskaWydajnosc <= hour.oczekiwaneWizyty ? 'Niedobór wydajności' : '';

    // Round numeric properties (exlducing id) to 2 decimal places
    // for (let key in hour) {
    //   if (typeof hour[key] === 'number' && key !== 'id') {
    //     hour[key] = Math.round((hour[key] as number) * 100) / 100;
    //   }
    // }

    return hour;
  }

  // applySummaryCalcuations() {
  //   const summaryRow1 = this.rowData()[24];
  //   const summaryRow2 = this.rowData()[25];

  //   // Oblicz Wyd./dobę
  //   summaryRow1.oczekiwaneWizyty! = 0;
  //   summaryRow1.wydajnoscPielegniarek = 0;
  //   summaryRow1.wydajnoscLekarzy = 0;
  //   summaryRow1.wydajnoscLozek = 0;
  //   summaryRow1.wydajnoscLozekObserwacja = 0;

  //   for (const n of Array(24).keys()) {
  //     summaryRow1.oczekiwaneWizyty! += this.rowData()[n].oczekiwaneWizyty!;
  //     summaryRow1.wydajnoscPielegniarek +=
  //       this.rowData()[n].wydajnoscPielegniarek;
  //     summaryRow1.wydajnoscLekarzy += this.rowData()[n].wydajnoscLekarzy;
  //     summaryRow1.wydajnoscLozek += this.rowData()[n].wydajnoscLozek;
  //     summaryRow1.wydajnoscLozekObserwacja +=
  //       this.rowData()[n].wydajnoscLozekObserwacja;
  //   }

  //   // Oblicz Śr. zajęt.
  //   summaryRow2.wydajnoscPielegniarek =
  //     summaryRow1.oczekiwaneWizyty! / summaryRow1.wydajnoscPielegniarek;
  //   summaryRow2.wydajnoscLekarzy =
  //     summaryRow1.oczekiwaneWizyty! / summaryRow1.wydajnoscLekarzy;
  //   summaryRow2.wydajnoscLozek =
  //     summaryRow1.oczekiwaneWizyty! / summaryRow1.wydajnoscLozek;
  //   summaryRow2.wydajnoscLozekObserwacja =
  //     summaryRow1.oczekiwaneWizyty! / summaryRow1.wydajnoscLozekObserwacja;

  //   // Update main signal
  //   this.rowData.update((rows) =>
  //     rows.map((row) => {
  //       switch (row.id) {
  //         case 24:
  //           return summaryRow1;
  //         case 25:
  //           return summaryRow2;
  //         default:
  //           return row;
  //       }
  //     })
  //   );
  // }

  applySummaryCalcuationsForPinnedRows() {
    const summaryRow1 = { ...this.summaryRow1() };
    const summaryRow2 = { ...this.summaryRow2() };

    // Oblicz Wyd./dobę
    summaryRow1.oczekiwaneWizyty = 0;
    summaryRow1.wydajnoscPielegniarek = 0;
    summaryRow1.wydajnoscLekarzy = 0;
    summaryRow1.wydajnoscLozek = 0;
    summaryRow1.wydajnoscLozekObserwacja = 0;

    for (const n of Array(24).keys()) {
      summaryRow1.oczekiwaneWizyty += this.rowData()[n].oczekiwaneWizyty;
      summaryRow1.wydajnoscPielegniarek +=
        this.rowData()[n].wydajnoscPielegniarek;
      summaryRow1.wydajnoscLekarzy += this.rowData()[n].wydajnoscLekarzy;
      summaryRow1.wydajnoscLozek += this.rowData()[n].wydajnoscLozek;
      summaryRow1.wydajnoscLozekObserwacja +=
        this.rowData()[n].wydajnoscLozekObserwacja;
    }

    // Oblicz Śr. zajęt.
    summaryRow2.wydajnoscPielegniarek =
      summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscPielegniarek;
    summaryRow2.wydajnoscLekarzy =
      summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLekarzy;
    summaryRow2.wydajnoscLozek =
      summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLozek;
    summaryRow2.wydajnoscLozekObserwacja =
      summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLozekObserwacja;

    // Update main signals
    this.summaryRow1.set(summaryRow1);
    this.summaryRow2.set(summaryRow2);

    console.log(this.summaryRow2());
    console.log(this.rowData()[5]);
  }

  readonly summaryRow1 = signal<Summary1>({
    id: 24,
    godzina: 'Zapotrz./dobę',
    oczekiwaneWizyty: 161.35,
    liczbaPielegniarek: null,
    wydajnoscPielegniarek: 166.61,
    liczbaLekarzy: null,
    wydajnoscLekarzy: 219.84,
    liczbaLozek: null,
    wydajnoscLozek: 292.35,
    liczbaLozekObserwacja: null,
    wydajnoscLozekObserwacja: 272.73,
    // waskiZasob: null,
    // waskaWydajnosc: null,
    // mozliwoscPokryciaZopatrzenia: null,
  });
  readonly summaryRow2 = signal<Summary2>({
    id: 25,
    // godzina: null,
    // oczekiwaneWizyty: null,
    liczbaPielegniarek: null,
    wydajnoscPielegniarek: 0.9684,
    liczbaLekarzy: null,
    wydajnoscLekarzy: 0.7339,
    liczbaLozek: null,
    wydajnoscLozek: 0.5519,
    liczbaLozekObserwacja: null,
    wydajnoscLozekObserwacja: 0.5916,
    // waskiZasob: null,
    // waskaWydajnosc: null,
    // mozliwoscPokryciaZopatrzenia: null,
  });

  readonly rowData = signal<Hour[]>([
    {
      id: 0,
      godzina: '0-1',
      oczekiwaneWizyty: 3.23,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 1,
      godzina: '1-2',
      oczekiwaneWizyty: 2.39,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 2,
      godzina: '2-3',
      oczekiwaneWizyty: 2.14,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 3,
      godzina: '3-4',
      oczekiwaneWizyty: 1.83,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 4,
      godzina: '4-5',
      oczekiwaneWizyty: 1.7,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 5,
      godzina: '5-6',
      oczekiwaneWizyty: 1.67,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 6,
      godzina: '6-7',
      oczekiwaneWizyty: 1.8,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 7,
      godzina: '7-8',
      oczekiwaneWizyty: 2.96,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 8,
      godzina: '8-9',
      oczekiwaneWizyty: 5.66,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: '',
    },
    {
      id: 9,
      godzina: '9-10',
      oczekiwaneWizyty: 9.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 10,
      godzina: '10-11',
      oczekiwaneWizyty: 12.15,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 11,
      godzina: '11-12',
      oczekiwaneWizyty: 13.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 12,
      godzina: '12-13',
      oczekiwaneWizyty: 12.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 13,
      godzina: '13-14',
      oczekiwaneWizyty: 10.52,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 14,
      godzina: '14-15',
      oczekiwaneWizyty: 9.44,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 15,
      godzina: '15-16',
      oczekiwaneWizyty: 9.73,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 16,
      godzina: '16-17',
      oczekiwaneWizyty: 10.29,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 17,
      godzina: '17-18',
      oczekiwaneWizyty: 10.1,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 18,
      godzina: '18-19',
      oczekiwaneWizyty: 9.34,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 19,
      godzina: '19-20',
      oczekiwaneWizyty: 8.57,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 20,
      godzina: '20-21',
      oczekiwaneWizyty: 7.61,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 21,
      godzina: '21-22',
      oczekiwaneWizyty: 6.33,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 22,
      godzina: '22-23',
      oczekiwaneWizyty: 5.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    },
    {
      id: 23,
      godzina: '23-24',
      oczekiwaneWizyty: 4.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
    },
    // {
    //   id: 24,
    //   godzina: 'Zapotrz./dobę',
    //   oczekiwaneWizyty: 161.35,
    //   liczbaPielegniarek: null,
    //   wydajnoscPielegniarek: 166.61,
    //   liczbaLekarzy: null,
    //   wydajnoscLekarzy: 219.84,
    //   liczbaLozek: null,
    //   wydajnoscLozek: 292.35,
    //   liczbaLozekObserwacja: null,
    //   wydajnoscLozekObserwacja: 272.73,
    //   waskiZasob: null,
    //   waskaWydajnosc: null,
    //   mozliwoscPokryciaZopatrzenia: null,
    // } as Summary,
    // {
    //   id: 25,
    //   godzina: null,
    //   oczekiwaneWizyty: null,
    //   liczbaPielegniarek: null,
    //   wydajnoscPielegniarek: 0.9684,
    //   liczbaLekarzy: null,
    //   wydajnoscLekarzy: 0.7339,
    //   liczbaLozek: null,
    //   wydajnoscLozek: 0.5519,
    //   liczbaLozekObserwacja: null,
    //   wydajnoscLozekObserwacja: 0.5916,
    //   waskiZasob: null,
    //   waskaWydajnosc: null,
    //   mozliwoscPokryciaZopatrzenia: null,
    // } as Summary,
  ]);

  constructor() {}
}
