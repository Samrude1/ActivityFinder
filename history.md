# Sovelluksen Kehityshistoria ja Tehdyt Muutokset

Tämä tiedosto pitää kirjaa sovellukseen tehdyistä suurista muutoksista, jotta tekoälyagentit (ja kehittäjät) pysyvät kärryillä siitä, mitä on jo rakennettu.

## 22.06.2026: "Kesäsiivous" ja Backendin Kytkeminen

Tämän päivän session pääteemana oli siirtää sovellus pelkästä staattisesta UI-luonnoksesta (Mockup) toimivaksi ohjelmistoksi, joka keskustelee oikean backendin kanssa. Teimme suuren siivouksen ja poistimme paljon kovakoodattua "dummy-dataa".

### 1. Backend & API
- **Mock Yelp Service:** Rakensimme backendiin logiikan, joka osaa palauttaa uskottavaa testidataa (Mock Yelp Place), jos järjestelmässä käytetään `dummy_yelp_key_replace_me` -avainta. Tämä estää API-kulujen syntymisen kehitysvaiheessa.
- **Julkinen haku:** Korjasimme Express.js reitityksen bugin, jossa `authMiddleware` esti vahingossa kirjautumattomilta käyttäjiltä pääsyn hakurajapintaan. Nyt `/api/free/search` sallii julkiset haut vierailijoille.

### 2. Frontendin Pääkomponentit
- **HomePage.tsx:** Poistettiin vanha kovakoodattu data. Sivu hakee nyt oikeasti käyttäjän lokaation perusteella aktiviteetteja (mock-datana) API:sta.
- **SearchPage.tsx:** Kytkettiin hakusivu `freeAPI.searchActivities` -kutsuun. Lisättiin tyylikäs "Tyhjä tila" (Empty State) isolla hakukentällä, jos käyttäjä saapuu sivulle ilman hakusanaa.
- **ActivityDetail.tsx:** Poistettiin valtava määrä kovakoodattua UI:ta (keksityt surffaus-arvostelut, arvosanajakaumat, keksitty varauskalenteri). Tilalle tehtiin siistimpi, dynaaminen näkymä, jossa on mm. "View on Yelp" -painike oikealle sivustolle.
- **FavoritesPage.tsx:** Sivu siivottiin vanhasta koodista ja kytkettiin lukemaan suosikit puhtaasti selaimen `localStorage`:sta ja renderöimään ne `ActivityCard` -komponenteilla.
- **Header.tsx:** Yläkulman suurennuslasi-ikoniin lisättiin toiminnallisuus; se ohjaa nyt käyttäjän suoraan `/search` -sivulle. 

### 3. Koodin laatu
- **Linttaus:** Kaikki "Kesäsiivouksessa" syntyneet käyttämättömät muuttujat ja importit siivottiin pois. `npm run lint` menee nyt puhtaasti läpi.

### Seuraavalle AI-Agentille tiedoksi:
Käyttöliittymä on nyt sidottu toimivaan API:in, ja se käsittelee sujuvasti sekä tyhjät haut että mock-datan. Frontendin yläpalkin navigaatiolinkit (`Rewards`, `Discover`, `Forums`) ovat vielä visuaalisia "dummy"-linkkejä (`href="#"`). Projektissa on valmius siirtyä käyttämään oikeaa Yelp Fusion API -avainta backendin `.env` tiedostossa, kun testaaminen oikealla datalla tulee ajankohtaiseksi.
