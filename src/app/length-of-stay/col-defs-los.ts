import { ColDef, ColGroupDef } from 'ag-grid-community';

export const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...

export function numberRoundingFormatter(params: any) {
  if (!isNaN(Number(params.value))) {
    return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
  } else {
    return params.value;
  }
}

export const LOSTableColDefs: (ColDef | ColGroupDef)[] = [
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
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer pielegniarki',
    children: [
      {
        headerName: 'Liczba',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki-odd',
        cellStyle: { backgroundColor: 'var(--dark-red)' },
        editable: true,
      },
      {
        headerName: 'Wydajność',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki-even',
        cellStyle: { backgroundColor: 'var(--mid-red)' },
      },
    ],
  },
  {
    headerName: 'Lekarze',
    headerClass: 'grid-header grid-header-outer lekarze',
    children: [
      {
        headerName: 'Liczba',
        field: 'liczbaLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze-odd',
        cellStyle: { backgroundColor: 'var(--dark-green)' },
        editable: true,
      },
      {
        headerName: 'Wydajność',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze-even',
        cellStyle: { backgroundColor: 'var(--mid-green)' },
      },
    ],
  },
  {
    headerName: 'Opóźnienie z niedoboru wydajności',
    headerClass: 'grid-header grid-header-outer',
    children: [
      {
        headerName: 'Pielęgniarka',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'obsługa',
            field: 'obslugaPielegniarka',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'kolejka',
            field: 'kolejkaPielegniarka',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'oczekiw.',
            field: 'oczekiwaniePielegniarka',
            headerClass: 'grid-header grid-header-inner',
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'obsługa',
            field: 'obslugaLekarz',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'kolejka',
            field: 'kolejkaLekarz',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'oczekiw.',
            field: 'oczekiwanieLekarz',
            headerClass: 'grid-header grid-header-inner',
          },
        ],
      },
    ],
  },
  {
    headerName: 'Opóźnienie ze zmienności',
    headerClass: 'grid-header grid-header-outer',
    children: [
      {
        headerName: 'Pielęgniarka',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'Lq',
            field: 'lqPielegniarka',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'Wq',
            field: 'wqPielegniarka',
            headerClass: 'grid-header grid-header-inner',
          },
        ],
      },
      {
        headerName: 'Lekarz',
        headerClass: 'grid-header grid-header-mid',
        children: [
          {
            headerName: 'Lq',
            field: 'lqLekarz',
            headerClass: 'grid-header grid-header-inner',
          },
          {
            headerName: 'Wq',
            field: 'wqLekarz',
            headerClass: 'grid-header grid-header-inner',
          },
        ],
      },
    ],
  },
  {
    headerName: 'opóźnienie',
    field: 'opoznienieOgolem',
    headerClass: 'grid-header grid-header-outer',
  },
];
