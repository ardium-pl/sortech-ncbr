import { Constants } from './utils/utils';

export const DECIMAL_PLACES = 2 as const;

export const LABELS_ZASOBY = [
  'Triage',
  'Resuscytacja',
  'Stan zagrożenia życia',
  'Pilny przypadek ostry',
  'Pilny przypadek nieostry',
  'Niepilny',
  'Obserwacja',
  'Oczek. na przyjęcie',
  'Liczba zasobów',
];

export const LABELS_METRYKI = [
  'Średni ważony czas na pacjenta',
  'Wydajność (napływ pacj./h)',
  'Zajętość',
];

export const COLOR_MAP = [
  'rgb(20, 120, 20)', // Dark Green
  'rgb(20, 120, 20)', // Green
  'rgb(50, 205, 50)', // Light Green
  'rgb(173, 255, 47)', // Yellow-Green
  'rgb(255, 255, 0)', // Yellow
  'rgb(255, 215, 0)', // Gold
  'rgb(255, 165, 0)', // Orange
  'rgb(255, 140, 0)', // Light Orange
  'rgb(255, 69, 0)', // Light Red
  'rgb(255, 0, 0)', // Red
  'rgb(180, 0, 0)', // Dark Red
  'rgb(150, 0, 0)', // Maroon
];

export const RZAD_TRIAGE = {
  id: 0,
  typPacjenta: 'Triage',
  procPacjentow: 0,
  zasoby: {
    triage: 5,
    lozko: 0,
    lekarz: 0,
    pielegniarka: 0,
    lozkoObserwacja: 0,
    lozkoOczekiwanie: 0,
  },
  wydajnoscPrzyjmowania: 0,
};

export const RZAD_OCZEKIWANIE_NA_PRZYJECIE = {
  id: 7,
  typPacjenta: 'Oczek. na przyj. na oddział leczniczy',
  procPacjentow: 0.4,
  zasoby: {
    triage: 5,
    lozko: 0,
    lekarz: 0,
    pielegniarka: 0,
    lozkoObserwacja: 0,
    lozkoOczekiwanie: 360,
  },
  wydajnoscPrzyjmowania: 5,
};

export const CONSTANTS: Constants = {
  pacjentRok: 51000,
  pacjentDzien: 140,

  wspolczynnikV: 0.5,

  dzien: [
    0.122920473612347, 0.164636673029502, 0.147341534824637, 0.144739791724691, 0.145398718828333, 0.146512781147892,
    0.128450026832599,
  ],

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

  // Jednostka - godziny
  sredniCzasNaPacjenta: {
    triage: 0.0833333333,
    lozko: 4.1046825069,
    lekarz: 0.7278064279,
    pielegniarka: 0.7922555096,
    lozkoObserwacja: 1.32,
  },
};
