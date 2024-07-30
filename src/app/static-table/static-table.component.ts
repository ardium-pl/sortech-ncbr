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
      headerName: 'Typ pacjenta',
      field: 'typPacjenta',
      headerClass: 'grid-header grid-header-outer',
    },
    {
      headerName: 'Proc. pacjentów',
      field: 'procPacjentow',
      headerClass: 'grid-header grid-header-outer',
    },
    {
      headerName: 'Zasoby',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Triage',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'min',
              field: 'triageMin',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
        {
          headerName: 'Łóżko',
          headerClass: 'grid-header grid-header-mid',
          // wrapHeaderText: false,
          // autoHeaderHeight: true,
          children: [
            {
              headerName: 'godz.',
              // wrapHeaderText: false,
              // autoHeaderHeight: true,
              field: 'lozkoGodz',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
        {
          headerName: 'Lekarz',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'min',
              field: 'triageMin',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
        {
          headerName: 'Pielęgn.',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'min',
              field: 'triageMin',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
        {
          headerName: 'Łóżko obserw.',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'godz.',
              field: 'lozkoGodz',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
      ],
    },
    {
      headerName: 'Ograniczenia przyjęć',
      headerClass: 'grid-header grid-header-outer',
      children: [
        {
          headerName: 'Łóżko oczek. na przyj. do szpit.',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'godz.',
              field: 'lozkoOczekGodz',
              headerClass: 'grid-header grid-header-inner',
            },
          ],
        },
        {
          headerName: 'Wydajność przyjmowania',
          headerClass: 'grid-header grid-header-mid',
          children: [
            {
              headerName: 'pacj./godz.',
              field: 'wydajnoscPrzyjmowania',
              headerClass: 'grid-header grid-header-inner',
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
      triageGodz: null,
      lozkoMin: null,
      lozkoGodz: null,
      lekarzMin: 0,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: '1. Resuscytacja',
      procPacjentow: '1,31%',
      triageMin: null,
      triageGodz: 6,
      lozkoMin: 90,
      lozkoGodz: 120,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: '2. Stan zagrożenia życia',
      procPacjentow: '14,63%',
      triageMin: null,
      triageGodz: 6,
      lozkoMin: 60,
      lozkoGodz: 90,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: '3. Pilny przypadek ostry',
      procPacjentow: '44,88%',
      triageMin: 5,
      triageGodz: null,
      lozkoMin: 40,
      lozkoGodz: 40,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: '4. Pilny przypadek nieostry',
      procPacjentow: '31,62%',
      triageMin: 2.5,
      triageGodz: null,
      lozkoMin: 20,
      lozkoGodz: 10,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: '5. Niepilny',
      procPacjentow: '7,54%',
      triageMin: 1.5,
      triageGodz: null,
      lozkoMin: 20,
      lozkoGodz: 10,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: 'Obserwacja',
      procPacjentow: '11,0%',
      triageMin: null,
      triageGodz: null,
      lozkoMin: 72,
      lozkoGodz: 72,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: 12,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
      procPacjentow: '40,0%',
      triageMin: null,
      triageGodz: null,
      lozkoMin: null,
      lozkoGodz: null,
      lekarzMin: null,
      pielegnMin: null,
      lozkoObserwGodz: null,
      lozkoOczekGodz: 6,
      wydajnoscPrzyjmowania: 5,
    },
    {
      typPacjenta: 'Liczba zasobów',
      procPacjentow: null,
      triageMin: 2,
      triageGodz: null,
      lozkoMin: 50,
      lozkoGodz: 6,
      lekarzMin: 8,
      pielegnMin: 20,
      lozkoObserwGodz: 30,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: 'Średni ważony czas na pacjenta',
      procPacjentow: null,
      triageMin: 5.0,
      triageGodz: null,
      lozkoMin: 4.1,
      lozkoGodz: 43.7,
      lekarzMin: 44.5,
      pielegnMin: 1.3,
      lozkoObserwGodz: 2.4,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: 'Wydajność (napływ pacj./godz.)',
      procPacjentow: null,
      triageMin: 30.0,
      triageGodz: 12.18,
      lozkoMin: 8.24,
      lozkoGodz: 10.78,
      lekarzMin: 15.15,
      pielegnMin: 12.5,
      lozkoObserwGodz: 12.5,
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
    {
      typPacjenta: 'Zajętość przy danej wydajności',
      procPacjentow: null,
      triageMin: '27%',
      triageGodz: '68%',
      lozkoMin: '100%',
      lozkoGodz: '76%',
      lekarzMin: '54%',
      pielegnMin: '66%',
      lozkoObserwGodz: '66%',
      lozkoOczekGodz: null,
      wydajnoscPrzyjmowania: null,
    },
  ];
}
