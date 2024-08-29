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

export const ZasobyITriage = {
  ...Zasoby,
  Triage: 'triage',
} as const;
export type ZasobyITriage = (typeof ZasobyITriage)[keyof typeof ZasobyITriage];

export const ZasobyTriageILozkoOczekiwanie = {
  ...ZasobyITriage,
  LozkoOczekiwanie: 'lozkoOczekiwanie',
} as const;
export type ZasobyTriageILozkoOczekiwanie = (typeof ZasobyTriageILozkoOczekiwanie)[keyof typeof ZasobyTriageILozkoOczekiwanie];

export type WaskieGardlo = {
  [key in ZasobyITriage | 'lozkoOczekiwanie' | 'wydajnoscPrzyjmowania']: boolean;
};
