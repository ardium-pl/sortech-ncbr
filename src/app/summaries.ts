export interface Summary1 {
  id: number;
  godzina: string | null;
  oczekiwaneWizyty: number | null;
  liczbaPielegniarek: null;
  wydajnoscPielegniarek: number;
  liczbaLekarzy: null;
  wydajnoscLekarzy: number;
  liczbaLozek: null;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: null;
  wydajnoscLozekObserwacja: number;
  // waskiZasob: null;
  // waskaWydajnosc: null;
  // mozliwoscPokryciaZopatrzenia: null;

  [property: string]: string | number | null;
}

export interface Summary2 {
  id: number;
  // godzina: string | null;
  // oczekiwaneWizyty: number | null;
  liczbaPielegniarek: null;
  wydajnoscPielegniarek: number;
  liczbaLekarzy: null;
  wydajnoscLekarzy: number;
  liczbaLozek: null;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: null;
  wydajnoscLozekObserwacja: number;
  // waskiZasob: null;
  // waskaWydajnosc: null;
  // mozliwoscPokryciaZopatrzenia: null;
  [property: string]: string | number | null;
}
