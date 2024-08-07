Oczywiście. Oto obszerna dokumentacja dla Twojego serwera Express, uwzględniająca jego strukturę i funkcjonalności:

# Dokumentacja Serwera Express dla Systemu Obsługi SOR (Szpitalnego Oddziału Ratunkowego)

## Spis treści
1. Wprowadzenie
2. Struktura projektu
3. Konfiguracja
4. Endpointy API
5. Modele danych
6. Usługi (Services)
7. Middleware
8. Obsługa błędów
9. Logowanie
10. Bezpieczeństwo
11. Testowanie
12. Deployment

## 1. Wprowadzenie

Ten serwer Express jest częścią systemu zarządzania Szpitalnym Oddziałem Ratunkowym (SOR). Służy do obsługi danych pacjentów, zarządzania zasobami szpitala (lekarze, pielęgniarki, łóżka) oraz monitorowania kolejek.

## 2. Struktura projektu

```
projekt-sor/
│
├── config/
│   ├── database.js
│   └── logger.js
│
├── middleware/
│   └── validation.js
│
├── routes/
│   ├── sor.js
│   ├── personel.js
│   └── leki.js
│
├── services/
│   └── sor.js
│
├── utils/
│   └── logger.js
│
├── .env
├── index.js
└── package.json
```

## 3. Konfiguracja

### Baza danych (config/database.js)
Projekt używa MySQL jako bazy danych. Połączenie jest konfigurowane za pomocą zmiennych środowiskowych:

```javascript
export async function createTCPConnection() {
    return mysql.createConnection(process.env.MYSQL_URL);
}
```

### Zmienne środowiskowe (.env)
```
PORT=8080
MYSQL_URL=mysql://user:password@host:port/database
LOG_LEVEL=info
```

## 4. Endpointy API

### SOR Router (routes/sor.js)

#### GET /api/sor/hourly-data
Pobiera dane godzinowe o stanie zasobów dla wybranego dnia oraz dane z ostatniej godziny poprzedniego dnia.

Parametry zapytania:
- `date`: Data w formacie YYYY-MM-DD

Przykładowa odpowiedź:
```json
{
  "currentDayData": [
    {
      "hour": "2023-06-15 00:00:00",
      "ilosc_lekarzy": 5,
      "ilosc_pielegniarek": 10,
      "ilosc_lozek": 20,
      "ilosc_lozek_obserwacji": 5
    },
    // ... dane dla kolejnych godzin
  ],
  "prevDayLastHourData": {
    "ilosc_lekarzy": 4,
    "ilosc_pielegniarek": 8,
    "ilosc_lozek": 18,
    "ilosc_lozek_obserwacji": 4,
    "kolejka_lekarz": 30,
    "kolejka_pielegniarka": 15
  }
}
```

#### POST /api/sor/stan-kolejki
Dodaje lub aktualizuje stan kolejki dla danego dnia.

Przykładowe body żądania:
```json
{
  "data": "2023-06-15",
  "minuty_lekarz": 30,
  "minuty_pielegniarka": 15
}
```

Odpowiedź:
```json
{
  "message": "Stan kolejki dodany/zaktualizowany",
  "result": 1
}
```

## 5. Modele danych

### Tabela: typy_pacjenta
- `id`: int unsigned (Klucz główny)
- `nazwa`: varchar(48)
- `czas_lekarza`: double
- `czas_pielegniarki`: double
- `czas_lozka`: double
- `czas_lozka_obserwacji`: double

### Tabela: pacjenci
- `id`: int unsigned (Klucz główny)
- `data_przyjecia`: datetime
- `typ`: int unsigned (Klucz obcy do typy_pacjenta.id)

### Tabela: stan_zasobow
- `id`: int unsigned (Klucz główny)
- `ostatnia_aktualizacja`: datetime
- `ilosc_lekarzy`: int unsigned
- `ilosc_pielegniarek`: int unsigned
- `ilosc_lozek`: int unsigned
- `ilosc_lozek_obserwacji`: int unsigned

### Tabela: stan_kolejki
- `id`: int unsigned (Klucz główny)
- `data`: datetime
- `minuty_lekarz`: int
- `minuty_pielegniarka`: int

## 6. Usługi (Services)

### sor.js

#### getHourlyData(date)
Pobiera godzinowe dane o stanie zasobów dla wybranego dnia oraz dane z ostatniej godziny poprzedniego dnia.

#### addStanKolejki(stanKolejki)
Dodaje lub aktualizuje stan kolejki dla danego dnia.

## 7. Middleware

### validation.js
Zawiera funkcje walidacyjne dla różnych endpointów, np. `validatePacjent` do walidacji danych pacjenta.

## 8. Obsługa błędów

W głównym pliku `index.js` zdefiniowany jest middleware do obsługi błędów:

```javascript
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});
```

## 9. Logowanie

Projekt używa Winston do logowania. Konfiguracja znajduje się w `utils/logger.js`.

## 10. Bezpieczeństwo

- Używane są zmienne środowiskowe do przechowywania wrażliwych danych.
- Stosowana jest walidacja danych wejściowych.
- Używane są parametryzowane zapytania SQL, aby zapobiec atakom SQL Injection.

## 11. Testowanie

(Tu należy dodać informacje o testach jednostkowych i integracyjnych, jeśli są implementowane)

## 12. Deployment

Serwer może być uruchomiony lokalnie za pomocą polecenia:

```
node index.js
```

Dla środowiska produkcyjnego zaleca się użycie menedżera procesów, takiego jak PM2:

```
pm2 start index.js --name "sor-server"
```

---

Ta dokumentacja obejmuje główne aspekty Twojego serwera Express. Możesz ją rozszerzyć o dodatkowe szczegóły specyficzne dla Twojego projektu, takie jak dodatkowe endpointy, bardziej szczegółowe opisy procesów biznesowych, czy instrukcje dla zespołu deweloperskiego.