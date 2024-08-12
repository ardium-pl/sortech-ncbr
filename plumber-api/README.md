# Plumber API w Dockerze

Ten projekt zawiera API stworzone przy użyciu pakietu Plumber w R, skonteneryzowane w Dockerze. API oferuje różne endpointy, w tym prognozowanie cen domów i liczby pacjentów.

## Struktura projektu

```
.
├── Dockerfile
├── .dockerignore
├── plumber.R
├── router.R
└── README.md
```

## Wymagania

- Docker

## Instalacja i uruchomienie

1. Sklonuj to repozytorium:
   ```
   git clone [URL_REPOZYTORIUM]
   cd [NAZWA_KATALOGU]
   ```

2. Zbuduj obraz Docker:
   ```
   docker build -t plumber-api .
   ```

3. Uruchom kontener:
   ```
   docker run -p 8080:8080 plumber-api
   ```

API będzie dostępne pod adresem `http://localhost:8080`.

## Endpointy API

### 1. Echo
- Metoda: GET
- Endpoint: `/echo`
- Parametry: `msg` (string)
- Przykład użycia:
  ```
  curl "http://localhost:8080/echo?msg=Hello"
  ```

### 2. Suma
- Metoda: POST/GET
- Endpoint: `/sum`
- Parametry: `a` (number), `b` (number)
- Przykład użycia:
  ```
  curl -X POST "http://localhost:8080/sum" -H "Content-Type: application/json" -d '{"a": 5, "b": 3}'
  ```

### 3. Prognozowanie cen domów
- Metoda: POST
- Endpoint: `/predict_house_price`
- Parametry: 
  - `train_set`: JSON z danymi treningowymi
  - `predictors`: JSON z danymi do prognozowania
- Przykład użycia:
  ```
  curl -X POST "http://localhost:8080/predict_house_price" -H "Content-Type: application/json" -d '{"train_set": {"price": [100000, 150000, 200000], "area": [50, 75, 100], "centre": [1, 0, 1]}, "predictors": {"area": [60], "centre": [1]}}'
  ```

### 4. Prognozowanie liczby pacjentów
- Metoda: POST
- Endpoint: `/predict_n`
- Parametry:
  - `train_set`: JSON z danymi treningowymi
  - `future_dates`: JSON z datami do prognozowania
- Przykład użycia:
  ```
  curl -X POST "http://localhost:8080/predict_n" -H "Content-Type: application/json" -d '{"train_set": {"Data": ["2022-01-01", "2022-01-02"], "n": [10, 15]}, "future_dates": {"Data": ["2022-02-01", "2022-02-02"]}}'
  ```

### 5. Wykres danych Iris
- Metoda: GET
- Endpoint: `/plot`
- Parametry: `spec` (string, opcjonalny)
- Przykład użycia:
  ```
  curl "http://localhost:8080/plot?spec=setosa" --output iris_plot.png
  ```

## Uwagi

- Upewnij się, że port 8080 jest wolny na Twoim komputerze przed uruchomieniem kontenera.
- W przypadku problemów, sprawdź logi Dockera dla szczegółowych informacji.

## Licencja

[Dodaj informacje o licencji]

## Kontakt

[Dodaj informacje kontaktowe]