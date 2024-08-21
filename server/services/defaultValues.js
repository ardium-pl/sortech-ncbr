export const doctorData = {
  normalHeadCount: 6,
  rushHourHeadCount: 8,
  rushHoursStart: 4,
  rushHoursEnd: 12,
};

export const nurseData = {
  normalHeadCount: 4,
  rushHourHeadCount: 7,
  rushHoursStart: 8,
  rushHoursEnd: 20,
};

export const defaultValues = {
  statystykaChorych: {
    triage: 1,
    resuscytacja: 0.01,
    stanZagrozeniaZycia: 0.02,
    pilnyPrzypadekOstry: 0.03,
    pilnyPrzypadekNieostry: 0.4,
    niepilny: 0.5,
    obserwacja: 0.04,
  },
  czasZasobuNaPacjenta: [
    {
      rodzajPacjenta: 'Triage',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Resuscytacja',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Stan zagrożenia życia',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Pilny przypadek ostry',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Pilny przypadek nieostry',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Niepilny',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
    {
      rodzajPacjenta: 'Obserwacja',
      lekarz: 0,
      pielegniarka: 15,
      lozko: 0,
      lozkoObserwacyjne: 0,
    },
  ],
  liczbaLozek: 50,
  liczbaLozekObserwacyjnych: 50,
  distribution: {
    Monday: [
      0.33, 0.24, 0.22, 0.19, 0.17, 0.17, 0.18, 0.3, 0.58, 0.94, 1.24, 1.35, 1.25, 1.07, 0.96, 0.99, 1.05, 1.03, 0.95,
      0.87, 0.78, 0.65, 0.52, 0.42,
    ],
    Tuesday: [
      0.29, 0.22, 0.2, 0.17, 0.16, 0.15, 0.16, 0.27, 0.52, 0.84, 1.11, 1.21, 1.12, 0.96, 0.86, 0.89, 0.94, 0.92, 0.85,
      0.78, 0.69, 0.58, 0.46, 0.37,
    ],
    Wednesday: [
      0.29, 0.21, 0.19, 0.16, 0.15, 0.15, 0.16, 0.27, 0.51, 0.83, 1.09, 1.19, 1.1, 0.94, 0.85, 0.87, 0.92, 0.91, 0.84,
      0.77, 0.68, 0.57, 0.46, 0.37,
    ],
    Thursday: [
      0.29, 0.22, 0.19, 0.16, 0.15, 0.15, 0.16, 0.27, 0.51, 0.83, 1.09, 1.19, 1.1, 0.95, 0.85, 0.88, 0.93, 0.91, 0.84,
      0.77, 0.69, 0.57, 0.46, 0.37,
    ],
    Friday: [
      0.29, 0.22, 0.19, 0.17, 0.15, 0.15, 0.16, 0.27, 0.51, 0.84, 1.1, 1.2, 1.11, 0.95, 0.86, 0.88, 0.93, 0.92, 0.85,
      0.78, 0.69, 0.57, 0.46, 0.37,
    ],
    Saturday: [
      0.26, 0.19, 0.17, 0.15, 0.14, 0.13, 0.14, 0.24, 0.45, 0.74, 0.97, 1.06, 0.97, 0.84, 0.75, 0.77, 0.82, 0.8, 0.74,
      0.68, 0.61, 0.5, 0.4, 0.32,
    ],
    Sunday: [
      0.25, 0.18, 0.16, 0.14, 0.13, 0.13, 0.14, 0.23, 0.43, 0.7, 0.93, 1.01, 0.93, 0.8, 0.72, 0.74, 0.78, 0.77, 0.71,
      0.65, 0.58, 0.48, 0.39, 0.31,
    ],
  },
};
