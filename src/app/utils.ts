import { ICellRendererParams } from 'ag-grid-community';
import * as MoreRounding from 'more-rounding';

export const DECIMAL_PLACES = 2 as const;

export function numberRoundingFormatter({ value }: ICellRendererParams) {
  if (!isNaN(Number(value))) {
    return `${MoreRounding.roundToPrecision(value, DECIMAL_PLACES)}`;
  } else {
    return value;
  }
}

export function markBottleneckAndRoundFormatter({ data, value }: ICellRendererParams) {
  if (data['id'] === 11 && value === 777) {
    return '***';
  }

  if (value === null) {
    return '';
  }

  if (!isNaN(Number(value))) {
    return `${MoreRounding.roundToPrecision(value, DECIMAL_PLACES)}`;
  }

  return value;
}

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
