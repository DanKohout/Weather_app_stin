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
 5. API příklady    /api
    - 2 příklady pro REST endpoint (nyní a historical)

## Usecase diagram:
![image](https://github.com/DanKohout/Weather_app_stin/assets/100781092/aa9877d4-5af4-4536-8dc9-17cd3fd75f2e)

## Omezení aplikace
- platba probíhá při zakládání prémiového účtu
### REST endpoint:
- historie je max 6 dní dozadu

## Chybové stavy
- uživateli se buď objeví pop-up, nebo se napíše do uživatelského prostředí u dané informace "unavailable"

## Ukládání dat:
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

### Časová náročnost
Odhaduji, že časová náročnost bude okolo 30 hodin práce.



