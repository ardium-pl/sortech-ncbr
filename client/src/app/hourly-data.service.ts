import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import * as MoreRounding from 'more-rounding';
import { catchError } from 'rxjs';
import { CONSTANTS } from './constants';
import { Hour, kolejka, daneGodzinowe } from './interfaces/hour';
import { SummaryBottom, SummaryTop } from './interfaces/summaries';
import { Godzina, LQparams, zasob, SredniCzasNaPacjenta } from './utils/utils';
import {
  defaultRowData,
  defaultSummaryRowBottom,
  defaultSummaryRowTop,
  defaultWoczorajszaKolejka,
} from './utils/default-table-data';
import { apiUrl } from './utils/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class HourlyDataService {
  readonly currentDayOfWeek = signal<number>(0);

  readonly currentDate = signal<Date>(new Date(2024, 7, 7));

  private readonly http = inject(HttpClient);

  // constructor() {
  //   this.fetchRowData();
  // }

  fetchRowData(date: string) {
    const sub = this.http
      .get<any>(apiUrl('/hourly-data'), { params: { date: date } })
      .pipe(
        catchError((err, caught) => {
          console.error(err);
          sub.unsubscribe();
          return caught;
        })
      )
      .subscribe(res => {
        // construct & format rowData (=daneGodzinowe)
        const mappedData = (res.currentDayData as any[]).map((v, i): daneGodzinowe => {
          return {
            id: i,
            godzina: `${i}-${i + 1}` as keyof Godzina,
            liczbaWizyt: res.patientsPerHourData[i].liczba_pacjentow,
            zasoby: {
              pielegniarka: v.ilosc_pielegniarek,
              lekarz: v.ilosc_lekarzy,
              lozko: v.ilosc_lozek,
              lozkoObserwacja: v.ilosc_lozek_obserwacji,
            },
          };
        });

        // Log response for inspection
        console.log('✉️ Response body: \n', res);

        // set wczorajszaKolejka
        this.wczorajszaKolejka.set({
          lekarz: res.prevDayLastHourData.kolejka_lekarz,
          pielegniarka: res.prevDayLastHourData.kolejka_pielegniarka,
        });

        // set rowData
        this.applyHourCalculations(mappedData);
      });
  }

  applyHourCalculations(daneGodzinowe: daneGodzinowe[], changedRow?: daneGodzinowe) {
    if (changedRow) {
      daneGodzinowe[changedRow['id']] = changedRow;
    }

    // Placeholder values which will be calculated in later steps
    let hours: Hour[] = daneGodzinowe.map(daneGodziny => ({
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
    }));

    // Obliczenia część pierwsza - dot. kalkulacji z użyciem godziny obecnej, bądź minionej
    for (let index = 0; index < hours.length; index++) {
      const hour = hours[index];
      const previousHour = index > 0 ? hours[index - 1] : hours[0];

      // this.obliczOczekiwaneWizyty(hour); // Tego nie trzeba wywoływać jak bierzemy dane o l. pacjentów z backendu
      this.obliczWydajnosc(hour, previousHour, hours[0]);
      this.obliczWaskaWydajnosc(hour);
      this.obliczWaskiZasob(hour);
      this.obliczMozliwoscPokryciaZopatrzenia(hour);
      this.obliczObsluga(hour, previousHour);
      this.obliczKolejka(hour, previousHour);
    }

    // Obliczenia część druga - dot. kalkulacji z użyciem godziny obecnej, bądź przyszłej
    for (let index = 0; index < hours.length; index++) {
      const hour = hours[index];
      const nextHour = index !== 23 ? hours[index + 1] : hours[0];

      this.obliczOczekiwanie(hour, nextHour);
      this.obliczLq(hour);
      this.obliczWq(hour);
      this.obliczOpoznienieOgolem(hour);
    }

    // Get min and max value of delay
    this.getExtremeValues(hours);

    // Assign calculated hours to the rowData & summaryRows signals
    this.rowData.set(hours);
    this.applySummaryCalcuationsForPinnedRows(hours);
  }

  obliczOczekiwaneWizyty(hour: Hour) {
    hour.liczbaWizyt = 7 * CONSTANTS.pacjentDzien * CONSTANTS.godzina[hour.godzina] * CONSTANTS.dzien[this.currentDayOfWeek()];
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
  }

  obliczWaskaWydajnosc(hour: Hour) {
    hour.waskaWydajnosc = Math.min(...Object.values(hour.wydajnosc));
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
  }

  obliczMozliwoscPokryciaZopatrzenia(hour: Hour) {
    hour.mozliwoscPokryciaZopatrzenia = hour.waskaWydajnosc <= hour.liczbaWizyt ? 'Niedobór wyd.' : '';
  }

  obliczObsluga(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.obsluga[zasob] = Math.min(hour.wydajnosc[zasob], hour.liczbaWizyt + kolejka[zasob]);
    }
  }

  obliczKolejka(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.kolejka[zasob] = kolejka[zasob] + hour.liczbaWizyt - hour.obsluga[zasob];
    }
  }

  obliczOczekiwanie(hour: Hour, nextHour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      hour.oczekiwanie[zasob] = hour.kolejka[zasob] / nextHour.wydajnosc[zasob];
    }
  }

  obliczLq(hour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      if (hour.oczekiwanie[zasob] > 0) {
        hour.lq[zasob] = 0;
      } else {
        // Calling Lq function implemented from VBA script
        hour.lq[zasob] = this.Lq({
          arrivalRate: hour.liczbaWizyt,
          serviceRate: 1 / CONSTANTS.sredniCzasNaPacjenta[zasob], // Wydajnosc godzinowa 1 zasobu
          servers: hour.zasoby[zasob],
        });

        if (typeof hour.lq[zasob] === 'number') {
          (hour.lq[zasob] as number) *= CONSTANTS.wspolczynnikV;
        }
      }
    }
  }

  obliczWq(hour: Hour) {
    for (const zasob of ['lekarz', 'pielegniarka'] as const) {
      if (typeof hour.lq[zasob] === 'number') {
        hour.wq[zasob] = (hour.lq[zasob] as number) / hour.liczbaWizyt;
      } else {
        hour.wq[zasob] = 'INVALID VALUE TYPE - STR';
      }
    }
  }

  obliczOpoznienieOgolem(hour: Hour) {
    if (typeof hour.wq.pielegniarka !== 'number' || typeof hour.wq.lekarz !== 'number') {
      hour.opoznienieOgolem = 'INVALID VALUE TYPE - STR';
    } else {
      hour.opoznienieOgolem =
        Math.max(hour.oczekiwanie.pielegniarka, hour.oczekiwanie.lekarz) + hour.wq.pielegniarka + hour.wq.lekarz;
    }
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
  }

  applySummaryCalcuationsForPinnedRows(hours: Hour[]) {
    const summaryRowTop = { ...this.summaryRowTop() };
    const summaryRowBottom = { ...this.summaryRowBottom() };

    summaryRowTop.liczbaWizyt = hours.reduce((acc, hour) => acc + hour.liczbaWizyt, 0);

    for (const zasob of ['lekarz', 'pielegniarka', 'lozko', 'lozkoObserwacja'] as const) {
      summaryRowTop.wydajnosc[zasob] = hours.reduce((acc, hour) => acc + hour.wydajnosc[zasob], 0);

      summaryRowBottom.wydajnosc[zasob] = summaryRowTop.liczbaWizyt / summaryRowTop.wydajnosc[zasob];
    }

    // Update signals
    this.summaryRowTop.set(summaryRowTop);
    this.summaryRowBottom.set(summaryRowBottom);
  }

  getExtremeValues(hours: Hour[]) {
    const { min, max } = hours.reduce(
      (acc, hour) => {
        if (typeof hour.opoznienieOgolem === 'number') {
          acc.min = Math.min(acc.min, hour.opoznienieOgolem);
          acc.max = Math.max(acc.max, hour.opoznienieOgolem);
        } else {
        }
        return acc;
      },
      { min: Infinity, max: -Infinity }
    );

    this.minValue.set(min);
    this.maxValue.set(max);

    // const opoznienia: number[] = hours
    //   .map(hour => (typeof hour.opoznienieOgolem === 'number' ? hour.opoznienieOgolem : NaN))
    //   .filter(opoznienie => !isNaN(opoznienie));

    // this.minValue.set(Math.min(...opoznienia));
    // this.maxValue.set(Math.max(...opoznienia));
  }

  readonly minValue = signal<number>(0);
  readonly maxValue = signal<number>(0);
  readonly wczorajszaKolejka = signal<kolejka>(defaultWoczorajszaKolejka);
  readonly rowData = signal<Hour[]>(defaultRowData);
  readonly summaryRowTop = signal<SummaryTop>(defaultSummaryRowTop);
  readonly summaryRowBottom = signal<SummaryBottom>(defaultSummaryRowBottom);

  // KOD NIŻEJ BEDZIE PEWNIE DO USUNIECIA
  // applyHourCalculationsPrevious(daneGodzinowe: daneGodzinowe[], changedRow?: daneGodzinowe) {
  //   if (changedRow) {
  //     daneGodzinowe[changedRow['id']] = changedRow;
  //   }

  //   let hours: Hour[] = daneGodzinowe.map((daneGodziny, index) => {
  //     // Placeholder values which will be calculated in later steps
  //     let hour: Hour = {
  //       ...daneGodziny,
  //       wydajnosc: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //         lozko: 0,
  //         lozkoObserwacja: 0,
  //       },
  //       obsluga: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //       },
  //       oczekiwanie: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //       },
  //       lq: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //       },
  //       wq: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //       },
  //       kolejka: {
  //         lekarz: 0,
  //         pielegniarka: 0,
  //       },
  //       waskiZasob: '',
  //       waskaWydajnosc: 0,
  //       mozliwoscPokryciaZopatrzenia: '',
  //       opoznienieOgolem: 0,
  //     };

  //     // Access the previous hour (if exists) - otherwise assign the first hour
  //     const previousHour = index > 0 ? hours[index - 1] : hours[0];

  //     // Obliczenia część pierwsza - dot. kalkulacji z użyciem godziny obecnej, bądź minionej
  //     hour = this.obliczWydajnosc(hour, previousHour, hours[0]);
  //     hour = this.obliczWaskaWydajnosc(hour);
  //     hour = this.obliczWaskiZasob(hour);
  //     hour = this.obliczMozliwoscPokryciaZopatrzenia(hour);
  //     hour = this.obliczObsluga(hour, previousHour);
  //     hour = this.obliczKolejka(hour, previousHour);
  //     return hour;
  //   });

  //   // Obliczenia część druga - dot. kalkulacji z użyciem godziny obecnej, minionej lub przyszłej
  //   hours.forEach((hour, index, hours) => {
  //     // Access the next hour (if exists) - otherwise assign the first hour
  //     const nextHour = index !== 23 ? hours[index + 1] : hours[0];

  //     hour = this.obliczOczekiwanie(hour, nextHour);
  //     hour = this.obliczLq(hour);
  //     hour = this.obliczWq(hour);
  //     hour = this.obliczOpoznienieOgolem(hour);
  //   });

  //   // Get min and max value of delay
  //   this.getExtremeValues(hours);

  //   // Assign calculated hours to the rowData & summaryRows signals
  //   this.rowData.set(hours);
  //   this.applySummaryCalcuationsForPinnedRows(hours);
  // }
}
