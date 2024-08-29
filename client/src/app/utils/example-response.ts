const exampleResponseBody = {
  daneGodzinowe: [
    {
      godzina: '0-1',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 9,
        liczbaPielegniarek: 5,
        liczbaLozek: 18,
        liczbaLozekObserwacyjnych: 8,
      },
    },
    {
      godzina: '1-2',
      liczbaPacjentow: 2,
      zasoby: {
        liczbaLekarzy: 6,
        liczbaPielegniarek: 5,
        liczbaLozek: 29,
        liczbaLozekObserwacyjnych: 7,
      },
    },
    {
      godzina: '2-3',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 14,
        liczbaLozek: 29,
        liczbaLozekObserwacyjnych: 5,
      },
    },
    {
      godzina: '3-4',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 3,
        liczbaPielegniarek: 6,
        liczbaLozek: 16,
        liczbaLozekObserwacyjnych: 2,
      },
    },
    {
      godzina: '4-5',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 14,
        liczbaLozek: 17,
        liczbaLozekObserwacyjnych: 5,
      },
    },
    {
      godzina: '5-6',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 8,
        liczbaLozek: 16,
        liczbaLozekObserwacyjnych: 4,
      },
    },
    {
      godzina: '6-7',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 8,
        liczbaPielegniarek: 5,
        liczbaLozek: 20,
        liczbaLozekObserwacyjnych: 2,
      },
    },
    {
      godzina: '7-8',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 13,
        liczbaLozek: 12,
        liczbaLozekObserwacyjnych: 5,
      },
    },
    {
      godzina: '8-9',
      liczbaPacjentow: 3,
      zasoby: {
        liczbaLekarzy: 9,
        liczbaPielegniarek: 7,
        liczbaLozek: 11,
        liczbaLozekObserwacyjnych: 6,
      },
    },
    {
      godzina: '9-10',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 7,
        liczbaLozek: 19,
        liczbaLozekObserwacyjnych: 8,
      },
    },
    {
      godzina: '10-11',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 8,
        liczbaPielegniarek: 6,
        liczbaLozek: 27,
        liczbaLozekObserwacyjnych: 5,
      },
    },
    {
      godzina: '11-12',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 9,
        liczbaLozek: 26,
        liczbaLozekObserwacyjnych: 8,
      },
    },
    {
      godzina: '12-13',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 15,
        liczbaLozek: 29,
        liczbaLozekObserwacyjnych: 6,
      },
    },
    {
      godzina: '13-14',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 6,
        liczbaPielegniarek: 12,
        liczbaLozek: 13,
        liczbaLozekObserwacyjnych: 2,
      },
    },
    {
      godzina: '14-15',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 11,
        liczbaLozek: 21,
        liczbaLozekObserwacyjnych: 3,
      },
    },
    {
      godzina: '15-16',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 7,
        liczbaLozek: 26,
        liczbaLozekObserwacyjnych: 6,
      },
    },
    {
      godzina: '16-17',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 3,
        liczbaPielegniarek: 9,
        liczbaLozek: 21,
        liczbaLozekObserwacyjnych: 4,
      },
    },
    {
      godzina: '17-18',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 9,
        liczbaPielegniarek: 14,
        liczbaLozek: 29,
        liczbaLozekObserwacyjnych: 6,
      },
    },
    {
      godzina: '18-19',
      liczbaPacjentow: 3,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 14,
        liczbaLozek: 17,
        liczbaLozekObserwacyjnych: 3,
      },
    },
    {
      godzina: '19-20',
      liczbaPacjentow: 0,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 7,
        liczbaLozek: 25,
        liczbaLozekObserwacyjnych: 4,
      },
    },
    {
      godzina: '20-21',
      liczbaPacjentow: 2,
      zasoby: {
        liczbaLekarzy: 4,
        liczbaPielegniarek: 13,
        liczbaLozek: 24,
        liczbaLozekObserwacyjnych: 5,
      },
    },
    {
      godzina: '21-22',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 10,
        liczbaPielegniarek: 15,
        liczbaLozek: 16,
        liczbaLozekObserwacyjnych: 2,
      },
    },
    {
      godzina: '22-23',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 6,
        liczbaPielegniarek: 9,
        liczbaLozek: 14,
        liczbaLozekObserwacyjnych: 8,
      },
    },
    {
      godzina: '23-24',
      liczbaPacjentow: 1,
      zasoby: {
        liczbaLekarzy: 7,
        liczbaPielegniarek: 9,
        liczbaLozek: 22,
        liczbaLozekObserwacyjnych: 5,
      },
    },
  ],
  czasZasobuNaPacjenta: [
    {
      rodzajPacjenta: 'resuscytacja',
      lekarz: 300,
      pielegniarka: 500,
      lozko: 2000,
      lozkoObserwacyjne: 5000,
    },
    {
      rodzajPacjenta: 'stanZagrozeniaZycia',
      lekarz: 240,
      pielegniarka: 450,
      lozko: 1700,
      lozkoObserwacyjne: 4500,
    },
    {
      rodzajPacjenta: 'pilnyPrzypadekOstry',
      lekarz: 200,
      pielegniarka: 390,
      lozko: 1500,
      lozkoObserwacyjne: 3800,
    },
    {
      rodzajPacjenta: 'pilnyPrzypadekNieostry',
      lekarz: 170,
      pielegniarka: 360,
      lozko: 1250,
      lozkoObserwacyjne: 3500,
    },
    {
      rodzajPacjenta: 'niepilny',
      lekarz: 150,
      pielegniarka: 290,
      lozko: 500,
      lozkoObserwacyjne: 2800,
    },
    {
      rodzajPacjenta: 'obserwacja',
      lekarz: 90,
      pielegniarka: 200,
      lozko: 0,
      lozkoObserwacyjne: 2000,
    },
  ],
  statystykaChorych: {
    resuscytacja: 0.1,
    stanZagrozeniaZycia: 0.1,
    pilnyPrzypadekOstry: 0.25,
    pilnyPrzypadekNieostry: 0.15,
    niepilny: 0.2,
    obserwacja: 0.2,
  },
  kolejka: {
    lekarz: 58,
    pielegniarka: 6,
  },
};
