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

export interface Kolejka {
  lekarz: number;
  pielegniarka: number;
}

export interface SredniCzasNaPacjenta {
  triage: number;
  lozko: number;
  lekarz: number;
  pielegniarka: number;
  lozkoObserwacja: number;
}
