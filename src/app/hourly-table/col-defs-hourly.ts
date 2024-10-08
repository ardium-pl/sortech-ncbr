import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community';
import { numberRoundingFormatter } from '../utils';

function cellRendererEditable({ data, value }: ICellRendererParams) {
  if (data['id'] === 24) return 'Wyd./dobę';
  if (data['id'] === 25) return 'Śr. zajęt.';
  return value;
}

export const hourlyTableColDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Godzina',
    field: 'godzina',
    headerClass: 'grid-header grid-header-outer godzina',
    cellDataType: 'text',
    cellClass: ({ data }) => [
      'cell',
      'godzina',
      data['id'] < 24 ? 'part-of-table' : 'summary-row',
      data['id'] === 24 ? 'top' : '',
      data['id'] === 25 ? 'bottom' : '',
    ],
    colSpan: ({ data }) => (data['id'] === 25 ? 2 : 1),
    minWidth: 140,
  },
  {
    headerName: 'Oczek. \n l. wizyt',
    field: 'oczekiwaneWizyty',
    headerClass: 'grid-header grid-header-outer oczekiwane-wizyty',
    cellRenderer: (params: any) => {
      if (params.data['id'] === 25) {
        return '';
      } else {
        return numberRoundingFormatter(params);
      }
    },
    cellClass: ({ data }) => [
      'cell',
      'oczekiwane-wizyty',
      data['id'] < 24 ? 'part-of-table' : 'summary-row',
      data['id'] === 24 ? 'top' : '',
      data['id'] === 25 ? 'bottom' : '',
    ],
    minWidth: 140,
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer pielegniarki',
    children: [
      {
        headerName: 'Liczba Pielęgn.',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki liczba',
        editable: ({ data }) => data['id'] < 24,
        cellRenderer: cellRendererEditable,
        cellClass: ({ data }) => [
          'cell',
          'pielegniarki',
          'liczba',
          data['id'] < 24 ? 'part-of-table editable' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki wydajnosc',
        cellRenderer: numberRoundingFormatter,
        cellClass: ({ data }) => [
          'cell',
          'pielegniarki',
          'wydajnosc',
          data['id'] < 24 ? 'part-of-table' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
    ],
  },
  {
    headerName: 'Lekarze',
    headerClass: 'grid-header grid-header-outer lekarze',
    children: [
      {
        headerName: 'Liczba Lekarzy',
        field: 'liczbaLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze liczba',
        editable: ({ data }) => data['id'] < 24,
        cellRenderer: cellRendererEditable,
        cellClass: ({ data }) => [
          'cell',
          'lekarz',
          'liczba',
          data['id'] < 24 ? 'part-of-table editable' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze wydajnosc',
        cellRenderer: numberRoundingFormatter,
        cellClass: ({ data }) => [
          'cell',
          'lekarz',
          'wydajnosc',
          data['id'] < 24 ? 'part-of-table' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
    ],
  },
  {
    headerName: 'Łóżka',
    headerClass: 'grid-header grid-header-outer lozka',
    children: [
      {
        headerName: 'Liczba Łóżek',
        field: 'liczbaLozek',
        headerClass: 'grid-header grid-header-mid lozka liczba',
        editable: ({ data }) => data['id'] < 24,
        cellRenderer: cellRendererEditable,
        cellClass: ({ data }) => [
          'cell',
          'lozko',
          'liczba',
          data['id'] < 24 ? 'part-of-table editable' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscLozek',
        headerClass: 'grid-header grid-header-mid lozka wydajnosc',
        cellRenderer: numberRoundingFormatter,
        cellClass: ({ data }) => [
          'cell',
          'lozko',
          'wydajnosc',
          data['id'] < 24 ? 'part-of-table' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
    ],
  },
  {
    headerName: 'Łóżka obserw.',
    headerClass: 'grid-header grid-header-outer obserwacja',
    children: [
      {
        headerName: 'Liczba Łóżek',
        field: 'liczbaLozekObserwacja',
        headerClass: 'grid-header grid-header-mid obserwacja liczba',
        editable: ({ data }) => data['id'] < 24,
        cellRenderer: cellRendererEditable,
        cellClass: ({ data }) => [
          'cell',
          'obserwacja',
          'liczba',
          data['id'] < 24 ? 'part-of-table editable' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscLozekObserwacja',
        headerClass: 'grid-header grid-header-mid obserwacja wydajnosc',
        cellRenderer: numberRoundingFormatter,
        cellClass: ({ data }) => [
          'cell',
          'obserwacja',
          'wydajnosc',
          data['id'] < 24 ? 'part-of-table' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
    ],
  },
  {
    headerName: 'Wąskie gardło procesu',
    headerClass: 'grid-header grid-header-outer waskie-gardlo',
    field: 'waskiZasob',
    cellDataType: 'text',
    cellClass: ({ data }) => [
      'cell',
      'waskie-gardlo',
      data['id'] < 24 ? 'part-of-table' : 'summary-row',
      data['id'] === 24 ? 'top' : '',
      data['id'] === 25 ? 'bottom' : '',
      data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.' ? 'niedobor-wydajnosci' : 'brak-niedoboru',
    ],
    rowSpan: ({ data }) => (data['id'] === 24 ? 2 : 1),
    colSpan: ({ data }) => (data['id'] < 24 ? 1 : 2),
    minWidth: 160,
  },
  {
    headerName: 'Możliwość pokrycia zapotrz. okresu',
    field: 'mozliwoscPokryciaZopatrzenia',
    headerClass: 'grid-header grid-header-outer mozliwosc-pokrycia',
    cellDataType: 'text',
    cellClass: ({ data }) => [
      'cell',
      'mozliwosc-pokrycia',
      data['id'] < 24 ? 'part-of-table' : 'summary-row',
      data['id'] === 24 ? 'top' : '',
      data['id'] === 25 ? 'bottom' : '',
      data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.' ? 'niedobor-wydajnosci' : 'brak-niedoboru',
    ],

    minWidth: 160,
  },
];
