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
  selector: 'app-static-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './static-table.component.html',
  styleUrl: './static-table.component.scss',
})
export class StaticTableComponent {
  autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 100,
  };

  defaultColDef: ColDef = {
    // wrapHeaderText: true,
    // autoHeaderHeight: true,
    headerClass: 'grid-header-inner',
    sortable: false,
    resizable: true,
  };

  headerHeight = 120;
  groupHeaderHeight = 120;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Typ pacjenta',
      field: 'typPacjenta',
    },
    {
      headerName: 'Proc. pacjentów',
      field: 'procPacjentow',
      width: 130,
    },
    {
      headerName: 'Zasoby',
      headerClass: 'grid-header-outer',
      children: [
        {
          headerName: 'Triage',
          headerClass: 'grid-header-mid',
          children: [{ headerName: 'min', field: 'triageMin', width: 100 }],
        },
        {
          headerName: 'Łóżko',
          headerClass: 'grid-header-mid',
          children: [{ headerName: 'godz.', field: 'lozkoGodz', width: 100 }],
        },
        {
          headerName: 'Lekarz',
          headerClass: 'grid-header-mid',
          children: [{ headerName: 'min', field: 'triageMin', width: 100 }],
        },
        {
          headerName: 'Pielęgn.',
          headerClass: 'grid-header-mid',
          children: [{ headerName: 'min', field: 'triageMin', width: 100 }],
        },
        {
          headerName: 'Łóżko obserw.',
          headerClass: 'grid-header-mid',
          children: [{ headerName: 'godz.', field: 'lozkoGodz', width: 100 }],
        },
      ],
    },
    {
      headerName: 'Ograniczenia przyjęć',
      headerClass: 'grid-header-outer',
      children: [
        {
          headerName: 'Łóżko oczek. na przyj. do szpit.',
          headerClass: 'grid-header-mid',
          children: [
            {
              headerName: 'godz.',
              headerClass: 'grid-header-inner',
              field: 'lozkoOczekGodz',
              width: 100,
            },
          ],
        },
        {
          headerName: 'Wydajność przyjmowania',
          headerClass: 'grid-header-mid',
          children: [
            {
              headerName: 'pacj./godz.',
              field: 'wydajnoscPrzyjmowania',
              width: 100,
            },
          ],
        },
      ],
    },
  ];

  rowData = [
    {
      typPacjenta: 'Triage',
      procPacjentow: '100,0%',
      triageMin: 5,
      triageGodz: '',
      lozkoMin: '',
      lozkoGodz: '',
      lekarzMin: 0,
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: '1. Resuscytacja',
      procPacjentow: '1,31%',
      triageMin: '',
      triageGodz: 6,
      lozkoMin: 90,
      lozkoGodz: 120,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: '2. Stan zagrożenia życia',
      procPacjentow: '14,63%',
      triageMin: '',
      triageGodz: 6,
      lozkoMin: 60,
      lozkoGodz: 90,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: '3. Pilny przypadek ostry',
      procPacjentow: '44,88%',
      triageMin: 5,
      triageGodz: '',
      lozkoMin: 40,
      lozkoGodz: 40,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: '4. Pilny przypadek nieostry',
      procPacjentow: '31,62%',
      triageMin: 2.5,
      triageGodz: '',
      lozkoMin: 20,
      lozkoGodz: 10,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: '5. Niepilny',
      procPacjentow: '7,54%',
      triageMin: 1.5,
      triageGodz: '',
      lozkoMin: 20,
      lozkoGodz: 10,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: 'Obserwacja',
      procPacjentow: '11,0%',
      triageMin: '',
      triageGodz: '',
      lozkoMin: 72,
      lozkoGodz: 72,
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: 12,
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
      procPacjentow: '40,0%',
      triageMin: '',
      triageGodz: '',
      lozkoMin: '',
      lozkoGodz: '',
      lekarzMin: '',
      pielegnMin: '',
      lozkoObserwGodz: '',
      lozkoOczekGodz: 6,
      wydajnoscPrzyjmowania: 5,
    },
    {
      typPacjenta: 'Liczba zasobów',
      procPacjentow: '',
      triageMin: 2,
      triageGodz: '',
      lozkoMin: 50,
      lozkoGodz: 6,
      lekarzMin: 8,
      pielegnMin: 20,
      lozkoObserwGodz: 30,
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: 'Średni ważony czas na pacjenta',
      procPacjentow: '',
      triageMin: 5.0,
      triageGodz: '',
      lozkoMin: 4.1,
      lozkoGodz: 43.7,
      lekarzMin: 44.5,
      pielegnMin: 1.3,
      lozkoObserwGodz: 2.4,
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: 'Wydajność (napływ pacj./godz.)',
      procPacjentow: '',
      triageMin: 30.0,
      triageGodz: 12.18,
      lozkoMin: 8.24,
      lozkoGodz: 10.78,
      lekarzMin: 15.15,
      pielegnMin: 12.5,
      lozkoObserwGodz: 12.5,
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
    {
      typPacjenta: 'Zajętość przy danej wydajności',
      procPacjentow: '',
      triageMin: '27%',
      triageGodz: '68%',
      lozkoMin: '100%',
      lozkoGodz: '76%',
      lekarzMin: '54%',
      pielegnMin: '66%',
      lozkoObserwGodz: '66%',
      lozkoOczekGodz: '',
      wydajnoscPrzyjmowania: '',
    },
  ];
}
