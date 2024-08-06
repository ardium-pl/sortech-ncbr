# sortech-ncbr
Research project created for NCBR. The aim of the project is to create a smart data solution for an emergency response hospital (SOR).

# Teraz mamy następujące endpointy:

+ **GET** `/api/stan-zasobow?date=YYYY-MM-DD` - zwraca stan zasobów dla danego dnia
+ **GET** `/api/pacjenci?date=YYYY-MM-DD` - zwraca pacjentów przyjętych danego dnia wraz z informacjami o typie pacjenta
+ **POST** `/api/stan-zasobow` - dodaje nowy rekord stanu zasobów
+ **POST** `/api/pacjenci` - dodaje nowego pacjenta
