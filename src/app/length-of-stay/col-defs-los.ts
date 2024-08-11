import { ColDef, ColGroupDef } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...

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
    headerClass: 'grid-header grid-header-outer godzina',
    cellDataType: 'text',
    cellClass: ({ data }) => ['cell', 'godzina', data['id'] === 23 ? 'bottom' : ''],
  },
  {
    headerName: 'Oczek. l. wizyt',
    field: 'oczekiwaneWizyty',
    headerClass: 'grid-header grid-header-outer oczekiwane-wizyty',
    cellClass: ({ data }) => ['cell', 'oczekiwane-wizyty', data['id'] === 23 ? 'bottom' : ''],
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer pielegniarki',
    children: [
      {
        headerName: 'Liczba',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki liczba',
        editable: true,
        cellClass: ({ data }) => ['cell', 'pielegniarki', 'liczba', data['id'] === 23 ? 'bottom' : ''],
      },
      {
        headerName: 'Wydajność',
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
        headerName: 'Liczba',
        field: 'liczbaLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze liczba',
        editable: true,
        cellClass: ({ data }) => ['cell', 'lekarze', 'liczba', data['id'] === 23 ? 'bottom' : ''],
      },
      {
        headerName: 'Wydajność',
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
  {
    headerName: 'opóźnienie',
    field: 'opoznienieOgolem',
    headerClass: 'grid-header grid-header-outer opoznienie-ogolem',
    cellClass: ({ data }) => ['cell', 'opoznienie-ogolem', data['id'] === 23 ? 'bottom' : ''],
    cellStyle: ({ value }) => {
      if (value === null || value === undefined) return undefined;

      const minValue = 0; // Replace with your actual minimum value
      const maxValue = 5; // Replace with your actual maximum value
      const weight = (value - minValue) / (maxValue - minValue);

      // Define your RGB colors here
      const startColor = { r: 36, g: 114, b: 76 }; // Dark Green
      const endColor = { r: 198, g: 57, b: 9 }; // Dark Red

      const red = Math.round(weight * endColor.r + (1 - weight) * startColor.r);
      const green = Math.round(weight * endColor.g + (1 - weight) * startColor.g);
      const blue = Math.round(weight * endColor.b + (1 - weight) * startColor.b);

      return {
        backgroundColor: `rgb(${red}, ${green}, ${blue})`,
      };
    },
  },
];
