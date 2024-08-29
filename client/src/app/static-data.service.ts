import { inject, Injectable, signal } from '@angular/core';
import { StaticRow } from './interfaces/static-row';
import { WaskieGardlo, ZasobyITriage } from './interfaces/zasoby';
import { ZasobyTriageILozkoOczekiwanie } from './interfaces/zasoby';
import { LABELS_METRYKI, LABELS_ZASOBY } from './constants';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
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
    this.obliczWydajnoscZasobu(meanTimePerPatient, wydajnoscZasobu, liczbaZasobow);

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
  obliczWydajnoscZasobu(meanTimePerPatient: StaticRow, wydajnoscZasobu: StaticRow, liczbaZasobow: StaticRow) {
    for (const zasob of Object.values(ZasobyTriageILozkoOczekiwanie)) {
      wydajnoscZasobu.zasoby[zasob] = liczbaZasobow.zasoby[zasob]! / meanTimePerPatient.zasoby[zasob]!;
    }
    wydajnoscZasobu['wydajnoscPrzyjmowania'] = liczbaZasobow['wydajnoscPrzyjmowania']! / meanTimePerPatient['procPacjentow']!;
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

  readonly rowData = signal<StaticRow[]>([
    {
      id: 0,
      typPacjenta: 'Triage',
      procPacjentow: 1,
      zasoby: {
        triage: 5,
        lozko: null,
        lekarz: null,
        pielegniarka: null,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 1,
      typPacjenta: '1. Resuscytacja',
      procPacjentow: 0.0131322314049587,
      zasoby: {
        triage: null,
        lozko: 6,
        lekarz: 90,
        pielegniarka: 120,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 2,
      typPacjenta: '2. Stan zagrożenia życia',
      procPacjentow: 0.146321212121212,
      zasoby: {
        triage: null,
        lozko: 6,
        lekarz: 60,
        pielegniarka: 90,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 3,
      typPacjenta: '3. Pilny przypadek ostry',
      procPacjentow: 0.44884738292011,
      zasoby: {
        triage: null,
        lozko: 5,
        lekarz: 40,
        pielegniarka: 40,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 4,
      typPacjenta: '4. Pilny przypadek nieostry',
      procPacjentow: 0.316226170798898,
      zasoby: {
        triage: null,
        lozko: 2.5,
        lekarz: 20,
        pielegniarka: 20,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 5,
      typPacjenta: '5. Niepilny',
      procPacjentow: 0.0754396694214876,
      zasoby: {
        triage: null,
        lozko: 1.5,
        lekarz: 20,
        pielegniarka: 10,
        lozkoObserwacja: null,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 6,
      typPacjenta: 'Obserwacja',
      procPacjentow: 0.11,
      zasoby: {
        triage: null,
        lozko: null,
        lekarz: 72,
        pielegniarka: 72,
        lozkoObserwacja: 12,
        lozkoOczekiwanie: null,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 7,
      typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
      procPacjentow: 0.4,
      zasoby: {
        triage: null,
        lozko: null,
        lekarz: null,
        pielegniarka: null,
        lozkoObserwacja: null,
        lozkoOczekiwanie: 6,
      },
      wydajnoscPrzyjmowania: 5,
    },
    {
      id: 8,
      typPacjenta: 'Liczba zasobów',
      procPacjentow: null,
      zasoby: {
        triage: 2,
        lozko: 50,
        lekarz: 6,
        pielegniarka: 8,
        lozkoObserwacja: 20,
        lozkoOczekiwanie: 30,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 9,
      typPacjenta: 'Średni ważony czas na pacjenta',
      procPacjentow: null,
      zasoby: {
        triage: 5.0,
        lozko: 4.1,
        lekarz: 43.7,
        pielegniarka: 44.5,
        lozkoObserwacja: 1.3,
        lozkoOczekiwanie: 2.4,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 10,
      typPacjenta: 'Wydajność (napływ pacj./godz.)',
      procPacjentow: null,
      zasoby: {
        triage: 30.0,
        lozko: 12.18,
        lekarz: 8.24,
        pielegniarka: 10.78,
        lozkoObserwacja: 15.15,
        lozkoOczekiwanie: 12.5,
      },
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 11,
      typPacjenta: 'Zajętość przy danej wydajności',
      procPacjentow: null,
      zasoby: {
        triage: 27,
        lozko: 68,
        lekarz: 100,
        pielegniarka: 76,
        lozkoObserwacja: 54,
        lozkoOczekiwanie: 66,
      },
      wydajnoscPrzyjmowania: 66,
    },
  ]);

  constructor() {}
}
