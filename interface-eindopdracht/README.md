# Game Master Dashboard - INTERFACE2 Herkansing

Welkom bij het **Game Master Dashboard**! Dit is een interactieve webapplicatie gebouwd met React waarmee gebruikers hun gamecollectie, speeltijd en voortgang kunnen beheren. De applicatie is voorzien van een premium Cyberpunk/Dark Sci-Fi stijl, vloeiende GSAP-animaties en een interactieve 3D Three.js showcase.

---

## Technische Verantwoording

### 1. ES6 (Modern JavaScript)
In dit project worden moderne ES6-technieken intensief gebruikt om data te manipuleren en logica te stroomlijnen:
*   **Array Methods (`map`, `filter`, `reduce`)**:
    *   `map()` wordt gebruikt in `App.jsx` en `GameFilters.jsx` om dynamisch componenten (zoals `GameCard`) en filteropties te renderen op basis van de databron.
    *   `filter()` wordt toegepast voor de dynamische zoek- en filterfunctionaliteit (genre, platform, status).
    *   `reduce()` berekent de totale speeltijd van alle games in de bibliotheek voor de statistieken in de header.
*   **Arrow Functions**: Alle componenten, event handlers en array callbacks zijn geschreven met arrow functions.
*   **Destructuring**: Props in componenten en eigenschappen van de game-objecten worden direct uitgeladen middels destructuring (bijv. `const { titel, genre, platform, status } = game`).
*   **Spread Operator (`...`)**: Gebruikt bij het toevoegen van nieuwe games (bijv. `{ ...newGame, id: nextId }`) en om unieke genres/platforms te verzamelen via `[...new Set(games.map(...))]`.
*   **Imports & Exports**: Modulaire opbouw met ES6 `import` en `export` om code overzichtelijk en herbruikbaar te houden.

### 2. Styling met SCSS
De styling is modulair opgebouwd met Sass (SCSS) en bevindt zich in `src/styles/`:
*   **Variabelen (`_variables.scss`)**: Centraal beheerde design tokens voor het Cyberpunk kleurenpalet (neon roze, cyaan, paars, groen), lettertypen (Orbitron voor headers, Roboto voor body), schaalbare hoekradii (border-radius) en neon-schaduwen.
*   **Nesting**: HTML/componentstructuren zijn genest gestyled om CSS-herhaling te minimaliseren en de hiërarchie leesbaar te houden.
*   **Mixins (`_mixins.scss`)**: 
    *   `@mixin flex`: Voor snelle en configureerbare Flexbox-layouts.
    *   `@mixin neon-border` en `@mixin neon-text`: Voor de karakteristieke glowing effecten.
    *   `@mixin respond-to`: Voor responsive layout-breakpoints.
    *   `@mixin custom-scrollbar`: Een gecentraliseerde mixin voor futuristische scrollbars.
*   **Responsive Layout**: De interface maakt gebruik van CSS Grid en Flexbox in combinatie met media queries om een naadloze ervaring te bieden op zowel desktop, tablet als mobiele apparaten.

### 3. React-architectuur
De applicatie is gebouwd in React en is opgedeeld in functionele componenten:
*   **Componenten**:
    *   `App.jsx`: De centrale controller die de bibliotheekstaat beheert en data doorgeeft.
    *   `Header.jsx`: Toont de titel en real-time statistieken (totaal aantal games, aantal voltooide games en totale speeltijd).
    *   `GameFilters.jsx`: Bevat de zoekbalk, sorteeropties en filters.
    *   `GameCard.jsx`: De individuele gamekaartjes met controls om status aan te passen, favorieten te toggelen, speeltijd aan te passen en games te verwijderen.
    *   `AddGameModal.jsx`: Een formulier waarmee de gebruiker nieuwe games kan toevoegen aan de library.
    *   `ThreeShowcase.jsx`: De 3D showcase component.
    *   `AchievementAlert.jsx`: Een notificatie die getoond wordt bij het behalen van achievements.
*   **State & Props**:
    *   `useState` wordt gebruikt voor de game-lijst, filterselecties, modal-open status en actieve 3D-game.
    *   Props worden gebruikt om event-handlers en data door te geven van `App.jsx` naar subcomponenten.
*   **Hooks & Effects**:
    *   `useEffect`: Wordt gebruikt om wijzigingen in de bibliotheek op te slaan in `localStorage` (zodat data behouden blijft na een refresh), voor GSAP-animaties bij het laden, en om Three.js canvassen op te spannen.
    *   `useMemo`: Zorgt ervoor dat de zware filter- en sorteeroperaties alleen worden herbereken wanneer de gamedata of filterparameters daadwerkelijk veranderen.

### 4. Animatie met GSAP
GSAP (GreenSock Animation Platform) brengt de interface tot leven:
*   **Introductie-animatie**: Bij het laden van de pagina schuift de header van boven in en animeren de filterbalk en de 3D showcase soepel in beeld.
*   **Hover-effecten**: Game cards lichten op, schalen licht op en krijgen een intensere neon-gloed wanneer de muis eroverheen beweegt via GSAP-tweens.
*   **Modal overgangen**: De toevoeg-modal schaalt en veert soepel in beeld met een `back.out` easing, en animeert net zo soepel weer weg bij het sluiten.
*   **Achievement Toast**: Wanneer een game de status "Completed" krijgt, schuift er links onderin een "Achievement Unlocked!" toast in beeld met een bounce-effect (`back.out`), die na 3 seconden automatisch weer verdwijnt.

### 5. 3D met Three.js
In de rechterkolom (of onderaan op mobiel) bevindt zich de interactieve **3D Game Showcase**:
*   **Dynamische Modellen**: Afhankelijk van de geselecteerde game in de library, toont de Three.js canvas een ander passend 3D-object gebouwd uit 3D primitives:
    *   *Energy Sword* (bijv. Elden Ring, The Witcher 3): Een zwaard geconstrueerd uit cilinder-, box- en kegelgeometrieën met een fel gloeiend lemmet.
    *   *Portal Ring* (bijv. Portal 2): Een cyaan roterende torus (ring) omringd door omloopbanen van kleine gloeiende bollen.
    *   *Power Core* (bijv. Hades II, Hollow Knight): Een futuristische reactor met een pulserende (krimpen en groeien via een sinusgolf) binnenkern en een gekantelde buitenring.
    *   *Hologram Pyramide* (bijv. Cyberpunk 2077): Een zwevende draadmodel (wireframe) piramide op een donker metalen platform.
    *   *Sci-Fi Controller* (bijv. Minecraft, Doom Eternal, of zelfgemaakte games): Een gemodelleerde gamepad met grips, thumbsticks en actieknopjes.
*   **Glow & Emissive Materials**: Door gebruik te maken van `MeshStandardMaterial` met `emissive` en `emissiveIntensity` instellingen, lichten de 3D-objecten op in de unieke themakleur van de geselecteerde game. De lichtbronnen (PointLights) nemen tevens deze kleur over.
*   **Interactie (Drag to Rotate)**: Gebruikers kunnen het object met de muis verslepen (of met een touch-beweging op mobiel) om het vanuit alle hoeken te bekijken. Als de gebruiker stopt met slepen, pakt het object een rustige, automatische rotatie op.
*   **Resource Cleanup**: Bij het wisselen van games of het verlaten van de pagina worden de canvassen, geometrieën, materialen en renderers netjes opgeruimd uit het geheugen om memory leaks te voorkomen.

---

## Installatie & Uitvoering

Volg deze stappen om het project lokaal te starten:

1.  Navigeer naar de projectmap:
    ```bash
    cd interface-eindopdracht
    ```
2.  Installeer de benodigde pakketten:
    ```bash
    npm install
    ```
3.  Start de lokale ontwikkelserver:
    ```bash
    npm run dev
    ```
4.  Open de link in je browser (standaard `http://localhost:5173`).
