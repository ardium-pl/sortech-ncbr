// Ten plik jest plikiem tymczasowym
import { Hour, kolejka } from '../interfaces/hour';
import { StaticRow } from '../interfaces/static-row';
import { SummaryBottom, SummaryTop } from '../interfaces/summaries';

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
