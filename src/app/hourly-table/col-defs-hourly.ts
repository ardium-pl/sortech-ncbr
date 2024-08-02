import { ColDef, ColGroupDef } from 'ag-grid-community';

const DECIMAL_PLACES = 100; // 10 for 1, 100 for 2, 1000 for 3 ...
function numberRoundingFormatter(params: any) {
  if (!isNaN(Number(params.value))) {
    return `${Math.round(params.value * DECIMAL_PLACES) / DECIMAL_PLACES}`;
  } else {
    return params.value;
    // return 'Not a number';
  }
}

function cellStylerMozliwoscPokrycia(params: any) {
  const styles: any = {};

  if (params.data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.') {
    styles.fontWeight = 'var(--waskie-gardlo-font-width)';
    styles.fontSize = 'var(--waskie-gardlo-font-size)';
    styles.backgroundColor = 'var(--waskie-gardlo-background-color';
    styles.color = 'var(--waskie-gardlo-font-color)';
    // styles.color = 'var(--editable-cell-font-color-odd)';
  }
  return styles;
}

function cellStylerWaskieGardlo(params: any) {
  const styles: any = {};
  styles.borderLeft = 'var(--standard-border)';

  // // if (params.data['id'] < 24) {
  // if (params.colDef.field === 'waskiZasob') {
  //   styles.borderLeft = 'var(--standard-border)';
  // }
  // if (params.data['mozliwoscPokryciaZopatrzenia'] === 'Niedobór wyd.') {
  //   styles.fontWeight = 'var(--waskie-gardlo-font-width)';
  //   styles.fontSize = 'var(--waskie-gardlo-font-size)';
  //   styles.backgroundColor = 'var(--waskie-gardlo-background-color';
  //   styles.color = 'var(--waskie-gardlo-font-color)';
  //   // styles.color = 'var(--editable-cell-font-color-odd)';
  // }
  return styles;
}

function cellStylerWaskieGardloWydajnosc(params: any) {
  const styles: any = {};

  if (params.data['id'] < 24) {
    // styles.backgroundColor = 'var(--dark-red)';
    // styles.color = 'var(--editable-cell-font-color-odd)';
    // styles.fontWeight = 'var(--editable-cell-font-width)';
  }
  styles.borderLeft = 'var(--standard-border)';
  return styles;
}

function cellStylerEditableEven(params: any) {
  const styles: any = {};

  if (params.data['id'] < 24) {
    styles.backgroundColor = 'var(--dark-green)';
    styles.color = 'var(--editable-cell-font-color-even)';
    styles.fontWeight = 'var(--editable-cell-font-width)';
  } else if (params.data['id'] === 24) {
    styles.borderTop = 'var(--standard-border)';
  } else if (params.data['id'] === 25) {
    styles.borderBottom = 'var(--standard-border)';
  }
  styles.borderLeft = 'var(--standard-border)';

  return styles;
}

function cellStylerEditableOdd(params: any) {
  const styles: any = {};

  if (params.data['id'] < 24) {
    styles.backgroundColor = 'var(--dark-red)';
    styles.color = 'var(--editable-cell-font-color-odd)';
    styles.fontWeight = 'var(--editable-cell-font-width)';
  } else if (params.data['id'] === 24) {
    styles.borderTop = 'var(--standard-border)';
  } else if (params.data['id'] === 25) {
    styles.borderBottom = 'var(--standard-border)';
  }
  styles.borderLeft = 'var(--standard-border)';
  return styles;
}

function cellStylerWydajnoscEven(params: any) {
  const styles: any = {};

  if (params.data['id'] < 24) {
    styles.backgroundColor = 'var(--mid-green)';
    styles.color = 'var(--wydajnosc-cell-font-color-even)';
  } else if (params.data['id'] === 24) {
    styles.borderTop = 'var(--standard-border)';
    styles.borderBottom = 'var(--standard-border)';
    styles.borderLeft = 'var(--standard-border)';
    styles.backgroundColor = 'var(--darkest-green)';
    styles.color = 'var(--summary-cell-font-color-even)';
  } else if (params.data['id'] === 25) {
    styles.borderBottom = 'var(--standard-border)';
    styles.borderLeft = 'var(--standard-border)';
    styles.backgroundColor = 'var(--darkest-green)';
    styles.color = 'var(--summary-cell-font-color-even)';
  }
  return styles;
}

function cellStylerWydajnoscOdd(params: any) {
  const styles: any = {};

  if (params.data['id'] < 24) {
    styles.backgroundColor = 'var(--mid-red)';
    styles.color = 'var(--wydajnosc-cell-font-color-odd)';
  } else if (params.data['id'] === 24) {
    styles.borderTop = 'var(--standard-border)';
    styles.borderBottom = 'var(--standard-border)';
    styles.borderLeft = 'var(--standard-border)';
    styles.backgroundColor = 'var(--darkest-red)';
    styles.color = 'var(--summary-cell-font-color-odd)';
  } else if (params.data['id'] === 25) {
    styles.borderBottom = 'var(--standard-border)';
    styles.borderLeft = 'var(--standard-border)';

    styles.backgroundColor = 'var(--darkest-red)';
    styles.color = 'var(--summary-cell-font-color-odd)';
  }
  return styles;
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
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'text',
    minWidth: 140,
  },
  {
    headerName: 'Oczek. l. wizyt',
    field: 'oczekiwaneWizyty',
    headerClass: 'grid-header grid-header-outer',
    cellRenderer: (params: any) => {
      if (params.data['id'] === 25) {
        return '';
      } else {
        return numberRoundingFormatter(params);
      }
    },
    minWidth: 140,
  },
  {
    headerName: 'Pielęgniarki',
    headerClass: 'grid-header grid-header-outer pielegniarki',
    children: [
      {
        headerName: 'Liczba Pielęgn.',
        field: 'liczbaPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki-odd',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
        cellStyle: (params: any) => cellStylerEditableOdd(params),
      },
      {
        headerName: 'Wydajność l. pacj.',
        field: 'wydajnoscPielegniarek',
        headerClass: 'grid-header grid-header-mid pielegniarki-even',
        valueFormatter: (params: any) => numberRoundingFormatter(params),
        cellStyle: (params: any) => cellStylerWydajnoscOdd(params),
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
        headerClass: 'grid-header grid-header-mid lekarze-odd',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
        cellStyle: (params: any) => cellStylerEditableEven(params),
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLekarzy',
        headerClass: 'grid-header grid-header-mid lekarze-even',
        valueFormatter: (params: any) => numberRoundingFormatter(params),
        cellStyle: (params: any) => cellStylerWydajnoscEven(params),
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
        headerClass: 'grid-header grid-header-mid lozka-odd',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
        cellStyle: (params: any) => cellStylerEditableOdd(params),
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozek',
        headerClass: 'grid-header grid-header-mid lozka-even',
        valueFormatter: (params: any) => numberRoundingFormatter(params),
        cellStyle: (params: any) => cellStylerWydajnoscOdd(params),
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
        headerClass: 'grid-header grid-header-mid obserwacja-odd',
        editable: (params: any) => params.data['id'] < 24,
        cellRenderer: (params: any) => cellRendererEditable(params),
        cellStyle: (params: any) => cellStylerEditableEven(params),
      },
      {
        headerName: 'Wyd. l. pacj.',
        field: 'wydajnoscLozekObserwacja',
        headerClass: 'grid-header grid-header-mid obserwacja-even',
        valueFormatter: (params: any) => numberRoundingFormatter(params),
        cellStyle: (params: any) => cellStylerWydajnoscEven(params),
      },
    ],
  },
  {
    headerName: 'Wąskie gardło procesu',
    headerClass: 'grid-header grid-header-outer waskie-gardlo',
    field: 'waskiZasob',
    cellDataType: 'text',
    cellStyle: (params: any) => cellStylerWaskieGardlo(params),
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
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'text',
    cellStyle: (params: any) => cellStylerMozliwoscPokrycia(params),
    minWidth: 160,
    // wrapText: true,
    // autoHeight: true,
  },
];
