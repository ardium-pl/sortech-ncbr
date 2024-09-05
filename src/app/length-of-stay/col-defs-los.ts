import { ColDef, ColGroupDef } from 'ag-grid-community';

export const LOSTableColDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Godzina',
    field: 'godzina',
    headerClass: 'grid-header grid-header-outer godzina',
    cellDataType: 'text',
    cellClass: ({ data }) => ['cell', 'godzina', data['id'] === 23 ? 'bottom' : ''],
    minWidth: 130,
  },
  {
    headerName: 'Oczek. \n l. wizyt',
    field: 'oczekiwaneWizyty',
    headerClass: 'grid-header grid-header-outer oczekiwane-wizyty',
    cellClass: ({ data }) => ['cell', 'oczekiwane-wizyty', data['id'] === 23 ? 'bottom' : ''],
    minWidth: 130,
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer pielegniarki',
    children: [
      {
        headerName: 'Liczba Pielęgn.',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki liczba',
        editable: true,
        cellClass: ({ data }) => ['cell', 'pielegniarki', 'liczba', data['id'] === 23 ? 'bottom' : ''],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki wydajnosc',
        cellClass: ({ data }) => ['cell', 'pielegniarki', 'wydajnosc', data['id'] === 23 ? 'bottom' : ''],
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
        editable: true,
        cellClass: ({ data }) => ['cell', 'lekarze', 'liczba', data['id'] === 23 ? 'bottom' : ''],
      },
      {
        headerName: 'Wyd. \n l. pacj.',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze wydajnosc',
        cellClass: ({ data }) => ['cell', 'lekarze', 'wydajnosc', data['id'] === 23 ? 'bottom' : ''],
      },
    ],
  },
  {
    headerName: 'Opóźnienie z niedoboru wydajności',
    headerClass: 'grid-header grid-header-outer opoznienie-wydajnosc',
    children: [
      {
        headerName: 'Pielęgniarka',
        headerClass: 'grid-header grid-header-mid pielegniarka',
        children: [
          {
            headerName: 'obsługa',
            field: 'obslugaPielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka obsluga',
            cellClass: ({ data }) => ['cell', 'pielegiarka', 'obsluga', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'kolejka',
            field: 'kolejkaPielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka kolejka',
            cellClass: ({ data }) => ['cell', 'pielegiarka', 'kolejka', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'oczekiw.',
            field: 'oczekiwaniePielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka oczekiwanie',
            cellClass: ({ data }) => ['cell', 'pielegiarka', 'oczekiwanie', data['id'] === 23 ? 'bottom' : ''],
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid lekarz',
        children: [
          {
            headerName: 'obsługa',
            field: 'obslugaLekarz',
            headerClass: 'grid-header grid-header-inner lekarz obsluga',
            cellClass: ({ data }) => ['cell', 'lekarz', 'obsluga', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'kolejka',
            field: 'kolejkaLekarz',
            headerClass: 'grid-header grid-header-inner lekarz kolejka',
            cellClass: ({ data }) => ['cell', 'lekarz', 'kolejka', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'oczekiw.',
            field: 'oczekiwanieLekarz',
            headerClass: 'grid-header grid-header-inner lekarz oczekiwanie',
            cellClass: ({ data }) => ['cell', 'lekarz', 'oczekiwanie', data['id'] === 23 ? 'bottom' : ''],
          },
        ],
      },
    ],
  },
  {
    headerName: 'Opóźnienie ze zmienności',
    headerClass: 'grid-header grid-header-outer opoznienie-zmiennosc',
    children: [
      {
        headerName: 'Pielęgniarka',
        headerClass: 'grid-header grid-header-mid pielegniarka',
        children: [
          {
            headerName: 'Lq',
            field: 'lqPielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka lq',
            cellClass: ({ data }) => ['cell', 'pielegniarka', 'lq', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'Wq',
            field: 'wqPielegniarka',
            headerClass: 'grid-header grid-header-inner pielegniarka wq',
            cellClass: ({ data }) => ['cell', 'pielegniarka', 'wq', data['id'] === 23 ? 'bottom' : ''],
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid lekarz',
        children: [
          {
            headerName: 'Lq',
            field: 'lqLekarz',
            headerClass: 'grid-header grid-header-inner lekarz lq',
            cellClass: ({ data }) => ['cell', 'lekarz', 'lq', data['id'] === 23 ? 'bottom' : ''],
          },
          {
            headerName: 'Wq',
            field: 'wqLekarz',
            headerClass: 'grid-header grid-header-inner lekarz wq',
            cellClass: ({ data }) => ['cell', 'pielegniarka', 'wq', data['id'] === 23 ? 'bottom' : ''],
          },
        ],
      },
    ],
  },
];
