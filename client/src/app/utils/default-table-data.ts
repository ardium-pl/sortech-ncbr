// Ten plik jest plikiem tymczasowym
import { Hour, kolejka } from '../interfaces/hour';
import { SummaryTop, SummaryBottom } from '../interfaces/summaries';
import { StaticRow } from '../interfaces/static-row';

export const defaultWoczorajszaKolejka: kolejka = {
  lekarz: 7.8053,
  pielegniarka: 20.5828,
};

export const defaultSummaryRowTop: SummaryTop = {
  id: 24,
  liczbaWizyt: 0,
  wydajnosc: {
    lekarz: 0,
    pielegniarka: 0,
    lozko: 0,
    lozkoObserwacja: 0,
  },
};

export const defaultSummaryRowBottom: SummaryBottom = {
  id: 25,
  wydajnosc: {
    lekarz: 0,
    pielegniarka: 0,
    lozko: 0,
    lozkoObserwacja: 0,
  },
};

export const defaultRowDataHourly: Hour[] = [
  {
    id: 0,
    godzina: '0-1',
    liczbaWizyt: 3.23,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0.3382,
      pielegniarka: 3.7158,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 2.7882,
      pielegniarka: 18.7608,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 3.7158,
  },
  {
    id: 1,
    godzina: '1-2',
    liczbaWizyt: 2.39,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 3.1897,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0.0175,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 16.1045,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 3.1905,
  },
  {
    id: 2,
    godzina: '2-3',
    liczbaWizyt: 2.14,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 2.6141,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 13.1983,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 2.6146,
  },
  {
    id: 3,
    godzina: '3-4',
    liczbaWizyt: 1.83,
    zasoby: {
      lekarz: 8,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 1.976,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 9.7675,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 1.976,
  },
  {
    id: 4,
    godzina: '4-5',
    liczbaWizyt: 1.7,
    zasoby: {
      lekarz: 8,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 1.3129,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 6.6287,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 1.3129,
  },
  {
    id: 5,
    godzina: '5-6',
    liczbaWizyt: 1.67,
    zasoby: {
      lekarz: 8,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 0.644,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0.1051,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 3.512,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 0.644,
  },
  {
    id: 6,
    godzina: '6-7',
    liczbaWizyt: 1.8,
    zasoby: {
      lekarz: 8,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 0,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 0,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 0.0097,
  },
  {
    id: 7,
    godzina: '7-8',
    liczbaWizyt: 2.96,
    zasoby: {
      lekarz: 8,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 0,
    },
    lq: {
      lekarz: 0.0361,
      pielegniarka: 0.1907,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0.0337,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 0,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 0.0011,
  },
  {
    id: 8,
    godzina: '8-9',
    liczbaWizyt: 5.66,
    zasoby: {
      lekarz: 8,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 0.6404,
    },
    lq: {
      lekarz: 1.47,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0.1589,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 5.6587,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 8.84,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 0.2061,
  },
  {
    id: 9,
    godzina: '9-10',
    liczbaWizyt: 9.25,
    zasoby: {
      lekarz: 8,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 0,
      pielegniarka: 0.0472,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0.1051,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 0,
      pielegniarka: 0.4171,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 8.84,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 0.422,
  },
  {
    id: 10,
    godzina: '10-11',
    liczbaWizyt: 12.15,
    zasoby: {
      lekarz: 8,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 10.9919,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 0.1413,
      pielegniarka: 0.422,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 1.553,
      pielegniarka: 3.7287,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 8.84,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 0.9221,
  },
  {
    id: 11,
    godzina: '11-12',
    liczbaWizyt: 13.25,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 10.99,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 10.9919,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 0.4015,
      pielegniarka: 0.9221,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 4.4175,
      pielegniarka: 8.1473,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 8.84,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.3236,
  },
  {
    id: 12,
    godzina: '12-13',
    liczbaWizyt: 12.25,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 0.9006,
      pielegniarka: 1.3081,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 7.4194,
      pielegniarka: 11.5576,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.3081,
  },
  {
    id: 13,
    godzina: '13-14',
    liczbaWizyt: 10.52,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 1.1755,
      pielegniarka: 1.4982,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 9.696,
      pielegniarka: 13.7333,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.4982,
  },
  {
    id: 14,
    godzina: '14-15',
    liczbaWizyt: 9.44,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 1.32,
      pielegniarka: 1.5664,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 10.8845,
      pielegniarka: 13.8961,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.5664,
  },
  {
    id: 15,
    godzina: '15-16',
    liczbaWizyt: 9.73,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 1.5004,
      pielegniarka: 1.674,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 12.3688,
      pielegniarka: 14.7323,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.6674,
  },
  {
    id: 16,
    godzina: '16-17',
    liczbaWizyt: 10.29,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 1.7486,
      pielegniarka: 1.83,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 14.4154,
      pielegniarka: 16.1745,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.8321,
  },
  {
    id: 17,
    godzina: '17-18',
    liczbaWizyt: 10.1,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 1.974,
      pielegniarka: 1.9754,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 16.2735,
      pielegniarka: 17.4538,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 1.9754,
  },
  {
    id: 18,
    godzina: '18-19',
    liczbaWizyt: 9.34,
    zasoby: {
      lekarz: 6,
      pielegniarka: 7,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 2.1064,
      pielegniarka: 2.0302,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 17.3654,
      pielegniarka: 17.5142,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 2.1064,
  },
  {
    id: 19,
    godzina: '19-20',
    liczbaWizyt: 8.57,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 8.84,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 8.8355,
    },
    oczekiwanie: {
      lekarz: 2.0685,
      pielegniarka: 2.2034,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 17.0526,
      pielegniarka: 17.6841,
    },
    waskiZasob: 'Lekarze',
    waskaWydajnosc: 8.24,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 2.2034,
  },
  {
    id: 20,
    godzina: '20-21',
    liczbaWizyt: 7.61,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 2.138,
      pielegniarka: 2.7803,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 17.6142,
      pielegniarka: 21.8433,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 2.7803,
  },
  {
    id: 21,
    godzina: '21-22',
    liczbaWizyt: 6.33,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 2.06,
      pielegniarka: 2.6702,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 16.9768,
      pielegniarka: 21.2534,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 2.6702,
  },
  {
    id: 22,
    godzina: '22-23',
    liczbaWizyt: 5.08,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 1.836,
      pielegniarka: 2.714,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 15.1539,
      pielegniarka: 21.523,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: 'Niedobor wydajn',
    opoznienieOgolem: 2.714,
  },
  {
    id: 23,
    godzina: '23-24',
    liczbaWizyt: 4.08,
    zasoby: {
      lekarz: 6,
      pielegniarka: 4,
      lozko: 50,
      lozkoObserwacja: 15.0,
    },
    wydajnosc: {
      lekarz: 8.24,
      pielegniarka: 5.05,
      lozko: 12.18,
      lozkoObserwacja: 11.36,
    },
    obsluga: {
      lekarz: 8.244,
      pielegniarka: 5.0489,
    },
    oczekiwanie: {
      lekarz: 0.9468,
      pielegniarka: 4.0767,
    },
    lq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    wq: {
      lekarz: 0,
      pielegniarka: 0,
    },
    kolejka: {
      lekarz: 7.8053,
      pielegniarka: 20.5828,
    },
    waskiZasob: 'Pielegn',
    waskaWydajnosc: 5.05,
    mozliwoscPokryciaZopatrzenia: '',
    opoznienieOgolem: 4.0767,
  },
];

export const defaultRowDataStatic: StaticRow[] = [
  {
    id: 0,
    typPacjenta: 'Triage',
    procPacjentow: 1,
    zasoby: {
      triage: 5,
      lozko: null,
      lekarz: null,
      pielegniarka: null,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 1,
    typPacjenta: '1. Resuscytacja',
    procPacjentow: 0.0131322314049587,
    zasoby: {
      triage: null,
      lozko: 360,
      lekarz: 90,
      pielegniarka: 120,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 2,
    typPacjenta: '2. Stan zagrożenia życia',
    procPacjentow: 0.146321212121212,
    zasoby: {
      triage: null,
      lozko: 360,
      lekarz: 60,
      pielegniarka: 90,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 3,
    typPacjenta: '3. Pilny przypadek ostry',
    procPacjentow: 0.44884738292011,
    zasoby: {
      triage: null,
      lozko: 300,
      lekarz: 40,
      pielegniarka: 40,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 4,
    typPacjenta: '4. Pilny przypadek nieostry',
    procPacjentow: 0.316226170798898,
    zasoby: {
      triage: null,
      lozko: 150,
      lekarz: 20,
      pielegniarka: 20,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 5,
    typPacjenta: '5. Niepilny',
    procPacjentow: 0.0754396694214876,
    zasoby: {
      triage: null,
      lozko: 90,
      lekarz: 20,
      pielegniarka: 10,
      lozkoObserwacja: null,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 6,
    typPacjenta: 'Obserwacja',
    procPacjentow: 0.11,
    zasoby: {
      triage: null,
      lozko: null,
      lekarz: 72,
      pielegniarka: 72,
      lozkoObserwacja: 720,
      lozkoOczekiwanie: null,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 7,
    typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
    procPacjentow: 0.4,
    zasoby: {
      triage: null,
      lozko: null,
      lekarz: null,
      pielegniarka: null,
      lozkoObserwacja: null,
      lozkoOczekiwanie: 360,
    },
    wydajnoscPrzyjmowania: 5,
  },
  {
    id: 8,
    typPacjenta: 'Liczba zasobów',
    procPacjentow: null,
    zasoby: {
      triage: 2,
      lozko: 50,
      lekarz: 6,
      pielegniarka: 8,
      lozkoObserwacja: 20,
      lozkoOczekiwanie: 30,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 9,
    typPacjenta: 'Średni ważony czas na pacjenta',
    procPacjentow: null,
    zasoby: {
      triage: 5.0,
      lozko: 4.1,
      lekarz: 43.7,
      pielegniarka: 44.5,
      lozkoObserwacja: 1.3,
      lozkoOczekiwanie: 2.4,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 10,
    typPacjenta: 'Wydajność (napływ pacj./godz.)',
    procPacjentow: null,
    zasoby: {
      triage: 30.0,
      lozko: 12.18,
      lekarz: 8.24,
      pielegniarka: 10.78,
      lozkoObserwacja: 15.15,
      lozkoOczekiwanie: 12.5,
    },
    wydajnoscPrzyjmowania: null,
  },
  {
    id: 11,
    typPacjenta: 'Zajętość przy danej wydajności',
    procPacjentow: null,
    zasoby: {
      triage: 27,
      lozko: 68,
      lekarz: 100,
      pielegniarka: 76,
      lozkoObserwacja: 54,
      lozkoOczekiwanie: 66,
    },
    wydajnoscPrzyjmowania: 66,
  },
];