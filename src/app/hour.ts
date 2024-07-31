export interface Hour {
  id: number,
  godzina: string;
  oczekiwaneWizyty: number;
  liczbaPielegniarek: number;
  wydajnoscPielegniarek: number;
  liczbaLekarzy: number;
  wydajnoscLekarzy: number;
  liczbaLozek: number;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: number;
  wydajnoscLozekObserwacja: number;
  waskiZasob: string;
  waskaWydajnosc: number;
  mozliwoscPokryciaZopatrzenia: string;

  [property: string]: string | number;
}
