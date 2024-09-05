import { Injectable, signal } from '@angular/core';
import {
  DEFAULT_SUMMARY_ROW_TOP,
  DEFAULT_SUMMARY_ROW_BOTTOM,
  DEFAULT_KOLEJKA,
  WSPOLCZYNNIK_V,
  SREDNI_CZAS_NA_PACJENTA,
} from './constants';
import { daneGodzinowe, Hour} from './interfaces/hour';
import { SummaryBottom, SummaryTop } from './interfaces/summaries';
import { LekarzLubPielegniarka, Zasoby } from './interfaces/zasoby';
import { Kolejka, LQparams } from './interfaces/other-interfaces';

@Injectable({
  providedIn: 'root',
})
export class HourlyDataService {
  readonly minValue = signal<number>(0);
  readonly maxValue = signal<number>(0);
  readonly wczorajszaKolejka = signal<Kolejka>(DEFAULT_KOLEJKA);
  readonly rowData = signal<Hour[]>([]);
  readonly summaryRowTop = signal<SummaryTop | { id: 24 }>({ id: 24 });
  readonly summaryRowBottom = signal<SummaryBottom | { id: 25 }>({ id: 25 });

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

  obliczWydajnosc(hour: Hour, previousHour: Hour, hourZero: Hour) {
    for (const zasob of Object.values(Zasoby)) {
      let liczbaZasobow: number;
      if (hour.id === 0) {
        liczbaZasobow = hour.zasoby[zasob];
      } else if (hour.id === 23 && (zasob === 'lekarz' || zasob === 'pielegniarka')) {
        liczbaZasobow = hourZero.zasoby[zasob];
      } else {
        liczbaZasobow = zasob === 'lozkoObserwacja' ? hour.zasoby[zasob] : previousHour.zasoby[zasob];
      }
      hour.wydajnosc[zasob] = liczbaZasobow / SREDNI_CZAS_NA_PACJENTA[zasob];
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
        hour.waskiZasob = 'Łóżka obs.';
        break;
      default:
        hour.waskiZasob = 'Popyt';
    }
  }

  obliczMozliwoscPokryciaZopatrzenia(hour: Hour) {
    hour.mozliwoscPokryciaZopatrzenia = hour.waskaWydajnosc <= hour.liczbaWizyt ? 'Niedobór wyd.' : '';
  }

  obliczObsluga(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of Object.values(LekarzLubPielegniarka)) {
      hour.obsluga[zasob] = Math.min(hour.wydajnosc[zasob], hour.liczbaWizyt + kolejka[zasob]);
    }
  }

  obliczKolejka(hour: Hour, previousHour: Hour) {
    const kolejka = hour.id === 0 ? this.wczorajszaKolejka() : previousHour.kolejka;

    for (const zasob of Object.values(LekarzLubPielegniarka)) {
      hour.kolejka[zasob] = kolejka[zasob] + hour.liczbaWizyt - hour.obsluga[zasob];
    }
  }

  obliczOczekiwanie(hour: Hour, nextHour: Hour) {
    for (const zasob of Object.values(LekarzLubPielegniarka)) {
      hour.oczekiwanie[zasob] = hour.kolejka[zasob] / nextHour.wydajnosc[zasob];
    }
  }

  obliczLq(hour: Hour) {
    for (const zasob of Object.values(LekarzLubPielegniarka)) {
      if (hour.oczekiwanie[zasob] > 0) {
        hour.lq[zasob] = 0;
      } else {
        // Calling Lq function implemented from VBA script
        hour.lq[zasob] = this.Lq({
          arrivalRate: hour.liczbaWizyt,
          serviceRate: 1 / SREDNI_CZAS_NA_PACJENTA[zasob], // Wydajnosc godzinowa 1 zasobu
          servers: hour.zasoby[zasob],
        });

        if (typeof hour.lq[zasob] === 'number') {
          (hour.lq[zasob] as number) *= WSPOLCZYNNIK_V;
        }
      }
    }
  }

  obliczWq(hour: Hour) {
    for (const zasob of Object.values(LekarzLubPielegniarka)) {
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

  applySummaryCalcuationsForPinnedRows(hours: Hour[]) {
    const summaryRowTop = { ...DEFAULT_SUMMARY_ROW_TOP };
    const summaryRowBottom = { ...DEFAULT_SUMMARY_ROW_BOTTOM };

    summaryRowTop.liczbaWizyt = hours.reduce((acc, hour) => acc + hour.liczbaWizyt, 0);

    for (const zasob of Object.values(Zasoby)) {
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
  }
}
