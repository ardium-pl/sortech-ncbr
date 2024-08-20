import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import * as MoreRounding from 'more-rounding';
import { catchError } from 'rxjs';
import { CONSTANTS } from './constants';
import { Hour, kolejka, daneGodzinowe } from './interfaces/hour';
import { SummaryBottom, SummaryTop } from './interfaces/summaries';
import { Godzina, LQparams, zasob, SredniCzasNaPacjenta } from './utils/utils';
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

  applyHourCalculations(daneGodzinowe: daneGodzinowe[], changedRow?: daneGodzinowe) {
    if (changedRow) {
      daneGodzinowe[changedRow['id']] = changedRow;
    }

    let hours: Hour[] = daneGodzinowe.map((daneGodziny, index) => {
      // Placeholder values which will be calculated in later steps
      let hour: Hour = {
        ...daneGodziny,
        wydajnosc: {
          lekarz: 0,
          pielegniarka: 0,
          lozko: 0,
          lozkoObserwacja: 0,
        },
        obsluga: {
          lekarz: 0,
          pielegniarka: 0,
        },
        oczekiwanie: {
          lekarz: 0,
          pielegniarka: 0,
        },
        lq: {
          lekarz: 0,
          pielegniarka: 0,
        },
        wq: {
          lekarz: 0,
          pielegniarka: 0,
        },
        kolejka: {
          lekarz: 0,
          pielegniarka: 0,
        },
        waskiZasob: '',
        waskaWydajnosc: 0,
        mozliwoscPokryciaZopatrzenia: '',
        opoznienieOgolem: 0,
      };

      // Access the previous hour (if exists) - otherwise assign the first hour
      const previousHour = index > 0 ? hours[index - 1] : hours[0];

      // Obliczenia część pierwsza - dot. kalkulacji z użyciem godziny obecnej, bądź minionej
      hour = this.obliczWydajnosc(hour, previousHour, hours[0]);
      hour = this.obliczWaskaWydajnosc(hour);
      hour = this.obliczWaskiZasob(hour);
      hour = this.obliczMozliwoscPokryciaZopatrzenia(hour);
      hour = this.obliczObsluga(hour, previousHour);
      hour = this.obliczKolejka(hour, previousHour);
      return hour;
    });

    // Obliczenia część druga - dot. kalkulacji z użyciem godziny obecnej, minionej lub przyszłej
    hours.forEach((hour, index, hours) => {
      // Access the next hour (if exists) - otherwise assign the first hour
      const nextHour = index !== 23 ? hours[index + 1] : hours[0];

      hour = this.obliczOczekiwanie(hour, nextHour);
      hour = this.obliczLq(hour);
      hour = this.obliczWq(hour);
      hour = this.obliczOpoznienieOgolem(hour);
    });

    // Get min and max value of delay
    this.getExtremeValues(hours);

    // Assign calculated hours to the rowData & summaryRows signals
    this.rowData.set(hours);
    this.applySummaryCalcuationsForPinnedRows(hours);
  }

  obliczWydajnosc(hour: Hour, previousHour: Hour, hourZero: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka', 'lozko', 'lozkoObserwacja'] as const) {
      let liczbaZasobow: number;
      if (hour.id === 0) {
        liczbaZasobow = hour.zasoby[zasob];
      } else if (hour.id === 23 && (zasob === 'lekarz' || zasob === 'pielegniarka')) {
        liczbaZasobow = hourZero.zasoby[zasob];
      } else {
        liczbaZasobow = zasob === 'lozkoObserwacja' ? hour.zasoby[zasob] : previousHour.zasoby[zasob];
      }
      hour.wydajnosc[zasob] = liczbaZasobow / CONSTANTS.sredniCzasNaPacjenta[zasob];
    }

    return hour;
  }

  obliczWaskaWydajnosc(hour: Hour) {
    hour.waskaWydajnosc = Math.min(...Object.values(hour.wydajnosc));

    return hour;
  }

  obliczWaskiZasob(hour: Hour) {
    switch (hour.waskaWydajnosc) {
      case hour.wydajnosc.pielegniarka:
        hour.waskiZasob = 'Pielęgniarki';
        break;
      case hour.wydajnosc.lekarz:
        hour.waskiZasob = 'Lekarze';
        break;
      case hour.wydajnosc.lozko:
        hour.waskiZasob = 'Łóżka';
        break;
      case hour.wydajnosc.lozkoObserwacja:
        hour.waskiZasob = 'Obs. Łóżka';
        break;
      default:
        hour.waskiZasob = 'Demand';
    }

    return hour;
  }

  obliczMozliwoscPokryciaZopatrzenia(hour: Hour) {
    hour.mozliwoscPokryciaZopatrzenia = hour.waskaWydajnosc <= hour.liczbaWizyt ? 'Niedobór wyd.' : '';

    return hour;
  }

  obliczObsluga(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.obsluga[zasob] = Math.min(hour.wydajnosc[zasob], hour.liczbaWizyt + kolejka[zasob]);
    }

    return hour;
  }

  obliczKolejka(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.kolejka[zasob] = kolejka[zasob] + hour.liczbaWizyt - hour.obsluga[zasob];
    }

    return hour;
  }

  obliczOczekiwanie(hour: Hour, nextHour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.oczekiwanie[zasob] = hour.kolejka[zasob] / nextHour.wydajnosc[zasob];
    }

    return hour;
  }

  obliczLq(hour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      if (hour.oczekiwanie[zasob] > 0) {
        hour.lq[zasob] = 0;
      } else {
        // Calling Lq function implemented from VBA script
        hour.lq[zasob] = this.Lq({
          arrivalRate: hour.liczbaWizyt,
          serviceRate: 60 / CONSTANTS.sredniCzasNaPacjenta[zasob], // Wydajnosc godzinowa 1 zasobu
          servers: hour.zasoby[zasob],
        });

        if (typeof hour.lq[zasob] === 'number') {
          hour.lq[zasob] *= CONSTANTS.wspolczynnikV;
        }
      }
    }

    return hour;
  }

  obliczWq(hour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      if (typeof hour.lq[zasob] === 'number') {
        hour.wq[zasob] = hour.lq[zasob] / hour.liczbaWizyt;
      } else {
        hour.wq[zasob] = 'INVALID VALUE TYPE - STR';
      }
    }

    return hour;
  }

  obliczOpoznienieOgolem(hour: Hour) {
    if (typeof hour.wq.pielegniarka !== 'number' || typeof hour.wq.lekarz !== 'number') {
      hour.opoznienieOgolem = 'INVALID VALUE TYPE - STR';
    } else {
      hour.opoznienieOgolem =
        Math.max(hour.oczekiwanie.pielegniarka, hour.oczekiwanie.lekarz) + hour.wq.pielegniarka + hour.wq.lekarz;
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

  applySummaryCalcuationsForPinnedRows(hours: Hour[]) {
    const summaryRowTop = { ...this.summaryRowTop() };
    const summaryRowBottom = { ...this.summaryRowBottom() };

    summaryRowTop.liczbaWizyt = hours.reduce((acc, hour) => {
      return acc + hour.liczbaWizyt;
    }, 0);

    for (const zasob of ['lekarz', 'pielegniarka', 'lozko', 'lozkoObserwacja'] as const) {
      summaryRowTop.wydajnosc[zasob] = hours.reduce((acc, hour) => {
        return acc + hour.wydajnosc[zasob];
      }, 0);

      summaryRowBottom.wydajnosc[zasob] = summaryRowTop.liczbaWizyt / summaryRowTop.wydajnosc[zasob];
    }

    // Update signals
    this.summaryRowTop.set(summaryRowTop);
    this.summaryRowBottom.set(summaryRowBottom);
  }

  getExtremeValues(hours: Hour[]) {
    const opoznienia: number[] = hours
      .map(hour => (typeof hour.opoznienieOgolem === 'number' ? hour.opoznienieOgolem : NaN))
      .filter(opoznienie => !isNaN(opoznienie));

    this.minValue.set(Math.min(...opoznienia));
    this.maxValue.set(Math.max(...opoznienia));
  }

  readonly minValue = signal<number>(0);
  readonly maxValue = signal<number>(0);
  readonly wczorajszaKolejka = signal<kolejka>({
    lekarz: 7.8053,
    pielegniarka: 20.5828,
  });
  readonly rowData = signal<Hour[]>([
    {
      id: 0,
      godzina: '0-1',
      liczbaWizyt: 3.23,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0.3382,
        pielegniarka: 3.7158,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 2.7882,
        pielegniarka: 18.7608,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 3.7158,
    },
    {
      id: 1,
      godzina: '1-2',
      liczbaWizyt: 2.39,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 3.1897,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0.0175,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 16.1045,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 3.1905,
    },
    {
      id: 2,
      godzina: '2-3',
      liczbaWizyt: 2.14,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 2.6141,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 13.1983,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 2.6146,
    },
    {
      id: 3,
      godzina: '3-4',
      liczbaWizyt: 1.83,
      zasoby: {
        lekarz: 8,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 1.976,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 9.7675,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 1.976,
    },
    {
      id: 4,
      godzina: '4-5',
      liczbaWizyt: 1.7,
      zasoby: {
        lekarz: 8,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 1.3129,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 6.6287,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 1.3129,
    },
    {
      id: 5,
      godzina: '5-6',
      liczbaWizyt: 1.67,
      zasoby: {
        lekarz: 8,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 0.644,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0.1051,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 3.512,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.644,
    },
    {
      id: 6,
      godzina: '6-7',
      liczbaWizyt: 1.8,
      zasoby: {
        lekarz: 8,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 0,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 0,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.0097,
    },
    {
      id: 7,
      godzina: '7-8',
      liczbaWizyt: 2.96,
      zasoby: {
        lekarz: 8,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 0,
      },
      lq: {
        lekarz: 0.0361,
        pielegniarka: 0.1907,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0.0337,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 0,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.0011,
    },
    {
      id: 8,
      godzina: '8-9',
      liczbaWizyt: 5.66,
      zasoby: {
        lekarz: 8,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 0.6404,
      },
      lq: {
        lekarz: 1.47,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0.1589,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 5.6587,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 0.2061,
    },
    {
      id: 9,
      godzina: '9-10',
      liczbaWizyt: 9.25,
      zasoby: {
        lekarz: 8,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 0,
        pielegniarka: 0.0472,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0.1051,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 0,
        pielegniarka: 0.4171,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 0.422,
    },
    {
      id: 10,
      godzina: '10-11',
      liczbaWizyt: 12.15,
      zasoby: {
        lekarz: 8,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 10.9919,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 0.1413,
        pielegniarka: 0.422,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 1.553,
        pielegniarka: 3.7287,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 0.9221,
    },
    {
      id: 11,
      godzina: '11-12',
      liczbaWizyt: 13.25,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 10.99,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 10.9919,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 0.4015,
        pielegniarka: 0.9221,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 4.4175,
        pielegniarka: 8.1473,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 8.84,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.3236,
    },
    {
      id: 12,
      godzina: '12-13',
      liczbaWizyt: 12.25,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 0.9006,
        pielegniarka: 1.3081,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 7.4194,
        pielegniarka: 11.5576,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.3081,
    },
    {
      id: 13,
      godzina: '13-14',
      liczbaWizyt: 10.52,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 1.1755,
        pielegniarka: 1.4982,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 9.696,
        pielegniarka: 13.7333,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.4982,
    },
    {
      id: 14,
      godzina: '14-15',
      liczbaWizyt: 9.44,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 1.32,
        pielegniarka: 1.5664,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 10.8845,
        pielegniarka: 13.8961,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.5664,
    },
    {
      id: 15,
      godzina: '15-16',
      liczbaWizyt: 9.73,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 1.5004,
        pielegniarka: 1.674,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 12.3688,
        pielegniarka: 14.7323,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.6674,
    },
    {
      id: 16,
      godzina: '16-17',
      liczbaWizyt: 10.29,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 1.7486,
        pielegniarka: 1.83,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 14.4154,
        pielegniarka: 16.1745,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.8321,
    },
    {
      id: 17,
      godzina: '17-18',
      liczbaWizyt: 10.1,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 1.974,
        pielegniarka: 1.9754,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 16.2735,
        pielegniarka: 17.4538,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 1.9754,
    },
    {
      id: 18,
      godzina: '18-19',
      liczbaWizyt: 9.34,
      zasoby: {
        lekarz: 6,
        pielegniarka: 7,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 2.1064,
        pielegniarka: 2.0302,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 17.3654,
        pielegniarka: 17.5142,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.1064,
    },
    {
      id: 19,
      godzina: '19-20',
      liczbaWizyt: 8.57,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 8.84,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 8.8355,
      },
      oczekiwanie: {
        lekarz: 2.0685,
        pielegniarka: 2.2034,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 17.0526,
        pielegniarka: 17.6841,
      },
      waskiZasob: 'Lekarze',
      waskaWydajnosc: 8.24,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.2034,
    },
    {
      id: 20,
      godzina: '20-21',
      liczbaWizyt: 7.61,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 2.138,
        pielegniarka: 2.7803,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 17.6142,
        pielegniarka: 21.8433,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.7803,
    },
    {
      id: 21,
      godzina: '21-22',
      liczbaWizyt: 6.33,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 2.06,
        pielegniarka: 2.6702,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 16.9768,
        pielegniarka: 21.2534,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.6702,
    },
    {
      id: 22,
      godzina: '22-23',
      liczbaWizyt: 5.08,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 1.836,
        pielegniarka: 2.714,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 15.1539,
        pielegniarka: 21.523,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
      opoznienieOgolem: 2.714,
    },
    {
      id: 23,
      godzina: '23-24',
      liczbaWizyt: 4.08,
      zasoby: {
        lekarz: 6,
        pielegniarka: 4,
        lozko: 50,
        lozkoObserwacja: 15.0,
      },
      wydajnosc: {
        lekarz: 8.24,
        pielegniarka: 5.05,
        lozko: 12.18,
        lozkoObserwacja: 11.36,
      },
      obsluga: {
        lekarz: 8.244,
        pielegniarka: 5.0489,
      },
      oczekiwanie: {
        lekarz: 0.9468,
        pielegniarka: 4.0767,
      },
      lq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      wq: {
        lekarz: 0,
        pielegniarka: 0,
      },
      kolejka: {
        lekarz: 7.8053,
        pielegniarka: 20.5828,
      },
      waskiZasob: 'Pielegn',
      waskaWydajnosc: 5.05,
      mozliwoscPokryciaZopatrzenia: '',
      opoznienieOgolem: 4.0767,
    },
  ]);
  readonly summaryRowTop = signal<SummaryTop>({
    id: 24,
    liczbaWizyt: 0,
    wydajnosc: {
      lekarz: 0,
      pielegniarka: 0,
      lozko: 0,
      lozkoObserwacja: 0,
    },
  });
  readonly summaryRowBottom = signal<SummaryBottom>({
    id: 25,
    wydajnosc: {
      lekarz: 0,
      pielegniarka: 0,
      lozko: 0,
      lozkoObserwacja: 0,
    },
  });
}
