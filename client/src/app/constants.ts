import { SummaryTop, SummaryBottom } from './interfaces/summaries';
import { Kolejka, SredniCzasNaPacjenta } from './interfaces/other-interfaces';
import { WaskieGardlo } from './interfaces/zasoby';
import { StaticRow } from './interfaces/static-row';

export const DECIMAL_PLACES = 2 as const;

export const DEFAULT_DATE = new Date(2024, 7, 1);

export const WSPOLCZYNNIK_V = 0.5;

export const DEFAULT_WASKIE_GARDLO: WaskieGardlo = {
  triage: false,
  lozko: false,
  lekarz: false,
  pielegniarka: false,
  lozkoObserwacja: false,
  lozkoOczekiwanie: false,
  wydajnoscPrzyjmowania: false,
};

export const DEFAULT_SUMMARY_ROW_TOP: SummaryTop = {
  id: 24,
  liczbaWizyt: 0,
  wydajnosc: {
    lekarz: 0,
    pielegniarka: 0,
    lozko: 0,
    lozkoObserwacja: 0,
  },
};

export const DEFAULT_SUMMARY_ROW_BOTTOM: SummaryBottom = {
  id: 25,
  wydajnosc: {
    lekarz: 0,
    pielegniarka: 0,
    lozko: 0,
    lozkoObserwacja: 0,
  },
};

export const DEFAULT_KOLEJKA: Kolejka = {
  lekarz: 0,
  pielegniarka: 0,
};

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

export const LABELS_METRYKI = ['Średni ważony czas na pacjenta', 'Wydajność (napływ pacj./h)', 'Zajętość'];

export const RZAD_TRIAGE: StaticRow = {
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

export const RZAD_OCZEKIWANIE_NA_PRZYJECIE: StaticRow = {
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

// Should be replaced by data from backend
export const SREDNI_CZAS_NA_PACJENTA: SredniCzasNaPacjenta = {
  triage: 0.0833333333,
  lozko: 4.1046825069,
  lekarz: 0.7278064279,
  pielegniarka: 0.7922555096,
  lozkoObserwacja: 1.32,
};