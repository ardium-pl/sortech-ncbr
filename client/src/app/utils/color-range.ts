export const COLOR_RANGE_CLASS_MAP = [
  'color-dark-green',
  'color-green',
  'color-light-green',
  'color-yellow-green',
  'color-yellow',
  'color-gold',
  'color-orange',
  'color-dark-orange',
  'color-orange-red',
  'color-red',
  'color-dark-red',
  'color-maroon',
];

export function getColorRangeClass(value: number | null | undefined, min: number, max: number): string {
  if (value === null || value === undefined || typeof value === 'string') {
    return '';
  }
  const step = (max - min) / COLOR_RANGE_CLASS_MAP.length;

  value -= min;
  value /= step;
  value = Math.floor(value);
  value = Math.max(value, 0);
  value = Math.min(value, COLOR_RANGE_CLASS_MAP.length - 1);

  return COLOR_RANGE_CLASS_MAP[value];
}
