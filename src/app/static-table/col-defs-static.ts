import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CellClassParams } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...
export function numberRoundingFormatter(params: any) {
  if (params.data['id'] === 11 && params.value === 777) {
    return '***'
  }

  if (params.value === null) {
    return '';
  }

  if (!isNaN(Number(params.value))) {
    return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
  }

  return params.value;
}

function cellStyler({ data, colDef }: { data: any; colDef: any }) {
  let cellClasses = ['cell'];

  if (!['procPacjentow', 'typPacjenta'].includes(colDef['field'])) {
    data['id'] < 9 ? cellClasses.push('editable') : '';

    data['id'] === 8 ? cellClasses.push('mean-time-per-patient-row') : '';
  }

  colDef['field'] === 'typPacjenta' ? cellClasses.push('typPacjenta') : '';

  return cellClasses;
}

// function cellRenderer()

export const staticTableColDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Typ pacjenta',
    field: 'typPacjenta',
    headerClass: 'grid-header grid-header-outer',
    editable: false,
    cellClass: cellStyler,
    cellDataType: 'text',
  },
  {
    headerName: 'Proc. pacjentów',
    field: 'procPacjentow',
    headerClass: 'grid-header grid-header-outer',
    editable: false,
    cellClass: cellStyler,
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
            field: 'triage',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
          },
        ],
      },
      {
        headerName: 'Łóżko',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'godz.',
            field: 'lozko',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'min',
            field: 'lekarz',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
          },
        ],
      },
      {
        headerName: 'Pielęgn.',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'min',
            field: 'pielegniarka',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
          },
        ],
      },
      {
        headerName: 'Łóżko obserw.',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'godz.',
            field: 'lozkoObserwacja',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
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
            field: 'lozkoOczekiwanie',
            headerClass: 'grid-header grid-header-inner',
            cellClass: cellStyler,
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
            cellClass: cellStyler,
          },
        ],
      },
    ],
  },
];
