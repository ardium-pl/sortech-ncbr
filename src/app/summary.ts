export interface Summary {
  id: number;
  godzina: string;
  oczekiwaneWizyty: number;
  liczbaPielegniarek: 777;
  wydajnoscPielegniarek: number;
  liczbaLekarzy: 777;
  wydajnoscLekarzy: number;
  liczbaLozek: 777;
  wydajnoscLozek: number;
  liczbaLozekObserwacja: 777;
  wydajnoscLozekObserwacja: number;
  waskiZasob: string;
  waskaWydajnosc: 777;
  mozliwoscPokryciaZopatrzenia: string;

  [property: string]: string | number | 777;
}

