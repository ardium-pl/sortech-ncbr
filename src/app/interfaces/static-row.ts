export interface StaticRow {
  id: number;
  typPacjenta: string;
  procPacjentow: number | null;
  triage: number | null;
  lozko: number | null;
  lekarz: number | null;
  pielegniarka: number | null;
  lozkoObserwacja: number | null;
  lozkoOczekiwanie: number | null;
  wydajnoscPrzyjmowania: number | null;

  [property: string]: string | number | null;
}
