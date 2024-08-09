import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CellClassParams } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...
export function numberRoundingFormatter(params: any) {
  if (params.data['id'] === 11 && params.value === 777) {
    return '***';
  }

  if (params.value === null) {
    return '';
  }

  if (!isNaN(Number(params.value))) {
    return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
  }

  return params.value;
}

export const staticTableColDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Typ pacjenta',
    field: 'typPacjenta',
    headerClass: 'grid-header grid-header-outer typ-pacjenta',
    editable: false,
    cellClass: ({ data }) => [
      'cell',
      'typ-pacjenta',
      data['id'] < 8 ? 'part-of-table' : 'summary-row',
      data['id'] === 8 ? 'top' : '',
      data['id'] === 12 ? 'bottom' : '',
      data['id'] === 11 ? 'waskie-gardlo' : '',
    ],
    cellDataType: 'text',
  },
  {
    headerName: 'Proc. pacjentów',
    field: 'procPacjentow',
    headerClass: 'grid-header grid-header-outer proc-pacjentow',
    editable: false,
    cellClass: ({ data }) => [
      'cell',
      'proc-pacjentow',
      data['id'] < 8 ? 'part-of-table' : 'summary-row',
      data['id'] === 8 ? 'top' : '',
      data['id'] === 12 ? 'bottom' : '',
      data['id'] === 11 ? 'waskie-gardlo' : '',
    ],
  },
  {
    headerName: 'Zasoby',
    headerClass: 'grid-header grid-header-outer zasoby',
    children: [
      {
        headerName: 'Triage',
        headerClass: 'grid-header grid-header-mid triage',
        children: [
          {
            headerName: 'min',
            field: 'triage',
            headerClass: 'grid-header grid-header-inner triage min',
            cellClass: ({ data, value }) => [
              'cell',
              'triage',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
      {
        headerName: 'Łóżko',
        headerClass: 'grid-header grid-header-mid lozko',
        children: [
          {
            headerName: 'godz.',
            field: 'lozko',
            headerClass: 'grid-header grid-header-inner lozko godz',
            cellClass: ({ data, value }) => [
              'cell',
              'lozko',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid lekarz',
        children: [
          {
            headerName: 'min',
            field: 'lekarz',
            headerClass: 'grid-header grid-header-inner lekarz min',
            cellClass: ({ data, value }) => [
              'cell',
              'lekarz',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
      {
        headerName: 'Pielęgn.',
        headerClass: 'grid-header grid-header-mid pielegniarka',
        children: [
          {
            headerName: 'min',
            field: 'pielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka min',
            cellClass: ({ data, value }) => [
              'cell',
              'pielegniarka',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
      {
        headerName: 'Łóżko obserw.',
        headerClass: 'grid-header grid-header-mid obserwacja',
        children: [
          {
            headerName: 'godz.',
            field: 'lozkoObserwacja',
            headerClass: 'grid-header grid-header-inner obserwacja godz',
            cellClass: ({ data, value }) => [
              'cell',
              'obserwacja',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
    ],
  },
  {
    headerName: 'Ograniczenia przyjęć',
    headerClass: 'grid-header grid-header-outer ograniczenia-przyjec',
    children: [
      {
        headerName: 'Łóżko oczek. na przyj. do szpit.',
        headerClass: 'grid-header grid-header-mid oczekiwanie-lozko',
        children: [
          {
            headerName: 'godz.',
            field: 'lozkoOczekiwanie',
            headerClass: 'grid-header grid-header-inner oczekiwanie-lozko godz',
            cellClass: ({ data, value }) => [
              'cell',
              'oczekiwanie-lozko',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
      {
        headerName: 'Wydajność przyjmowania',
        headerClass: 'grid-header grid-header-mid wydajnosc',
        children: [
          {
            headerName: 'pacj./godz.',
            field: 'wydajnoscPrzyjmowania',
            headerClass: 'grid-header grid-header-inner wydajnosc pacj-godz',
            cellClass: ({ data, value }) => [
              'cell',
              'wydajnosc',
              data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
              data['id'] === 8 ? 'top' : '',
              data['id'] === 12 ? 'bottom' : '',
              data['id'] === 11 ? 'waskie-gardlo' : '',
              value === 777 ? 'min-wydajnosci' : '',
            ],
          },
        ],
      },
    ],
  },
];
