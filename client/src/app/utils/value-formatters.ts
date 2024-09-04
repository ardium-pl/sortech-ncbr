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