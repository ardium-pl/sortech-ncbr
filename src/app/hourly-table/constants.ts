interface Dzien {
  [key: string]: number;
}

interface Godzina {
  [key: string]: number;
}

interface SredniCzasNaPacjenta {
  [key: string]: number;
}

interface Constants {
  pacjentRok: number;
  pacjentDzien: number;
  wspolczynnikV: number;
  dzien: Dzien;
  godzina: Godzina;
  sredniCzasNaPacjenta: SredniCzasNaPacjenta;
}

export const CONSTANTS: Constants = {
  pacjentRok: 51000,
  pacjentDzien: 140,

  wspolczynnikV: 0.5,

  dzien: {
    poniedzialek: 0.164636673029502,
    wtorek: 0.147341534824637,
    sroda: 0.144739791724691,
    czwartek: 0.145398718828333,
    piatek: 0.146512781147892,
    sobota: 0.128450026832599,
    niedziela: 0.122920473612347,
  },

  godzina: {
    '0-1': 0.02,
    '1-2': 0.0148292563634017,
    '2-3': 0.0132804380166973,
    '3-4': 0.0113240358945445,
    '4-5': 0.0105428336582682,
    '5-6': 0.0103594209593163,
    '6-7': 0.0111270370697444,
    '7-8': 0.0183684421468796,
    '8-9': 0.0350725838773445,
    '9-10': 0.0573470372056056,
    '10-11': 0.0752875163882643,
    '11-12': 0.0821485099416476,
    '12-13': 0.0758988920514371,
    '13-14': 0.0651726456942171,
    '14-15': 0.0584950648397856,
    '15-16': 0.0602952265146832,
    '16-17': 0.063780067794768,
    '17-18': 0.0626116609718156,
    '18-19': 0.0578633099878404,
    '19-20': 0.0531149590038652,
    '20-21': 0.0471370636306204,
    '21-22': 0.039216352261071,
    '22-23': 0.0314722605275493,
    '23-24': 0.025283780203656,
  },

  sredniCzasNaPacjenta: {
    triage: 5, // min
    lozko: 4.10468250688705, // godz
    lekarz: 43.66838567493110, // min
    pielegniarka: 47.53533057851240, // min
    obserwacja: 1.32, // godz
  },
};
