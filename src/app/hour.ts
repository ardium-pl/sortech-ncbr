export interface Hour {
  id: number;
  godzina: string;
  oczekiwaneWizyty: number;
  liczbaPielegniarek: number;
  wydajnoscPielegniarek: number;
  obslugaPielegniarka: number;
  kolejkaPielegniarka: number;
  oczekiwaniePielegniarka: number;
  lqPielegniarka: number;
  wqPielegniarka: number;
  liczbaLekarzy: number;
  wydajnoscLekarzy: number;
  obslugaLekarz: number;
  kolejkaLekarz: number;
  oczekiwanieLekarz: number;
  lqLekarz: number;
  wqLekarz: number;
  liczbaLozek: number;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: number;
  wydajnoscLozekObserwacja: number;
  waskiZasob: string;
  waskaWydajnosc: number;
  mozliwoscPokryciaZopatrzenia: string;
  opoznienieOgolem: number;

  [property: string]: string | number;
}
