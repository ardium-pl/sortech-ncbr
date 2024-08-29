import { Injectable, inject } from '@angular/core';
import { HourlyDataService } from './hourly-data.service';
import { StaticDataService } from './static-data.service';
import { HttpClient } from '@angular/common/http';
import { daneGodzinowe } from './interfaces/hour';
import { apiUrl } from './utils/apiUrl';
import { StaticRow } from './interfaces/static-row';
import { LABELS_ZASOBY } from './constants';

// THIS DATA IS MISSING !!!
const BRAKUJACY_RZAD_TRIAGE = {
  id: 0,
  typPacjenta: 'Triage',
  procPacjentow: 0,
  zasoby: {
    triage: 5,
    lozko: 0,
    lekarz: 0,
    pielegniarka: 0,
    lozkoObserwacja: 0,
    lozkoOczekiwanie: 0,
  },
  wydajnoscPrzyjmowania: 0,
};
const BRAKUJACY_RZAD_OCZEKIWANIE_NA_PRZYJECIE = {
  id: 7,
  typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
  procPacjentow: 0,
  zasoby: {
    triage: 5,
    lozko: 0,
    lekarz: 0,
    pielegniarka: 0,
    lozkoObserwacja: 0,
    lozkoOczekiwanie: 0,
  },
  wydajnoscPrzyjmowania: 0,
};
const BRAKUJACY_RZAD_LICZBA_ZASOBOW = {
  id: 8,
  typPacjenta: 'Liczba zasobów',
  procPacjentow: 0,
  zasoby: {
    triage: 5,
    lozko: 50,
    lekarz: 6,
    pielegniarka: 8,
    lozkoObserwacja: 20,
    lozkoOczekiwanie: 30,
  },
  wydajnoscPrzyjmowania: 0,
};

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  private readonly http = inject(HttpClient);
  readonly staticDataService = inject(StaticDataService);
  readonly hourlyDataService = inject(HourlyDataService);

  fetchRowData(date: string) {
    const sub = this.http.get<any>(apiUrl('/dane'), { params: { date: date } }).subscribe({
      next: res => {
        console.log('✅ Response received sucessfully, response body: ', res);
        try {
          // construct & format rowData (=daneGodzinowe)
          const mappedDataHourly = (res.daneGodzinowe as any[]).map((v, i): daneGodzinowe => {
            return {
              id: i,
              godzina: v.godzina,
              liczbaWizyt: v.liczbaPacjentow,
              zasoby: {
                pielegniarka: v.zasoby.liczbaPielegniarek,
                lekarz: v.zasoby.liczbaLekarzy,
                lozko: v.zasoby.liczbaLozek,
                lozkoObserwacja: v.zasoby.liczbaLozekObserwacyjnych,
              },
            };
          });

          const mappedDataStatic = (res.czasZasobuNaPacjenta as any[]).map((v, i): StaticRow => {
            return {
              id: i + 1, // +1 bc missing 'Triage' row should be first
              typPacjenta: LABELS_ZASOBY[i + 1], // +1 bc missing 'Triage' row should be first
              procPacjentow: Object.values(res.statystykaChorych)[i] as number,
              zasoby: {
                triage: 0, // Missing
                pielegniarka: v.pielegniarka,
                lekarz: v.lekarz,
                lozko: v.lozko,
                lozkoObserwacja: v.lozkoObserwacyjne,
                lozkoOczekiwanie: 0, // Missing
              },
              wydajnoscPrzyjmowania: 0, // Missing
            };
          });

          // Those 2 lines below are temporary
          mappedDataStatic.unshift(BRAKUJACY_RZAD_TRIAGE);
          mappedDataStatic.push(BRAKUJACY_RZAD_OCZEKIWANIE_NA_PRZYJECIE, BRAKUJACY_RZAD_LICZBA_ZASOBOW);

          // set wczorajszaKolejka
          this.hourlyDataService.wczorajszaKolejka.set({
            lekarz: res.kolejka.lekarz,
            pielegniarka: res.kolejka.pielegniarka,
          });

          // set hourlyDataService rowData
          this.hourlyDataService.applyHourCalculations(mappedDataHourly);
          console.log('✅ Successfully initialized table data (hourlyDataService)!');

          // set staticDataService rowData
          this.staticDataService.applyRowCalculations(mappedDataStatic);
          console.log('✅ Successfully initialized table data (staticDataService)!');
        } catch (err) {
          console.log('❌ An error occured during initializing table data from the response body, error message: ', err, '❌');
        }
      },
      error: err => {
        console.log('❌ Error performing the http request, error message: ', err, '❌');
        sub.unsubscribe();
        console.log('⚙️ Subscription terminanated by unsubscribing.');
      },
    });
  }

  constructor() {}
}
