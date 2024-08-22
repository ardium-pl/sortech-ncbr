export const LekarzLubPielegniarka = {
  Lekarz: 'lekarz',
  Pielegniarka: 'pielegniarka',
} as const;
export type LekarzLubPielegniarka = (typeof LekarzLubPielegniarka)[keyof typeof LekarzLubPielegniarka];

export const Zasoby = {
  ...LekarzLubPielegniarka,
  Lozko: 'lozko',
  LozkoObserwacja: 'lozkoObserwacja',
} as const;
export type Zasoby = (typeof Zasoby)[keyof typeof Zasoby];
