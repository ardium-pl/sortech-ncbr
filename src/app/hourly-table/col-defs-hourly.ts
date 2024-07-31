import { ColDef, ColGroupDef } from 'ag-grid-community';

export const hourlyTableColDefs: (ColDef | ColGroupDef)[] = [
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = '#394867';
            styles.color = 'rgb(211, 211, 211)';
          }
          return styles;
        },
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = '#394867';
            styles.color = 'rgb(211, 211, 211)';
          }
          return styles;
        },
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
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => {
          if (params.data['id'] === 24) return 'Wyd./dobę';
          if (params.data['id'] === 25) return 'Śr. zajęt.';
          return params.value;
        },
        cellStyle: (params) => {
          const styles: any = {};

          if (params.data['id'] < 24) {
            styles.backgroundColor = '#394867';
            styles.color = 'rgb(211, 211, 211)';
          }
          return styles;
        },
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
            styles.backgroundColor = '#394867';
            styles.color = 'rgb(211, 211, 211)';
          }
          return styles;
        },
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozekObserwacja',
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
        field: 'waskiZasob',
        headerClass: 'grid-header grid-header-mid',
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'waskaWydajnosc',
        headerClass: 'grid-header grid-header-mid',
      },
    ],
  },
  {
    headerName: 'Możliwość pokrycia zapotrz. okresu',
    field: 'mozliwoscPokryciaZopatrzenia',
    headerClass: 'grid-header grid-header-outer',
  },
];
