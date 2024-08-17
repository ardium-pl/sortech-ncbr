import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import * as MoreRounding from 'more-rounding';
import { catchError } from 'rxjs';
import { CONSTANTS } from './constants';
import { Hour } from './interfaces/hour';
import { Summary } from './interfaces/summaries';
import { Godzina, LQparams } from './utils';
import { apiUrl } from './utils/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class HourlyDataService {
  readonly currentDayOfWeek = signal<number>(0);

  readonly currentDate = signal<Date>(new Date(2024, 7, 7));

  private readonly http = inject(HttpClient);

  constructor() {
    this.fetchRowData();
  }

  fetchRowData() {
    const sub = this.http
      .get<any>(apiUrl('/hourly-data'), { params: { date: this.currentDate().toISOString() } })
      .pipe(
        catchError((err, caught) => {
          console.error(err);
          sub.unsubscribe();
          return caught;
        })
      )
      .subscribe(res => {
        const mappedData = (res.currentDayData as any[]).map((v, i): Hour => {
          return {
            id: i,
            liczbaPielegniarek: v.ilosc_pielegniarek,
            liczbaLekarzy: v.ilosc_lekarzy,
            liczbaLozek: v.ilosc_lozek,
            liczbaLozekObserwacja: v.ilosc_lozek_obserwacji,
            godzina: `${i}-${i + 1}` as keyof Godzina,
          } as any;
        });
        this.applyHourCalculations(mappedData as any);
      });
  }

  updateHours(changedHour: Hour) {
    this.rowData.update(hours => hours.map(hour => (changedHour.id === hour.id ? changedHour : hour)));
  }

  applyHourCalculations(rowData: Hour[], changedRow?: Hour) {
    let rows: Hour[];

    if (changedRow) {
      rows = rowData.map(row => {
        return row.id === changedRow.id ? changedRow : row;
      });
    } else {
      rows = rowData;
    }

    // Part 1
    let calculatedRowData = rows.map(hourObject => {
      let hour = { ...hourObject };
      hour = this.obliczOczekiwaneWizyty(hour);
      hour = this.obliczWydajnosc(hour);
      hour = this.obliczWaskaWydajnosc(hour);
      hour = this.obliczWaskiZasob(hour);
      hour = this.obliczMozliwoscPokryciaZopatrzenia(hour);
      hour = this.obliczObsluga(hour);
      hour = this.obliczKolejka(hour);

      this.updateHours(hour);
      return hour;
    });

    // Part 2
    calculatedRowData.forEach(hourObject => {
      let hour = { ...hourObject };
      hour = this.obliczOczekiwanie(hour);
      hour = this.obliczLq(hour);
      hour = this.obliczWq(hour);
      hour = this.obliczOpoznienieOgolem(hour);

      this.updateHours(hour);
    });

    // Get min and max value of delay
    const opoznienia: (number | string)[] = [];
    for (let row of rows) {
      opoznienia.push(row.opoznienieOgolem);
    }
    this.getExtremeValues(opoznienia);
  }

  obliczOczekiwaneWizyty(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set oczekiwaneWizyty
    hour.oczekiwaneWizyty =
      7 * CONSTANTS.pacjentDzien * CONSTANTS.godzina[hour.godzina] * CONSTANTS.dzien[this.currentDayOfWeek()];

    return hour;
  }

  obliczWydajnosc(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set wydajnosci
    if (hour.id === 0) {
      hour.wydajnoscPielegniarek = (hour.liczbaPielegniarek * 60) / CONSTANTS.sredniCzasNaPacjenta['pielegniarka'];

      hour.wydajnoscLekarzy = (hour.liczbaLekarzy * 60) / CONSTANTS.sredniCzasNaPacjenta['lekarz'];

      hour.wydajnoscLozek = hour.liczbaLozek / CONSTANTS.sredniCzasNaPacjenta['lozko'];
    } else if (hour.id === 23) {
      hour.wydajnoscPielegniarek = (this.rowData()[0].liczbaPielegniarek * 60) / CONSTANTS.sredniCzasNaPacjenta['pielegniarka'];

      hour.wydajnoscLekarzy = (this.rowData()[0].liczbaLekarzy * 60) / CONSTANTS.sredniCzasNaPacjenta['lekarz'];

      hour.wydajnoscLozek = this.rowData()[hour.id - 1].liczbaLozek / CONSTANTS.sredniCzasNaPacjenta['lozko'];
    } else {
      hour.wydajnoscPielegniarek =
        (this.rowData()[hour.id - 1].liczbaPielegniarek * 60) / CONSTANTS.sredniCzasNaPacjenta['pielegniarka'];

      hour.wydajnoscLekarzy = (this.rowData()[hour.id - 1].liczbaLekarzy * 60) / CONSTANTS.sredniCzasNaPacjenta['lekarz'];

      hour.wydajnoscLozek = this.rowData()[hour.id - 1].liczbaLozek / CONSTANTS.sredniCzasNaPacjenta['lozko'];
    }

    hour.wydajnoscLozekObserwacja = hour.liczbaLozekObserwacja / CONSTANTS.sredniCzasNaPacjenta['obserwacja'];

    return hour;
  }

  obliczWaskaWydajnosc(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set waskaWydajnosc
    hour.waskaWydajnosc = Math.min(
      hour.wydajnoscPielegniarek,
      hour.wydajnoscLekarzy,
      hour.wydajnoscLozek,
      hour.wydajnoscLozekObserwacja
    );

    return hour;
  }

  obliczWaskiZasob(hourObject: Hour) {
    const hour = { ...hourObject };

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

    return hour;
  }

  obliczMozliwoscPokryciaZopatrzenia(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set mozliwoscPokryciaZopatrzenia
    hour.mozliwoscPokryciaZopatrzenia = hour.waskaWydajnosc <= hour.oczekiwaneWizyty ? 'Niedobór wyd.' : '';

    return hour;
  }

  obliczObsluga(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set obsługa
    if (hour.id === 0) {
      hour.obslugaPielegniarka = Math.min(
        hour.wydajnoscPielegniarek,
        hour.oczekiwaneWizyty + this.previousDayLastHour.kolejkaPielegniarka
      );

      hour.obslugaLekarz = Math.min(hour.wydajnoscLekarzy, hour.oczekiwaneWizyty + this.previousDayLastHour.kolejkaLekarz);
    } else {
      hour.obslugaPielegniarka = Math.min(
        hour.wydajnoscPielegniarek,
        hour.oczekiwaneWizyty + this.rowData()[hour.id - 1].kolejkaPielegniarka
      );

      hour.obslugaLekarz = Math.min(hour.wydajnoscLekarzy, hour.oczekiwaneWizyty + this.rowData()[hour.id - 1].kolejkaLekarz);
    }

    return hour;
  }

  obliczKolejka(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set kolejka
    if (hour.id === 0) {
      hour.kolejkaPielegniarka = hour.oczekiwaneWizyty + this.previousDayLastHour.kolejkaPielegniarka - hour.obslugaPielegniarka;

      hour.kolejkaLekarz = hour.oczekiwaneWizyty + this.previousDayLastHour.kolejkaLekarz - hour.obslugaLekarz;
    } else {
      hour.kolejkaPielegniarka =
        hour.oczekiwaneWizyty + this.rowData()[hour.id - 1].kolejkaPielegniarka - hour.obslugaPielegniarka;

      hour.kolejkaLekarz = hour.oczekiwaneWizyty + this.rowData()[hour.id - 1].kolejkaLekarz - hour.obslugaLekarz;
    }

    return hour;
  }

  obliczOczekiwanie(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set oczekiwanie
    if (hour.id === 23) {
      hour.oczekiwaniePielegniarka = hour.kolejkaPielegniarka / this.rowData()[0].wydajnoscPielegniarek;
      hour.oczekiwanieLekarz = hour.kolejkaLekarz / this.rowData()[0].wydajnoscLekarzy;
    } else {
      hour.oczekiwaniePielegniarka = hour.kolejkaPielegniarka / this.rowData()[hour.id + 1].wydajnoscPielegniarek;
      hour.oczekiwanieLekarz = hour.kolejkaLekarz / this.rowData()[hour.id + 1].wydajnoscLekarzy;
    }
    return hour;
  }

  obliczLq(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set lq
    if (hour.oczekiwaniePielegniarka > 0) {
      hour.lqPielegniarka = 0;
    } else {
      // Calling Lq function implemented from VBA script
      hour.lqPielegniarka = this.Lq({
        arrivalRate: hour.oczekiwaneWizyty,
        serviceRate: 60 / CONSTANTS.sredniCzasNaPacjenta['pielegniarka'], // Wydajnosc godzinowa 1 pielegniarki
        servers: hour.liczbaPielegniarek,
      });

      if (typeof hour.lqPielegniarka === 'number') {
        hour.lqPielegniarka *= CONSTANTS.wspolczynnikV;
      }
    }

    if (hour.oczekiwanieLekarz > 0) {
      hour.lqLekarz = 0;
    } else {
      // Calling Lq function implemented from VBA script
      hour.lqLekarz = this.Lq({
        arrivalRate: hour.oczekiwaneWizyty,
        serviceRate: 60 / CONSTANTS.sredniCzasNaPacjenta['lekarz'], // Wydajnosc godzinowa 1 lekarza
        servers: hour.liczbaLekarzy,
      });

      if (typeof hour.lqLekarz === 'number') {
        hour.lqLekarz *= CONSTANTS.wspolczynnikV;
      }
    }

    return hour;
  }

  obliczWq(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set wq
    if (typeof hour.lqPielegniarka === 'number') {
      hour.wqPielegniarka = hour.lqPielegniarka / hour.oczekiwaneWizyty;
    } else {
      hour.wqPielegniarka = 'INVALID VALUE TYPE - STR';
    }

    if (typeof hour.lqLekarz === 'number') {
      hour.wqLekarz = hour.lqLekarz / hour.oczekiwaneWizyty;
    } else {
      hour.wqLekarz = 'INVALID VALUE TYPE - STR';
    }

    return hour;
  }

  obliczOpoznienieOgolem(hourObject: Hour) {
    const hour = { ...hourObject };

    // Set opznienieOgolem
    if (typeof hour.wqPielegniarka !== 'number' || typeof hour.wqLekarz !== 'number') {
      hour.opoznienieOgolem = 'INVALID VALUE TYPE - STR';
    } else {
      hour.opoznienieOgolem =
        Math.max(hour.oczekiwaniePielegniarka, hour.oczekiwanieLekarz) + hour.wqPielegniarka + hour.wqLekarz;
    }

    return hour;
  }

  // Lq function is a 1:1 copy of the corresponding Lq function declared in VBA
  Lq({ arrivalRate, serviceRate, servers, queueCapacity = null }: LQparams): string | number {
    let sum: number = 0;
    let term: number = 1;
    let rho: number;
    let n: number;
    let p: number;
    let q: number;
    let expQLength: number = 0;

    // Validate inputs
    if (arrivalRate <= 0) {
      return '#Arrival_Rate <= 0';
    } else if (serviceRate <= 0) {
      return '#Service_Rate <= 0';
    } else if (servers < 1) {
      return '#Servers <= 0';
    } else if (Math.floor(servers) !== servers) {
      return '#Servers not integer';
    }

    if (queueCapacity === undefined || queueCapacity === null || queueCapacity.toString().toLowerCase().startsWith('inf')) {
      // M/M/s with infinite queue capacity
      rho = arrivalRate / (servers * serviceRate);
      if (rho >= 1) {
        return '#Utilization >= 100%';
      } else {
        for (n = 0; n < servers; n++) {
          sum += term;
          term *= arrivalRate / serviceRate / (n + 1);
        }
        return ((term * rho) / (1 - rho) ** 2) * (1 / (sum + term / (1 - rho)));
      }
    } else {
      // M/M/s with finite queue capacity
      if (Math.floor(queueCapacity) !== queueCapacity) {
        return '#Queue_Capacity not integer';
      } else if (queueCapacity < 0) {
        return '#Queue Capacity <= 0';
      } else {
        p = 1;
        q = 1;
        for (n = 1; n <= servers; n++) {
          p *= arrivalRate / (n * serviceRate);
          q += p;
        }
        for (n = servers + 1; n <= servers + queueCapacity; n++) {
          p *= arrivalRate / (servers * serviceRate);
          q += p;
          expQLength += (n - servers) * p;
        }
        return expQLength / q;
      }
    }
  }

  consoleLogLq() {
    let calculatedLq = this.Lq({
      arrivalRate: 5.66,
      serviceRate: 1.374, // Wydajnosc godzinowa 1 lekarza
      servers: 8,
    }) as number;

    calculatedLq = MoreRounding.roundToPrecision(calculatedLq, 3);
    console.log(calculatedLq);
    console.log(calculatedLq * 0.5);
  }

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
      summaryRow1.wydajnoscPielegniarek += this.rowData()[n].wydajnoscPielegniarek;
      summaryRow1.wydajnoscLekarzy += this.rowData()[n].wydajnoscLekarzy;
      summaryRow1.wydajnoscLozek += this.rowData()[n].wydajnoscLozek;
      summaryRow1.wydajnoscLozekObserwacja += this.rowData()[n].wydajnoscLozekObserwacja;
    }

    // Oblicz Śr. zajęt.
    summaryRow2.wydajnoscPielegniarek = summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscPielegniarek;
    summaryRow2.wydajnoscLekarzy = summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLekarzy;
    summaryRow2.wydajnoscLozek = summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLozek;
    summaryRow2.wydajnoscLozekObserwacja = summaryRow1.oczekiwaneWizyty / summaryRow1.wydajnoscLozekObserwacja;

    // Update main signals
    this.summaryRow1.set(summaryRow1);
    this.summaryRow2.set(summaryRow2);
  }

  getExtremeValues(values: (number | string)[]) {
    const numeric_values = values.map(v => {
      return typeof v === 'string' ? 0 : v;
    });

    this.minValue.set(Math.min(...numeric_values));
    this.maxValue.set(Math.max(...numeric_values));
  }

  readonly minValue = signal<number>(0);
  readonly maxValue = signal<number>(0);
  readonly previousDayLastHour: Hour = {
    id: -1,
    godzina: '23-24',
    oczekiwaneWizyty: 4.08,
    liczbaPielegniarek: 4,
    wydajnoscPielegniarek: 5.05,
    obslugaPielegniarka: 5.0489,
    kolejkaPielegniarka: 20.5828,
    oczekiwaniePielegniarka: 4.0767,
    lqPielegniarka: 0,
    wqPielegniarka: 0,
    liczbaLekarzy: 6,
    wydajnoscLekarzy: 8.24,
    obslugaLekarz: 8.244,
    kolejkaLekarz: 7.8053,
    oczekiwanieLekarz: 0.9468,
    lqLekarz: 0,
    wqLekarz: 0,
    liczbaLozek: 50,
    wydajnoscLozek: 12.18,
    liczbaLozekObserwacja: 15.0,
    wydajnoscLozekObserwacja: 11.36,
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 4.0767,
  };
  readonly summaryRow1 = signal<Summary>({
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
    waskiZasob: null,
    waskaWydajnosc: null,
    mozliwoscPokryciaZopatrzenia: null,
  });
  readonly summaryRow2 = signal<Summary>({
    id: 25,
    godzina: null,
    oczekiwaneWizyty: null,
    liczbaPielegniarek: null,
    wydajnoscPielegniarek: 0.9684,
    liczbaLekarzy: null,
    wydajnoscLekarzy: 0.7339,
    liczbaLozek: null,
    wydajnoscLozek: 0.5519,
    liczbaLozekObserwacja: null,
    wydajnoscLozekObserwacja: 0.5916,
    waskiZasob: null,
    waskaWydajnosc: null,
    mozliwoscPokryciaZopatrzenia: null,
  });

  readonly rowData = signal<Hour[]>([
    {
      id: 0,
      godzina: '0-1',
      oczekiwaneWizyty: 3.23,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 18.7608,
      oczekiwaniePielegniarka: 3.7158,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 2.7882,
      oczekiwanieLekarz: 0.3382,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 3.7158,
    },
    {
      id: 1,
      godzina: '1-2',
      oczekiwaneWizyty: 2.39,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 16.1045,
      oczekiwaniePielegniarka: 3.1897,
      lqPielegniarka: 0.0175,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 3.1905,
    },
    {
      id: 2,
      godzina: '2-3',
      oczekiwaneWizyty: 2.14,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 13.1983,
      oczekiwaniePielegniarka: 2.6141,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 2.6146,
    },
    {
      id: 3,
      godzina: '3-4',
      oczekiwaneWizyty: 1.83,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 9.7675,
      oczekiwaniePielegniarka: 1.976,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 1.976,
    },
    {
      id: 4,
      godzina: '4-5',
      oczekiwaneWizyty: 1.7,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 6.6287,
      oczekiwaniePielegniarka: 1.3129,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 1.3129,
    },
    {
      id: 5,
      godzina: '5-6',
      oczekiwaneWizyty: 1.67,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 3.512,
      oczekiwaniePielegniarka: 0.644,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0.1051,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.644,
    },
    {
      id: 6,
      godzina: '6-7',
      oczekiwaneWizyty: 1.8,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 0,
      oczekiwaniePielegniarka: 0,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.0097,
    },
    {
      id: 7,
      godzina: '7-8',
      oczekiwaneWizyty: 2.96,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 0,
      oczekiwaniePielegniarka: 0,
      lqPielegniarka: 0.1907,
      wqPielegniarka: 0.0337,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0.0361,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.0011,
    },
    {
      id: 8,
      godzina: '8-9',
      oczekiwaneWizyty: 5.66,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 5.6587,
      oczekiwaniePielegniarka: 0.6404,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 1.47,
      wqLekarz: 0.1589,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.2061,
    },
    {
      id: 9,
      godzina: '9-10',
      oczekiwaneWizyty: 9.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 0.4171,
      oczekiwaniePielegniarka: 0.0472,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 0,
      oczekiwanieLekarz: 0,
      lqLekarz: 0,
      wqLekarz: 0.1051,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 0.422,
    },
    {
      id: 10,
      godzina: '10-11',
      oczekiwaneWizyty: 12.15,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 3.7287,
      oczekiwaniePielegniarka: 0.422,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 10.9919,
      kolejkaLekarz: 1.553,
      oczekiwanieLekarz: 0.1413,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 0.9221,
    },
    {
      id: 11,
      godzina: '11-12',
      oczekiwaneWizyty: 13.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 8.1473,
      oczekiwaniePielegniarka: 0.9221,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 10.99,
      obslugaLekarz: 10.9919,
      kolejkaLekarz: 4.4175,
      oczekiwanieLekarz: 0.4015,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.3236,
    },
    {
      id: 12,
      godzina: '12-13',
      oczekiwaneWizyty: 12.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 11.5576,
      oczekiwaniePielegniarka: 1.3081,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 7.4194,
      oczekiwanieLekarz: 0.9006,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.3081,
    },
    {
      id: 13,
      godzina: '13-14',
      oczekiwaneWizyty: 10.52,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 13.7333,
      oczekiwaniePielegniarka: 1.4982,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 9.696,
      oczekiwanieLekarz: 1.1755,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.4982,
    },
    {
      id: 14,
      godzina: '14-15',
      oczekiwaneWizyty: 9.44,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 13.8961,
      oczekiwaniePielegniarka: 1.5664,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 10.8845,
      oczekiwanieLekarz: 1.32,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.5664,
    },
    {
      id: 15,
      godzina: '15-16',
      oczekiwaneWizyty: 9.73,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 14.7323,
      oczekiwaniePielegniarka: 1.674,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 12.3688,
      oczekiwanieLekarz: 1.5004,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.6674,
    },
    {
      id: 16,
      godzina: '16-17',
      oczekiwaneWizyty: 10.29,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 16.1745,
      oczekiwaniePielegniarka: 1.83,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 14.4154,
      oczekiwanieLekarz: 1.7486,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.8321,
    },
    {
      id: 17,
      godzina: '17-18',
      oczekiwaneWizyty: 10.1,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 17.4538,
      oczekiwaniePielegniarka: 1.9754,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 16.2735,
      oczekiwanieLekarz: 1.974,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.9754,
    },
    {
      id: 18,
      godzina: '18-19',
      oczekiwaneWizyty: 9.34,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 17.5142,
      oczekiwaniePielegniarka: 2.0302,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 17.3654,
      oczekiwanieLekarz: 2.1064,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.1064,
    },
    {
      id: 19,
      godzina: '19-20',
      oczekiwaneWizyty: 8.57,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 8.84,
      obslugaPielegniarka: 8.8355,
      kolejkaPielegniarka: 17.6841,
      oczekiwaniePielegniarka: 2.2034,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 17.0526,
      oczekiwanieLekarz: 2.0685,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.2034,
    },
    {
      id: 20,
      godzina: '20-21',
      oczekiwaneWizyty: 7.61,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 21.8433,
      oczekiwaniePielegniarka: 2.7803,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 17.6142,
      oczekiwanieLekarz: 2.138,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.7803,
    },
    {
      id: 21,
      godzina: '21-22',
      oczekiwaneWizyty: 6.33,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 21.2534,
      oczekiwaniePielegniarka: 2.6702,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 16.9768,
      oczekiwanieLekarz: 2.06,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.6702,
    },
    {
      id: 22,
      godzina: '22-23',
      oczekiwaneWizyty: 5.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 21.523,
      oczekiwaniePielegniarka: 2.714,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 15.1539,
      oczekiwanieLekarz: 1.836,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.714,
    },
    {
      id: 23,
      godzina: '23-24',
      oczekiwaneWizyty: 4.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      obslugaPielegniarka: 5.0489,
      kolejkaPielegniarka: 20.5828,
      oczekiwaniePielegniarka: 4.0767,
      lqPielegniarka: 0,
      wqPielegniarka: 0,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      obslugaLekarz: 8.244,
      kolejkaLekarz: 7.8053,
      oczekiwanieLekarz: 0.9468,
      lqLekarz: 0,
      wqLekarz: 0,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserwacja: 15.0,
      wydajnoscLozekObserwacja: 11.36,
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 4.0767,
    },
  ]);
}
