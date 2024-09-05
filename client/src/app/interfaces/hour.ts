import { Kolejka, Godzina } from './other-interfaces';

export interface daneGodzinowe {
  id: number;
  godzina: keyof Godzina;
  liczbaWizyt: number;
  zasoby: {
    lekarz: number;
    pielegniarka: number;
    lozko: number;
    lozkoObserwacja: number;
  };
}

export interface Hour extends daneGodzinowe {
  wydajnosc: {
    lekarz: number;
    pielegniarka: number;
    lozko: number;
    lozkoObserwacja: number;
  };
  obsluga: {
    lekarz: number;
    pielegniarka: number;
  };
  oczekiwanie: {
    lekarz: number;
    pielegniarka: number;
  };
  lq: {
    lekarz: number | string;
    pielegniarka: number | string;
  };
  wq: {
    lekarz: number | string;
    pielegniarka: number | string;
  };
  kolejka: Kolejka;
  waskiZasob: string;
  waskaWydajnosc: number;
  mozliwoscPokryciaZopatrzenia: string;
  opoznienieOgolem: number | string;
}