export interface StaticRow {
  id: number;
  typPacjenta: string;
  procPacjentow: number | null;
  zasoby: {
    triage: number | null;
    lozko: number | null;
    lekarz: number | null;
    pielegniarka: number | null;
    lozkoObserwacja: number | null;
    lozkoOczekiwanie: number | null;
  };
  wydajnoscPrzyjmowania: number | null;
}
