export const exampleResponseBody = {
  daneGodzinowe: [
    {
      godzina: '0-1',
      liczbaPacjentow: 10,
      zasoby: {
        liczbaLekarzy: 3,
        liczbaPielegniarek: 5,
        liczbaLozek: 50,
        liczbaLozekObserwacyjnych: 50,
      },
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
    },
  ],
  kolejka: {
    lekarz: 55,
    pielegniarka: 22,
  },
};
