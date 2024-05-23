# Webová aplikace pro předpověď počasí
## Dokument Specifikace Požadavků
Vytvořil: Daniel Kohout

## Nasazení
https://weather-app-stin.onrender.com


## Obecný popis aplikace
Tato aplikace bude mezi hlavními funkcemi umožňovat hledání aktuálního počasí a historii počasí na vybraném místě v rámci Evropské Unie.
Počasí se bude zobrazovat textově i graficky. Mezi sekundární funkce bude patřit uložení oblíbeného místa a REST endpoint. Poté tu budou další funkce jako založení prémiového účtu včetně jeho zaplacení a přihlášení se k tomuto prémiovému účtu. 
Běžný uživatel bude mít možnost využívat pouze funkci hledání aktuálního počasí na vybraném místě v rámci EU.
Prémiový uživatel bude mít k dispozici všechny funkce.

## Zadání
1. Možnost zobrazit aktuální stav počasí, jak textově tak i graficky
2. Zobrazit stav počasí na aktuálním a vybraném místě v rámci EU
3. Umožnit placený přístup, kde bude možné ukládat oblíbená místa a pro ně získat předpověď.
    1. Je nutné míst možnost zadat platbu pro placený přístup
    2. Zobrazovat současně i historická data
    3. Nabízet možnost získat aktuální a historická data pomocí zavolání REST endpoint
4. Aplikace musí běžet na mobilním telefonu i PC
5. Aplikace musí běžet mimo localhost

## Rozsah projektu
1. Možnost zobrazist aktuální stav počasí, jak textově tak i graficky
   - Zahrnuto:
         - Zobrazení aktuálního stavu počasí ve formě textových informací (teplota, popis počasí)
         - Grafické zobrazení aktuálního stavu počasí
   - Vyloučeno:
         - Detailní meteorologické analýzy a predikce mimo základní údaje
2. Zobrazit stav počasí na aktuálním a vybraném místě v rámci EU
    - Zahrnuto:
       - Zobrazení výchozího města (Praha)
       - Možnost vybrat a zobrazit počasí pro libovolné město v rámci Evropské unie
3. Umožnit placený přístup, kde bude možné ukládat oblíbená místa a pro ně získat předpověď
    - Zahrnuto:
        - Registrace a autentizace uživatelů
        - Platba kartou při registraci (falešná)
        - Uložení a změna oblíbeného místa pro placené uživatele
        - Předpověď počasí pro oblíbené místo
        - Zobrazování historických dat pro placené uživatele
    - Vyloučeno:
        - Víceúrovňové předplatné (pokud není specifikováno jinak).
4. Zobrazení historických dat
    - Zahrnuto:
        - Přístup a zobrazení historických dat pro uživatele s placeným přístupem.
    - Vyloučeno:
        - Historická data delší než období 3 dnů (dnes, včera, předevčírem).

## Využité technologie
### Klientská část (frontend)
- Javascript
- HTML5
- CSS
### Serverová část (backend)
- Nodejs
- Framework Express
- .json file (úložiště)
### Využité API
- https://openweathermap.org
    - pro aktuální počasí
    - více requestů ve verzi zdarma/den
    - historie je pouze v placené verzi
- https://www.weatherapi.com
    - pro historii počasí
### Nasazení
- https://render.com

## Požadavky pro uživatele
- 4GB RAM
- Webový prohlížeč: s jádrem Chromium, doporučená verze 120.xxx a výše
- Internetové připojení

# Grafické uživatelské rozhraní (GUI)
Aplikace se bude skládat ze stránek:
 1. Home            /
    - zadání místa pro vyhledání aktuálního počasí
 2. Přihlášení      /login
    - zadání jména a hesla
 3. Registrace      /signup
    - zadání jména (username), hesla a platební info pro platbu
 4. Premium stránka /subscription
    - zadání místa pro vyhledání aktuálního počasí
    - pro vyhledávané místo zobrazit historická data
    - uložení vyhledávaného místa jako oblíbené
 5. API příklady    /api
    - 2 příklady pro REST endpoint (nyní a historical)

## Usecase diagram:
![image](https://github.com/DanKohout/Weather_app_stin/assets/100781092/aa9877d4-5af4-4536-8dc9-17cd3fd75f2e)

## Omezení aplikace
- platba probíhá při zakládání prémiového účtu
- omezení REST endpoint:
    - historie je max 6 dní dozadu

## Chybové stavy

Řešení chybových stavů:
Uživateli se buď objeví pop-up, nebo se napíše do uživatelského prostředí u dané hledané informace "unavailable".

## Ukládání dat:
Jelikož se jedná o jednodušší aplikaci, bude stačit místo databáze pouze soubor typu json.
- data o počasí se neukládají
- json
  - username (unikátní)
  - password
  - favorite_place (optional)
```
[
  {
    "username": "asdf",
    "password": "$2a$10$.G45JkV.PxNMfy5hyh0g6uU5N5jfHPTnrIaO70tx45YLEqQNIPAAi",
    "favorite_place": "benatky+nad+jizerou"
  }
...
```

## Případná místa na rozšíření
- přidání více zobrazovaných dat


### Časová náročnost
Odhaduji, že časová náročnost bude okolo 30 hodin práce.



