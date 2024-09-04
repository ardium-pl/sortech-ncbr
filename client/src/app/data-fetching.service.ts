import { Injectable, inject, signal } from '@angular/core';
import { HourlyDataService } from './hourly-data.service';
import { StaticDataService } from './static-data.service';
import { HttpClient } from '@angular/common/http';
import { daneGodzinowe } from './interfaces/hour';
import { apiUrl } from './utils/apiUrl';
import { StaticRow } from './interfaces/static-row';
import { LABELS_ZASOBY, RZAD_OCZEKIWANIE_NA_PRZYJECIE, RZAD_TRIAGE } from './constants';
import { GridLoadingOverlayComponent } from './grid-loading-overlay/grid-loading-overlay.component';
import { WarningContainerComponent } from './warning-container/warning-container.component';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  private readonly http = inject(HttpClient);
  readonly staticDataService = inject(StaticDataService);
  readonly hourlyDataService = inject(HourlyDataService);

  readonly noRowsOverlayComponent = WarningContainerComponent;
  readonly gridLoadingOverlayComponent = GridLoadingOverlayComponent;
  readonly shouldRenderTables = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  fetchRowData(date: string) {
    this.isLoading.set(true);
    const sub = this.http.get<any>(apiUrl('/dane'), { params: { date: date } }).subscribe({
      next: res => {
        console.log('✅ Response received sucessfully, response body: ', res);
        try {
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
              // +1 bc 'RZAD_TRIAGE' will be the first row with id = 0
              id: i + 1,
              typPacjenta: LABELS_ZASOBY[i + 1],
              procPacjentow: Object.values(res.statystykaChorych)[i] as number,
              zasoby: {
                triage: 0, // value of 'Triage' column should be 0 for each row except 'Triage'
                pielegniarka: v.pielegniarka,
                lekarz: v.lekarz,
                lozko: v.lozko,
                lozkoObserwacja: v.lozkoObserwacyjne,
                lozkoOczekiwanie: 0, // value of 'Łóżko oczek. na przyj. do szpitala' column should be 0 for each row except 'Oczek. na przyj. na oddział leczniczy'
              },
              wydajnoscPrzyjmowania: 0, // value of 'Wydajność przyjmowania' column should be 0 for each row except 'Oczek. na przyj. na oddział leczniczy'
            };
          });

          // Set correct id
          RZAD_OCZEKIWANIE_NA_PRZYJECIE.id = mappedDataStatic.length + 1;

          // Initialize 'Liczba zasobów' row in static table based on the number of resources available at 12 hour on that day
          const RZAD_LICZBA_ZASOBOW = {
            id: mappedDataStatic.length + 2,
            typPacjenta: 'Liczba zasobów',
            procPacjentow: null, // Null
            zasoby: {
              triage: 2, // Should triage always be 2 ?
              lozko: mappedDataHourly[11].zasoby.lozko,
              lekarz: mappedDataHourly[11].zasoby.lekarz,
              pielegniarka: mappedDataHourly[11].zasoby.pielegniarka,
              lozkoObserwacja: mappedDataHourly[11].zasoby.lozkoObserwacja,
              lozkoOczekiwanie: 30, // Should triage always be 30 ?
            },
            wydajnoscPrzyjmowania: 0,
          };

          // Complate mapppedDataStatic
          mappedDataStatic.unshift(RZAD_TRIAGE);
          mappedDataStatic.push(RZAD_OCZEKIWANIE_NA_PRZYJECIE, RZAD_LICZBA_ZASOBOW);

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

          this.shouldRenderTables.set(true);
        } catch (err) {
          console.log('❌ An error occured during initializing table data from the response body. ❌\nError message:\n', err);
          this.shouldRenderTables.set(false);
          this.hourlyDataService.rowData.set([]);
          this.staticDataService.rowData.set([]);
        }
      },
      error: err => {
        console.log('❌ Error performing the http request, error message: ', err, '❌');
        sub.unsubscribe();
        this.isLoading.set(false);
        console.log('⚙️ Subscription terminanated by unsubscribing.');
      },
      complete: () => {
        sub.unsubscribe();
        this.isLoading.set(false);
      },
    });
  }
}
