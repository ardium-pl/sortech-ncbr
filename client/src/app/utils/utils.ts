import { ICellRendererParams } from 'ag-grid-community';
import * as MoreRounding from 'more-rounding';
import { DECIMAL_PLACES } from '../constants';

export function numberRoundingFormatter({ value }: ICellRendererParams, decimalPlaces: number = DECIMAL_PLACES) {
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return value;
  } else {
    return MoreRounding.roundToPrecision(numericValue, decimalPlaces).toLocaleString();
  }
}

export function numberRoundingFormatterNoZeros({ value }: ICellRendererParams, decimalPlaces: number = DECIMAL_PLACES) {
  // Ensure that no zeros are displayed
  return !value ? '' : numberRoundingFormatter({ value: value } as ICellRendererParams, decimalPlaces);
}

export function percentFormatter({ value }: ICellRendererParams, decimalPlaces: number = DECIMAL_PLACES) {
  let numericValue = Number(value);

  if (isNaN(numericValue)) {
    return value;
  } else {
    numericValue *= 100;
    return numberRoundingFormatter({ value: numericValue } as ICellRendererParams, decimalPlaces) + '%';
  }
}

export interface LQparams {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  queueCapacity?: number | null;
}

export interface Godzina {
  '0-1': number;
  '1-2': number;
  '2-3': number;
  '3-4': number;
  '4-5': number;
  '5-6': number;
  '6-7': number;
  '7-8': number;
  '8-9': number;
  '9-10': number;
  '10-11': number;
  '11-12': number;
  '12-13': number;
  '13-14': number;
  '14-15': number;
  '15-16': number;
  '16-17': number;
  '17-18': number;
  '18-19': number;
  '19-20': number;
  '20-21': number;
  '21-22': number;
  '22-23': number;
  '23-24': number;
}

export interface SredniCzasNaPacjenta {
  triage: number;
  lozko: number;
  lekarz: number;
  pielegniarka: number;
  lozkoObserwacja: number;
}

type Dzien = [number, number, number, number, number, number, number];

export interface Constants {
  pacjentRok: number;
  pacjentDzien: number;
  wspolczynnikV: number;
  dzien: Dzien;
  godzina: Godzina;
  sredniCzasNaPacjenta: SredniCzasNaPacjenta;
}
