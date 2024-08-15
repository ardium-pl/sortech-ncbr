export interface Hour {
  id: number;
  godzina: string;
  oczekiwaneWizyty: number;
  liczbaPielegniarek: number;
  wydajnoscPielegniarek: number;
  obslugaPielegniarka: number;
  kolejkaPielegniarka: number;
  oczekiwaniePielegniarka: number;
  lqPielegniarka: number | string;
  wqPielegniarka: number | string;
  liczbaLekarzy: number;
  wydajnoscLekarzy: number;
  obslugaLekarz: number;
  kolejkaLekarz: number;
  oczekiwanieLekarz: number;
  lqLekarz: number | string;
  wqLekarz: number | string;
  liczbaLozek: number;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: number;
  wydajnoscLozekObserwacja: number;
  waskiZasob: string;
  waskaWydajnosc: number;
  mozliwoscPokryciaZopatrzenia: string;
  opoznienieOgolem: number | string;
}
