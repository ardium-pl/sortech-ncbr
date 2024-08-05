export interface LQparams {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  queueCapacity?: number | null;
}
