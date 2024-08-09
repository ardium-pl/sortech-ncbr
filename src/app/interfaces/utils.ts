export interface LQparams {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  queueCapacity?: number | null;
}

export interface Dzien {
  poniedzialek: number;
  wtorek: number;
  sroda: number;
  czwartek: number;
  piatek: number;
  sobota: number;
  niedziela: number;

  [key: string]: number;
}

export interface Godzina {
  [key: string]: number;
}

export interface SredniCzasNaPacjenta {
  [key: string]: number;
}

export interface Constants {
  pacjentRok: number;
  pacjentDzien: number;
  wspolczynnikV: number;
  dzien: Dzien;
  godzina: Godzina;
  sredniCzasNaPacjenta: SredniCzasNaPacjenta;
}
