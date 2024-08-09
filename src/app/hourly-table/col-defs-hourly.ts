import { ColDef, ColGroupDef } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...
function numberRoundingFormatter(params: any) {
  if (!isNaN(Number(params.value))) {
    return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
  } else {
    return params.value;
  }
}

function cellRendererEditable(params: any) {
  if (params.data['id'] === 24) return 'Wyd./dobę';
  if (params.data['id'] === 25) return 'Śr. zajęt.';
  return params.value;
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
    minWidth: 140,
  },
  {
    headerName: 'Oczek. l. wizyt',
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
        cellClass: ({ data }) => [
          'cell',
          'pielegniarka',
          'liczba',
          data['id'] < 24 ? 'part-of-table editable' : 'summary-row',
          data['id'] === 24 ? 'top' : '',
          data['id'] === 25 ? 'bottom' : '',
        ],
      },
      {
        headerName: 'Wydajność l. pacj.',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki wydajnosc',
        cellRenderer: (params: any) => numberRoundingFormatter(params),
        cellClass: ({ data }) => [
          'cell',
          'pielegniarka',
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
        headerName: 'Liczba Lekarze',
        field: 'liczbaLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze liczba',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
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
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze wydajnosc',
        cellRenderer: (params: any) => numberRoundingFormatter(params),
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
        headerName: 'Liczba Łóżka',
        field: 'liczbaLozek',
        headerClass: 'grid-header grid-header-mid lozka liczba',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
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
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozek',
        headerClass: 'grid-header grid-header-mid lozka wydajnosc',
        cellRenderer: (params: any) => numberRoundingFormatter(params),
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
        headerName: 'Liczba łóżek',
        field: 'liczbaLozekObserwacja',
        headerClass: 'grid-header grid-header-mid obserwacja liczba',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
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
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozekObserwacja',
        headerClass: 'grid-header grid-header-mid obserwacja wydajnosc',
        cellRenderer: (params: any) => numberRoundingFormatter(params),
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
      data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.'
        ? 'niedobor-wydajnosci'
        : 'brak-niedoboru',
    ],
    minWidth: 160,

    // children: [
    //   {
    //     headerName: 'Zasób',
    //     field: 'waskiZasob',
    //     headerClass: 'grid-header grid-header-mid waskie-gardlo-odd',
    //     cellDataType: 'text',
    //     cellStyle: (params: any) => cellStylerWaskieGardloZasob(params),
    //   },
    //   {
    //     headerName: 'Wyd. l. pacj.',
    //     field: 'waskaWydajnosc',
    //     headerClass: 'grid-header grid-header-mid waskie-gardlo-even',
    //     cellRenderer: (params: any) => {
    //       if (params.data['id'] > 23) {
    //         return '';
    //       } else {
    //         return numberRoundingFormatter(params);
    //       }
    //     },
    //   },
    // ],
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
      data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.'
        ? 'niedobor-wydajnosci'
        : 'brak-niedoboru',
    ],

    minWidth: 160,
    // wrapText: true,
    // autoHeight: true,
  },
];
