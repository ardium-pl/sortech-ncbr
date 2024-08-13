import { Injectable, signal } from '@angular/core';
import { CONSTANTS } from './constants';
import { StaticRow } from './interfaces/static-row';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  updateRows(changedRow: StaticRow) {
    this.rowData.update(rows => rows.map(rows => (changedRow.id === rows.id ? changedRow : rows)));
  }

  applyRowCalculations(rowData: StaticRow[], changedRow?: StaticRow) {
    let rows: StaticRow[];

    if (changedRow) {
      rows = rowData.map(row => {
        return row.id === changedRow.id ? changedRow : row;
      });
    } else {
      rows = rowData;
    }

    let liczbaZasobow = rows[8];
    let meanTimePerPatient = rows[9];
    let wydajnoscZasobu = rows[10];
    let waskieGardo = rows[11];
    let zajetosc = rows[12];

    const fields = [
      'triage',
      'lozko',
      'lekarz',
      'pielegniarka',
      'lozkoObserwacja',
      'lozkoOczekiwanie',
      'wydajnoscPrzyjmowania',
    ] as const;

    // oblicz Średni ważony czas na pacjenta
    fields.slice(0, 6).forEach(field => {
      meanTimePerPatient[field] = rows.slice(0, 8).reduce((acc, row) => {
        return acc + row.procPacjentow! * row[field]!;
      }, 0);
    });

    // Oblicz wydajnosc zasobu
    wydajnoscZasobu.triage = 60 / liczbaZasobow.triage!;
    wydajnoscZasobu.lozko = liczbaZasobow.lozko! / meanTimePerPatient.lozko!;
    wydajnoscZasobu.lekarz = (60 * liczbaZasobow.lekarz!) / meanTimePerPatient.lekarz!;
    wydajnoscZasobu.pielegniarka = (60 * liczbaZasobow.pielegniarka!) / meanTimePerPatient.pielegniarka!;
    wydajnoscZasobu.lozkoObserwacja = liczbaZasobow.lozkoObserwacja! / meanTimePerPatient.lozkoObserwacja!;
    wydajnoscZasobu.lozkoOczekiwanie = liczbaZasobow.lozkoOczekiwanie! / meanTimePerPatient.lozkoOczekiwanie!;
    wydajnoscZasobu.wydajnoscPrzyjmowania = rows[7].wydajnoscPrzyjmowania! / rows[7].procPacjentow!;

    // Wskaż wąskie gardło
    const minWydajnosci = Math.min(
      wydajnoscZasobu.triage!,
      wydajnoscZasobu.lozko!,
      wydajnoscZasobu.lekarz!,
      wydajnoscZasobu.pielegniarka!,
      wydajnoscZasobu.lozkoObserwacja!
    );

    const przyjeciePacjentow = rows[7].procPacjentow! * minWydajnosci;

    fields.slice(0, 5).forEach(field => {
      waskieGardo[field] = wydajnoscZasobu[field] === minWydajnosci ? 777 : null;
    });
    waskieGardo.lozkoOczekiwanie = wydajnoscZasobu.lozkoOczekiwanie < minWydajnosci ? 777 : null;
    waskieGardo.wydajnoscPrzyjmowania = rows[7].wydajnoscPrzyjmowania! < przyjeciePacjentow ? 777 : null;

    // Oblicz zajętość przy danej wydajości
    fields.forEach(field => {
      zajetosc[field] = minWydajnosci / wydajnoscZasobu[field]!;
    });

    // Assign back updated rows
    rows[9] = meanTimePerPatient;
    rows[10] = wydajnoscZasobu;
    rows[11] = waskieGardo;
    rows[12] = zajetosc;

    this.rowData.set(rows);
    // console.log(this.rowData()[11]);
  }

  readonly rowData = signal<StaticRow[]>([
    {
      id: 0,
      typPacjenta: 'Triage',
      procPacjentow: 1,
      triage: 5,
      lozko: null,
      lekarz: null,
      pielegniarka: null,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 1,
      typPacjenta: '1. Resuscytacja',
      procPacjentow: 0.0131322314049587,
      triage: null,
      lozko: 6,
      lekarz: 90,
      pielegniarka: 120,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 2,
      typPacjenta: '2. Stan zagrożenia życia',
      procPacjentow: 0.146321212121212,
      triage: null,
      lozko: 6,
      lekarz: 60,
      pielegniarka: 90,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 3,
      typPacjenta: '3. Pilny przypadek ostry',
      procPacjentow: 0.44884738292011,
      triage: null,
      lozko: 5,
      lekarz: 40,
      pielegniarka: 40,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 4,
      typPacjenta: '4. Pilny przypadek nieostry',
      procPacjentow: 0.316226170798898,
      triage: null,
      lozko: 2.5,
      lekarz: 20,
      pielegniarka: 20,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 5,
      typPacjenta: '5. Niepilny',
      procPacjentow: 0.0754396694214876,
      triage: null,
      lozko: 1.5,
      lekarz: 20,
      pielegniarka: 10,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 6,
      typPacjenta: 'Obserwacja',
      procPacjentow: 0.11,
      triage: null,
      lozko: null,
      lekarz: 72,
      pielegniarka: 72,
      lozkoObserwacja: 12,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 7,
      typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
      procPacjentow: 0.4,
      triage: null,
      lozko: null,
      lekarz: null,
      pielegniarka: null,
      lozkoObserwacja: null,
      lozkoOczekiwanie: 6,
      wydajnoscPrzyjmowania: 5,
    },
    {
      id: 8,
      typPacjenta: 'Liczba zasobów',
      procPacjentow: null,
      triage: 2,
      lozko: 50,
      lekarz: 6,
      pielegniarka: 8,
      lozkoObserwacja: 20,
      lozkoOczekiwanie: 30,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 9,
      typPacjenta: 'Średni ważony czas na pacjenta',
      procPacjentow: null,
      triage: 5.0,
      lozko: 4.1,
      lekarz: 43.7,
      pielegniarka: 44.5,
      lozkoObserwacja: 1.3,
      lozkoOczekiwanie: 2.4,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 10,
      typPacjenta: 'Wydajność (napływ pacj./godz.)',
      procPacjentow: null,
      triage: 30.0,
      lozko: 12.18,
      lekarz: 8.24,
      pielegniarka: 10.78,
      lozkoObserwacja: 15.15,
      lozkoOczekiwanie: 12.5,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 11,
      typPacjenta: 'Wąskie gardło',
      procPacjentow: null,
      triage: null,
      lozko: null,
      lekarz: null,
      pielegniarka: null,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      id: 12,
      typPacjenta: 'Zajętość przy danej wydajności',
      procPacjentow: null,
      triage: 27,
      lozko: 68,
      lekarz: 100,
      pielegniarka: 76,
      lozkoObserwacja: 54,
      lozkoOczekiwanie: 66,
      wydajnoscPrzyjmowania: 66,
    },
  ]);

  constructor() {}
}
