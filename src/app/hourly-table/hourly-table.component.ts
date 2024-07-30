import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
  SizeColumnsToFitGridStrategy,
} from 'ag-grid-community'; // Column Definition Type Interface
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'app-hourly-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './hourly-table.component.html',
  styleUrl: './hourly-table.component.scss',
})
export class HourlyTableComponent {
  readonly HEADER_HEIGHT = 70;
  readonly GROUP_HEADER_HEIGHT = 70;

  defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    wrapHeaderText: true,
    // autoHeaderHeight: true,
    sortable: false,
    resizable: true,
    minWidth: 120,
    flex: 1,
  };

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Godzina',
      field: 'godzina',
      headerClass: 'grid-header grid-header-outer',
    },
    {
      headerName: 'Oczek. l. wizyt',
      field: 'oczekiwaneWizyty',
      headerClass: 'grid-header grid-header-outer',
    },
    {
      headerName: 'Pielęgniarki',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Liczba Pielęgn.',
          field: 'liczbaPielegniarek',
          headerClass: 'grid-header grid-header-mid',
        },
        {
          headerName: 'Wydajność l. pacj.',
          field: 'wydajnoscPielegniarek',
          headerClass: 'grid-header grid-header-mid',
        },
      ],
    },
    {
      headerName: 'Lekarze',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Liczba Lekarze',
          field: 'liczbaLekarzy',
          headerClass: 'grid-header grid-header-mid',
        },
        {
          headerName: 'Wyd. l. pacj.',
          field: 'wydajnoscLekarzy',
          headerClass: 'grid-header grid-header-mid',
        },
      ],
    },
    {
      headerName: 'Łóżka',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Liczba Łóżka',
          field: 'liczbaLozek',
          headerClass: 'grid-header grid-header-mid',
        },
        {
          headerName: 'Wyd. l. pacj.',
          field: 'wydajnoscLozek',
          headerClass: 'grid-header grid-header-mid',
        },
      ],
    },
    {
      headerName: 'Łóżka obserw.',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Liczba łóżek',
          field: 'liczbaLozekObserw',
          headerClass: 'grid-header grid-header-mid',
        },
        {
          headerName: 'Wyd. l. pacj.',
          field: 'wydajnoscLozekObserw',
          headerClass: 'grid-header grid-header-mid',
        },
      ],
    },
    {
      headerName: 'Wąskie gardło procesu',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Zasób',
          field: 'zasob',
          headerClass: 'grid-header grid-header-mid',
        },
        {
          headerName: 'Wyd. l. pacj.',
          field: 'wydajnoscWaska',
          headerClass: 'grid-header grid-header-mid',
        },
      ],
    },
    {
      headerName: 'Możliwość pokrycia zapotrz. okresu',
      field: 'mozliwoscPokrycia',
      headerClass: 'grid-header grid-header-outer',
    },
  ];

  rowData = [
    {
      godzina: '0-1',
      oczekiwaneWizyty: 3.23,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '1-2',
      oczekiwaneWizyty: 2.39,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '2-3',
      oczekiwaneWizyty: 2.14,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '3-4',
      oczekiwaneWizyty: 1.83,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '4-5',
      oczekiwaneWizyty: 1.7,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '5-6',
      oczekiwaneWizyty: 1.67,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '6-7',
      oczekiwaneWizyty: 1.8,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '7-8',
      oczekiwaneWizyty: 2.96,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '8-9',
      oczekiwaneWizyty: 5.66,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 8.84,
      mozliwoscPokrycia: '',
    },
    {
      godzina: '9-10',
      oczekiwaneWizyty: 9.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 8.84,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '10-11',
      oczekiwaneWizyty: 12.15,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 8,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 8.84,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '11-12',
      oczekiwaneWizyty: 13.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 10.99,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 8.84,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '12-13',
      oczekiwaneWizyty: 12.25,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '13-14',
      oczekiwaneWizyty: 10.52,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '14-15',
      oczekiwaneWizyty: 9.44,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '15-16',
      oczekiwaneWizyty: 9.73,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '16-17',
      oczekiwaneWizyty: 10.29,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '17-18',
      oczekiwaneWizyty: 10.1,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '18-19',
      oczekiwaneWizyty: 9.34,
      liczbaPielegniarek: 7,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '19-20',
      oczekiwaneWizyty: 8.57,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 8.84,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Lekarze',
      wydajnoscWaska: 8.24,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '20-21',
      oczekiwaneWizyty: 7.61,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '21-22',
      oczekiwaneWizyty: 6.33,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '22-23',
      oczekiwaneWizyty: 5.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: 'Niedobor wydajn',
    },
    {
      godzina: '23-24',
      oczekiwaneWizyty: 4.08,
      liczbaPielegniarek: 4,
      wydajnoscPielegniarek: 5.05,
      liczbaLekarzy: 6,
      wydajnoscLekarzy: 8.24,
      liczbaLozek: 50,
      wydajnoscLozek: 12.18,
      liczbaLozekObserw: 15.0,
      wydajnoscLozekObserw: 11.36,
      zasob: 'Pielegn',
      wydajnoscWaska: 5.05,
      mozliwoscPokrycia: '',
    },
    // {
    //   godzina: 'Zapotrz./dobę',
    //   oczekiwaneWizyty: 161.35,
    //   liczbaPielegniarek: '',
    //   wydajnoscPielegniarek: 'Wyd./dobę 166,61',
    //   liczbaLekarzy: '',
    //   wydajnoscLekarzy: 'Wyd./dobę 219,84',
    //   liczbaLozek: '',
    //   wydajnoscLozek: 'Wyd./dobę 292,35',
    //   liczbaLozekObserw: '',
    //   wydajnoscLozekObserw: 'Wyd./dobę 272,73',
    //   zasob: '',
    //   wydajnoscWaska: '',
    //   mozliwoscPokrycia: '',
    // },
    // {
    //   godzina: '',
    //   oczekiwaneWizyty: '',
    //   liczbaPielegniarek: 'Śr. zajęt. 96,84%',
    //   wydajnoscPielegniarek: '',
    //   liczbaLekarzy: 'Śr. zajęt. 73,39%',
    //   wydajnoscLekarzy: '',
    //   liczbaLozek: 'Śr. zajęt. 55,19%',
    //   wydajnoscLozek: '',
    //   liczbaLozekObserw: 'Śr. zajęt. 59,16%',
    //   wydajnoscLozekObserw: '',
    //   zasob: '',
    //   wydajnoscWaska: '',
    //   mozliwoscPokrycia: '',
    // },
  ];
}
