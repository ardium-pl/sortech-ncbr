Rozszerzona dokumentacja serwera Express dla Systemu Obsługi SOR:

# Dokumentacja Serwera Express dla Systemu Obsługi SOR (Szpitalnego Oddziału Ratunkowego)

## Spis treści

1. Wprowadzenie
2. Struktura projektu
3. Konfiguracja
4. Endpointy API

- 4.1. SOR Router
- 4.2. Personel Router
- 4.3. Leki Router

5. Modele danych
6. Usługi (Services)
7. Middleware
8. Obsługa błędów
9. Logowanie
10. Bezpieczeństwo
11. Testowanie
12. Deployment
13. Diagramy sekwencyjne

## 1. Wprowadzenie

Ten serwer Express jest kluczową częścią systemu zarządzania Szpitalnym Oddziałem Ratunkowym (SOR). Głównym celem
projektu jest dostarczenie narzędzi do efektywnego monitorowania i zarządzania pacjentami, zasobami ludzkimi oraz
infrastrukturą SOR. Serwer obsługuje wszystkie operacje związane z danymi pacjentów, zarządzaniem personelem medycznym i
dostępnymi łóżkami, a także umożliwia śledzenie kolejek i stanu zasobów w czasie rzeczywistym.

## 2. Struktura projektu

Projekt został zorganizowany w następującej strukturze katalogów:

```
projekt-sor/
│
├── config/
│   └── database.js
│
│
├── middleware/
│   └── validation.js
│
├── routes/
│   └── sor.js
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

Struktura ta zapewnia czytelny i modularny podział odpowiedzialności w aplikacji. Główne składniki to:

- **config**: Zawiera pliki konfiguracyjne, takie jak połączenie z bazą danych.
- **middleware**: Przechowuje middleware, np. funkcje walidacyjne.
- **routes**: Definiuje punkty końcowe (endpointy) API.
- **services**: Implementuje logikę biznesową i operacje na danych.
- **utils**: Zawiera ogólne narzędzia, takie jak moduł loggera.

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

Oczywiście, dostosujmy dokumentację do faktycznych endpointów w naszym kodzie. Oto zaktualizowana sekcja dokumentacji dotycząca endpointów:

## 4. Endpointy API

### 4.1. SOR Router (routes/sor.js)

#### GET /api/stan-zasobow

Endpoint ten zwraca stan zasobów dla określonego dnia.

**Parametry zapytania:**

- `date` (wymagane): Data w formacie YYYY-MM-DD, dla której mają zostać pobrane dane.

**Przykładowa odpowiedź:**

```json
[
  {
    "id": 1,
    "ostatnia_aktualizacja": "2023-06-15 08:00:00",
    "ilosc_lekarzy": 5,
    "ilosc_pielegniarek": 10,
    "ilosc_lozek": 20,
    "ilosc_lozek_obserwacji": 5
  },
  {
    "id": 2,
    "ostatnia_aktualizacja": "2023-06-15 09:00:00",
    "ilosc_lekarzy": 6,
    "ilosc_pielegniarek": 11,
    "ilosc_lozek": 19,
    "ilosc_lozek_obserwacji": 4
  }
  // ... więcej rekordów
]
```

#### GET /api/pacjenci

Endpoint ten zwraca listę pacjentów przyjętych w określonym dniu wraz z informacjami o ich typie.

**Parametry zapytania:**

- `date` (wymagane): Data w formacie YYYY-MM-DD, dla której mają zostać pobrani pacjenci.

**Przykładowa odpowiedź:**

```json
[
  {
    "id": 1,
    "data_przyjecia": "2023-06-15 10:30:00",
    "typ": 1,
    "nazwa": "Pilny",
    "czas_lekarza": 30,
    "czas_pielegniarki": 20,
    "czas_lozka": 120,
    "czas_lozka_obserwacji": 60
  },
  {
    "id": 2,
    "data_przyjecia": "2023-06-15 11:15:00",
    "typ": 2,
    "nazwa": "Stabilny",
    "czas_lekarza": 20,
    "czas_pielegniarki": 15,
    "czas_lozka": 90,
    "czas_lozka_obserwacji": 0
  }
  // ... więcej pacjentów
]
```

#### POST /api/stan-zasobow

Endpoint ten służy do dodawania nowego stanu zasobów.

**Przykładowe body żądania:**

```json
{
  "ostatnia_aktualizacja": "2023-06-15 12:00:00",
  "ilosc_lekarzy": 7,
  "ilosc_pielegniarek": 12,
  "ilosc_lozek": 18,
  "ilosc_lozek_obserwacji": 5
}
```

**Odpowiedź:**

```json
{
  "message": "Stan zasobów dodany",
  "id": 3
}
```

#### POST /api/pacjenci

Endpoint ten służy do dodawania nowego pacjenta.

**Przykładowe body żądania:**

```json
{
  "data_przyjecia": "2023-06-15 13:45:00",
  "typ": 1
}
```

**Odpowiedź:**

```json
{
  "message": "Pacjent dodany",
  "id": 3
}
```

#### GET /api/hourly-data

Endpoint ten zwraca dane godzinowe o stanie zasobów dla wybranego dnia oraz dane z ostatniej godziny poprzedniego dnia.

**Parametry zapytania:**

- `date` (wymagane): Data w formacie YYYY-MM-DD, dla której mają zostać pobrane dane.

**Przykładowa odpowiedź:**

```json
{
  "currentDayData": [
    {
      "hour": "2023-06-15 00:00:00",
      "avg_ilosc_lekarzy": 5,
      "avg_ilosc_pielegniarek": 10,
      "avg_ilosc_lozek": 20,
      "avg_ilosc_lozek_obserwacji": 5
    }
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

#### POST /api/stan-kolejki

Endpoint ten służy do dodawania lub aktualizowania stanu kolejki dla danego dnia.

**Przykładowe body żądania:**

```json
{
  "data": "2023-06-15",
  "minuty_lekarz": 30,
  "minuty_pielegniarka": 15
}
```

**Odpowiedź:**

```json
{
  "message": "Stan kolejki dodany/zaktualizowany",
  "result": 1
}
```

Ta zaktualizowana dokumentacja odzwierciedla faktyczne endpointy zdefiniowane w kodzie `routes/sor.js`. Zawiera ona opisy wszystkich dostępnych endpointów, ich parametrów, przykładowych żądań i odpowiedzi.

## 5. Modele danych

Aplikacja używa następujących tabel w bazie danych:

### Tabela: typy_pacjenta

- `id`: int unsigned (Klucz główny)
- `nazwa`: varchar(48)
- `czas_lekarza`: double
- `czas_pielegniarki`: double
- `czas_lozka`: double
- `czas_lozka_obserwacji`: double

Tabela ta przechowuje informacje o różnych typach pacjentów, takich jak czas pobytu u lekarza, pielęgniarki, czas
zajmowania łóżka oraz czas obserwacji.

### Tabela: pacjenci

- `id`: int unsigned (Klucz główny)
- `data_przyjecia`: datetime
- `typ`: int unsigned (Klucz obcy do typy_pacjenta.id)

Tabela ta zawiera informacje o pacjentach przyjętych do SOR, w tym datę przyjęcia i typ pacjenta.

### Tabela: stan_zasobow

- `id`: int unsigned (Klucz główny)
- `ostatnia_aktualizacja`: datetime
- `ilosc_lekarzy`: int unsigned
- `ilosc_pielegniarek`: int unsigned
- `ilosc_lozek`: int unsigned
- `ilosc_lozek_obserwacji`: int unsigned

Tabela ta przechowuje informacje o bieżącym stanie zasobów w SOR, takich jak liczba lekarzy, pielęgniarek, łóżek i łóżek
obserwacyjnych.

### Tabela: stan_kolejki

- `id`: int unsigned (Klucz główny)
- `data`: datetime
- `minuty_lekarz`: int
- `minuty_pielegniarka`: int

Tabela ta zawiera informacje o kolejkach do lekarza i pielęgniarki w danym dniu.

## 6. Usługi (Services)

### sor.js

#### getHourlyData(date)

Funkcja ta pobiera godzinowe dane o stanie zasobów dla wybranego dnia oraz dane z ostatniej godziny poprzedniego dnia.
Korzysta z zapytań SQL do tabel `stan_zasobow` i `stan_kolejki`, aby uzyskać potrzebne informacje.

#### addStanKolejki(stanKolejki)

Funkcja ta dodaje lub aktualizuje stan kolejki dla danego dnia w tabeli `stan_kolejki`. Używa zapytania SQL z
klauzulą `ON DUPLICATE KEY UPDATE`, aby zoptymalizować operację.

## 7. Middleware

### validation.js

Plik ten zawiera funkcje walidacyjne dla różnych endpointów, np. `validatePacjent` do walidacji danych pacjenta przed
dodaniem do bazy.

## 8. Obsługa błędów

W głównym pliku `index.js` zdefiniowany jest middleware do obsługi błędów:

```javascript
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Coś poszło nie tak!');
});
```

Wszystkie błędy wychwycone w aplikacji są logowane za pomocą modułu loggera, a następnie zwracana jest ogólna odpowiedź
z kodem 500 (Błąd serwera).

## 9. Logowanie

Projekt używa biblioteki Winston do logowania. Konfiguracja znajduje się w `utils/logger.js`. Logging jest
konfigurowalny za pomocą zmiennej środowiskowej `LOG_LEVEL`.

## 10. Bezpieczeństwo

- Używane są zmienne środowiskowe do przechowywania wrażliwych danych, takich jak dane do połączenia z bazą danych.
- Stosowana jest walidacja danych wejściowych za pomocą middleware, aby zapobiec atakom typu injection.
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

## 13. Diagramy sekwencyjne

Poniżej przedstawiono przykładowy diagram sekwencyjny połączenia z bazą danych:

```mermaid
sequenceDiagram
    participant Client
    participant Express
    participant Database

    Client->>Express: GET /api/sor/hourly-data?date=2023-06-15
    Express->>Database: getHourlyData(2023-06-15)
    Database->>Express: Dane godzinowe, dane z ostatniej godziny
    Express->>Client: Odpowiedź JSON

    Client->>Express: POST /api/sor/stan-kolejki
    Express->>Database: addStanKolejki(stanKolejki)
    Database->>Express: ID nowego rekordu
    Express->>Client: Potwierdzenie dodania
```

Ten diagram ilustruje sekwencję wydarzeń dla dwóch kluczowych endpointów: pobrania danych godzinowych oraz dodawania
stanu kolejki. Klient inicjuje żądanie, które jest obsługiwane przez warstwę Express, a ta z kolei korzysta z warstwy
usług (Services) do interakcji z bazą danych.

Oczywiście. Oto propozycje tych trzech dodatkowych sekcji do dokumentacji:

---

## 14. Przykłady użycia API

Poniżej przedstawiamy przykłady użycia głównych endpointów API za pomocą narzędzia cURL oraz JavaScript (z użyciem fetch).

### 14.1. Pobieranie stanu zasobów

#### cURL:

```bash
curl -X GET "http://localhost:8080/api/stan-zasobow?date=2023-06-15"
```

#### JavaScript (fetch):

```javascript
fetch('http://localhost:8080/api/stan-zasobow?date=2023-06-15')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 14.2. Dodawanie nowego pacjenta

#### cURL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"data_przyjecia": "2023-06-15 13:45:00", "typ": 1}' http://localhost:8080/api/pacjenci
```

#### JavaScript (fetch):

```javascript
fetch('http://localhost:8080/api/pacjenci', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data_przyjecia: '2023-06-15 13:45:00',
    typ: 1,
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 14.3. Pobieranie danych godzinowych

#### cURL:

```bash
curl -X GET "http://localhost:8080/api/hourly-data?date=2023-06-15"
```

#### JavaScript (fetch):

```javascript
fetch('http://localhost:8080/api/hourly-data?date=2023-06-15')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## 15. Opis procesu rozwoju (Development Workflow)

### 15.1. Konwencje nazewnictwa

- **Pliki**: Używaj snake_case, np. `stan_zasobow.js`.
- **Zmienne i funkcje**: Używaj camelCase, np. `getHourlyData`.
- **Klasy**: Używaj PascalCase, np. `StanZasobow`.
- **Stałe**: Używaj UPPER_CASE, np. `MAX_PACJENTOW`.

### 15.2. Proces code review

1. Stwórz nową gałąź dla swojej funkcjonalności: `git checkout -b feature/nowa-funkcjonalnosc`
2. Wprowadź zmiany i commituj regularnie.
3. Po zakończeniu pracy, wypchnij zmiany na zdalne repozytorium: `git push origin feature/nowa-funkcjonalnosc`
4. Utwórz Pull Request (PR) w systemie kontroli wersji (np. GitHub, GitLab).
5. Przypisz co najmniej jednego recenzenta do PR.
6. Recenzent przegląda kod i zostawia komentarze lub sugestie zmian.
7. Wprowadź niezbędne poprawki i odpowiedz na komentarze.
8. Po zatwierdzeniu przez recenzenta, PR może zostać scalony z główną gałęzią.

### 15.3. Tworzenie Pull Requestów

1. Upewnij się, że Twój kod jest zgodny z konwencjami projektu.
2. Napisz jasny i zwięzły opis PR, wyjaśniając wprowadzone zmiany.
3. Jeśli PR rozwiązuje konkretny problem, odnieś się do numeru issue.
4. Dodaj odpowiednie etykiety do PR (np. "feature", "bugfix", "documentation").
5. Jeśli PR wprowadza zmiany w API, zaktualizuj dokumentację.
6. Upewnij się, że wszystkie testy przechodzą pomyślnie.

## 16. Słownik terminów

- **SOR**: Szpitalny Oddział Ratunkowy
- **Triage**: System segregacji pacjentów według stopnia pilności udzielenia pomocy medycznej
- **Stan zasobów**: Aktualny stan dostępności personelu medycznego i łóżek w SOR
- **Typ pacjenta**: Klasyfikacja pacjenta określająca przewidywany czas i rodzaj potrzebnej opieki
- **Kolejka**: Lista pacjentów oczekujących na konsultację lekarską lub pielęgniarską
- **Endpoint**: Punkt końcowy API, adres URL do którego można wysłać żądanie
- **Middleware**: Oprogramowanie pośredniczące, które przetwarza żądania przed ich obsługą przez właściwy handler
- **ORM**: Object-Relational Mapping, technika mapowania obiektów na relacyjne bazy danych
- **JWT**: JSON Web Token, standard bezpiecznego przesyłania informacji między stronami jako obiekt JSON
- **CRUD**: Create, Read, Update, Delete - podstawowe operacje na danych

---

Te dodatkowe sekcje wzbogacą dokumentację o praktyczne przykłady użycia API, jasne wytyczne dotyczące procesu rozwoju projektu oraz słownik kluczowych terminów, co powinno znacznie ułatwić pracę z systemem zarówno nowym, jak i doświadczonym deweloperom.
