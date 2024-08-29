import { inject, Injectable, signal } from '@angular/core';
import { StaticRow } from './interfaces/static-row';
import { WaskieGardlo, ZasobyITriage } from './interfaces/zasoby';
import { ZasobyTriageILozkoOczekiwanie } from './interfaces/zasoby';
import { LABELS_METRYKI, LABELS_ZASOBY } from './constants';
import { defaultRowDataStatic } from './utils/default-table-data';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  // Wydajnosc przyjmowania w jednostkach godzinowych, reszta zamieniona na minuty
  applyRowCalculations(daneStatyczne: StaticRow[], changedRow?: StaticRow) {
    if (changedRow) {
      daneStatyczne[changedRow['id']] = changedRow;
    }

    // Placeholder values which will be calculated in later steps
    const metrykiDefaults: StaticRow[] = LABELS_METRYKI.map((label, i) => ({
      id: daneStatyczne.length + i,
      typPacjenta: label,
      procPacjentow: 0,
      zasoby: {
        triage: 0,
        lozko: 0,
        lekarz: 0,
        pielegniarka: 0,
        lozkoObserwacja: 0,
        lozkoOczekiwanie: 0,
      },
      wydajnoscPrzyjmowania: 0,
    }));

    // Rows essenntial for performing the calculations
    let liczbaZasobow: StaticRow = daneStatyczne[daneStatyczne.length - 1];
    let [meanTimePerPatient, wydajnoscZasobu, zajetosc] = metrykiDefaults;

    this.obliczSredniCzasNaPacjenta(meanTimePerPatient, daneStatyczne);
    this.obliczWydajnoscZasobu(meanTimePerPatient, wydajnoscZasobu, liczbaZasobow, daneStatyczne);

    const minWydajnosci = Math.min(
      wydajnoscZasobu.zasoby.triage!,
      wydajnoscZasobu.zasoby.lozko!,
      wydajnoscZasobu.zasoby.lekarz!,
      wydajnoscZasobu.zasoby.pielegniarka!,
      wydajnoscZasobu.zasoby.lozkoObserwacja!
    );
    const przyjeciePacjentow = daneStatyczne[7].procPacjentow! * minWydajnosci;

    this.oznaczWaskieGardlo(wydajnoscZasobu, minWydajnosci, daneStatyczne, przyjeciePacjentow);
    this.obliczZajetosc(zajetosc, wydajnoscZasobu, minWydajnosci);

    // Add calculated metric rows to the main array
    daneStatyczne.push(meanTimePerPatient, wydajnoscZasobu, zajetosc);

    // console.log(JSON.stringify(daneStatyczne, null, 4));
    this.rowData.set(daneStatyczne);
  }

  obliczSredniCzasNaPacjenta(meanTimePerPatient: StaticRow, daneStatyczne: StaticRow[]) {
    for (const zasob of Object.values(ZasobyTriageILozkoOczekiwanie)) {
      meanTimePerPatient.zasoby[zasob] = daneStatyczne.slice(0, daneStatyczne.length).reduce((acc, row) => {
        return acc + row.procPacjentow! * row.zasoby[zasob]!;
      }, 0);
    }
    meanTimePerPatient['wydajnoscPrzyjmowania'] = null;
  }
  obliczWydajnoscZasobu(
    meanTimePerPatient: StaticRow,
    wydajnoscZasobu: StaticRow,
    liczbaZasobow: StaticRow,
    daneStatyczne: StaticRow[]
  ) {
    for (const zasob of Object.values(ZasobyTriageILozkoOczekiwanie)) {
      wydajnoscZasobu.zasoby[zasob] = (liczbaZasobow.zasoby[zasob]! * 60) / meanTimePerPatient.zasoby[zasob]!;
    }
    wydajnoscZasobu['wydajnoscPrzyjmowania'] =
      (daneStatyczne[daneStatyczne.length - 2]['wydajnoscPrzyjmowania']!) /
      daneStatyczne[daneStatyczne.length - 2]['procPacjentow']!;
  }
  obliczZajetosc(zajetosc: StaticRow, wydajnoscZasobu: StaticRow, minWydajnosci: number) {
    for (const zasob of Object.values(ZasobyTriageILozkoOczekiwanie)) {
      zajetosc.zasoby[zasob] = minWydajnosci / wydajnoscZasobu.zasoby[zasob]!;
    }
    zajetosc.wydajnoscPrzyjmowania = minWydajnosci / wydajnoscZasobu.wydajnoscPrzyjmowania!;
  }
  oznaczWaskieGardlo(wydajnoscZasobu: StaticRow, minWydajnosci: number, daneStatyczne: StaticRow[], przyjeciePacjentow: number) {
    this.waskieGardlo.update(waskieGardo => {
      for (let zasob of Object.values(ZasobyITriage)) {
        waskieGardo[zasob] = wydajnoscZasobu.zasoby[zasob] === minWydajnosci;
      }
      waskieGardo['lozkoOczekiwanie'] = wydajnoscZasobu.zasoby['lozkoOczekiwanie']! < minWydajnosci;
      waskieGardo['wydajnoscPrzyjmowania'] = daneStatyczne[7]['wydajnoscPrzyjmowania']! < przyjeciePacjentow;

      return waskieGardo;
    });
  }

  readonly waskieGardlo = signal<WaskieGardlo>({
    triage: false,
    lozko: false,
    lekarz: false,
    pielegniarka: false,
    lozkoObserwacja: false,
    lozkoOczekiwanie: false,
    wydajnoscPrzyjmowania: false,
  });

  readonly rowData = signal<StaticRow[]>(defaultRowDataStatic);

  constructor() {}
}
