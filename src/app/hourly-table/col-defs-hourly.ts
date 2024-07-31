import { ColDef, ColGroupDef } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...

export const hourlyTableColDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Godzina',
    field: 'godzina',
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'text',
  },
  {
    headerName: 'Oczek. l. wizyt',
    field: 'oczekiwaneWizyty',
    headerClass: 'grid-header grid-header-outer',
    valueFormatter: (params: any) => {
      return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
    },
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer',
    children: [
      {
        headerName: 'Liczba Pielęgn.',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = 'var(--editable-cell-background)';
            styles.color = 'var(--editable-cell-font-color)';
          }
          return styles;
        },
      },
      {
        headerName: 'Wydajność l. pacj.',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid',
        valueFormatter: (params: any) => {
          return `${
            Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES
          }`;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] > 23) {
            styles.backgroundColor = 'var(--summation-cell-background)';
            styles.color = 'var(--summation-cell-font-color)';
          }
          return styles;
        },
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = 'var(--editable-cell-background)';
            styles.color = 'var(--editable-cell-font-color)';
          }
          return styles;
        },
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid',
        valueFormatter: (params: any) => {
          return `${
            Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES
          }`;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] > 23) {
            styles.backgroundColor = 'var(--summation-cell-background)';
            styles.color = 'var(--summation-cell-font-color)';
          }
          return styles;
        },
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = 'var(--editable-cell-background)';
            styles.color = 'var(--editable-cell-font-color)';
          }
          return styles;
        },
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozek',
        headerClass: 'grid-header grid-header-mid',
        valueFormatter: (params: any) => {
          return `${
            Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES
          }`;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] > 23) {
            styles.backgroundColor = 'var(--summation-cell-background)';
            styles.color = 'var(--summation-cell-font-color)';
          }
          return styles;
        },
      },
    ],
  },
  {
    headerName: 'Łóżka obserw.',
    headerClass: 'grid-header grid-header-outer',
    children: [
      {
        headerName: 'Liczba łóżek',
        field: 'liczbaLozekObserwacja',
        headerClass: 'grid-header grid-header-mid',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = 'var(--editable-cell-background)';
            styles.color = 'var(--editable-cell-font-color)';
          }
          return styles;
        },
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozekObserwacja',
        headerClass: 'grid-header grid-header-mid',
        valueFormatter: (params: any) => {
          return `${
            Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES
          }`;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] > 23) {
            styles.backgroundColor = 'var(--summation-cell-background)';
            styles.color = 'var(--summation-cell-font-color)';
          }
          return styles;
        },
      },
    ],
  },
  {
    headerName: 'Wąskie gardło procesu',
    headerClass: 'grid-header grid-header-outer',
    children: [
      {
        headerName: 'Zasób',
        field: 'waskiZasob',
        headerClass: 'grid-header grid-header-mid',
        cellDataType: 'text',
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'waskaWydajnosc',
        headerClass: 'grid-header grid-header-mid',
        valueFormatter: (params: any) => {
          return `${
            Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES
          }`;
        },
      },
    ],
  },
  {
    headerName: 'Możliwość pokrycia zapotrz. okresu',
    field: 'mozliwoscPokryciaZopatrzenia',
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'text',
  },
];
