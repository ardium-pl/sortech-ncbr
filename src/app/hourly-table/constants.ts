export const CONSTANTS = {
  pacjentRok: 51000,
  pacjentDzien: Math.round(51000 / 360),

  dzien: {
    poniedzialek: 0.1646,
    wtorek: 0.1473,
    sroda: 0.1447,
    czwartek: 0.1454,
    piatek: 0.1465,
    sobota: 0.1285,
    niedziela: 0.1229,
  },

  godzina: {
    pierwsza: 0.0148,
    druga: 0.0133,
    trzecia: 0.0113,
    czwarta: 0.0105,
    piata: 0.0104,
    szosta: 0.0111,
    siodma: 0.0182,
    osma: 0.0315,
    dziewiata: 0.0351,
    dziesiata: 0.0573,
    jedenasta: 0.0759,
    dwunasta: 0.0821,
    trzynasta: 0.0759,
    czternasta: 0.0652,
    pietnasta: 0.0585,
    szesnasta: 0.0603,
    siedemnasta: 0.0638,
    osiemnasta: 0.0759,
    dziewietnasta: 0.0736,
    dwudziesta: 0.0731,
    dwudziestaPierwsza: 0.0719,
    dwudziestaDruga: 0.0415,
    dwudziestaTrzecia: 0.0253,
    dwudziestaCzwarta: 0.02,
  },

  sredniCzasNaPacjenta: {
    triage: 5, // min
    lozko: 4.1 * 60, // godz => min
    lekarz: 43.7, // min
    pielegniarka: 47.5, // min
    obserwacja: 1.3 * 60, // godz => min
  },
};
