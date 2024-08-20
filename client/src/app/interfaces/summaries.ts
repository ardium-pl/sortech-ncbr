export interface SummaryBottom {
  id: number;
  wydajnosc: {
    lekarz: number;
    pielegniarka: number;
    lozko: number;
    lozkoObserwacja: number;
  };
}

export interface SummaryTop extends SummaryBottom {
  liczbaWizyt: number;
}
