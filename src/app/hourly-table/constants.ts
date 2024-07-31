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
  dzien: Dzien;
  godzina: Godzina;
  sredniCzasNaPacjenta: SredniCzasNaPacjenta
}

export const CONSTANTS: Constants = {
  pacjentRok: 51000,
  pacjentDzien: Math.round(51000 / 365),

  dzien: {
    poniedzialek: 0.1646,
    wtorek: 0.1473,
    sroda: 0.1447,
    czwartek: 0.1454,
    piatek: 0.1465,
    sobota: 0.1285,
    niedziela: 0.1229,
  },

  godzina: {
    '0-1': 0.02,
    '1-2': 0.0148,
    '2-3': 0.0133,
    '3-4': 0.0113,
    '4-5': 0.0105,
    '5-6': 0.0104,
    '6-7': 0.0111,
    '7-8': 0.0184,
    '8-9': 0.0351,
    '0-19': 0.0573,
    '10-11': 0.0753,
    '11-12': 0.0821,
    '12-13': 0.0759,
    '13-14': 0.0652,
    '14-15': 0.0585,
    '15-16': 0.0603,
    '16-17': 0.0638,
    '17-18': 0.0626,
    '18-19': 0.0579,
    '19-20': 0.0531,
    '20-21': 0.0471,
    '21-22': 0.0392,
    '22-23': 0.0315,
    '23-24': 0.0253,
  },

  sredniCzasNaPacjenta: {
    triage: 5, // min
    lozko: 4.1, // godz
    lekarz: 43.7, // min
    pielegniarka: 47.5, // min
    obserwacja: 1.3, // godz
  },
};
