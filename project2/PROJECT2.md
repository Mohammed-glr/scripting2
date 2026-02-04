Doel:
Ontwikkel een backend met Node.js en Express.js die de basis vormt voor het
besturen van een ruimtevaartuig. De backend moet interacties ondersteunen via
routes en formulieren.
Je gaat een eenvoudige backend bouwen waarmee astronauten een ruimtevoertuig
kunnen besturen. Het systeem moet gegevens over de status van het voertuig
kunnen rapporteren en acties kunnen uitvoeren op basis van de input van de
gebruiker.
Eisen:
Node.js en Express.js installatie:
Zorg ervoor dat Node.js en Express.js correct zijn geïnstalleerd en zonder -
configuratieproblemen werken.
Routes:
Definieer minimaal twee routes in je applicatie, status en action:
GET /status:
Retourneert een JSON-object met de huidige status van het ruimtevoertuig. Dit
object bevat minimaal:
• Batterijpercentage (bijvoorbeeld: 85%).
• Actieve sensoren (bijvoorbeeld: ["Temperatuur", "Camera"]).
• Gevonden grondstoffen (bijvoorbeeld: ["IJzererts", "Zilver"]).
POST /action:
Ontvangt gegevens van een formulier en voert een actie uit waarbij de status van het
ruimtevaartuig wordt aangepast, zoals:
• Een sensor in- of uitschakelen.
• Het ruimtevaartuig laten bewegen (bijvoorbeeld: vooruit, achteruit, draaien).
• Het ruimtevaartuig in slaapstand zetten
Formulier:
Bouw een formulier dat gebruikers kunnen invullen om een actie te versturen naar de
route /action.
Zorg dat het formulier minimaal de volgende velden bevat:
• Actie: Een mogelijkheid om het vaartuig te besturen (bijvoorbeeld: Beweeg
vooruit, draai naar links, Slaapstand). Dit kan bijvoorbeeld met een dropdown-menu
of met verschillende knoppen.
• Een mogelijkheid om minimaal 2 sensoren aan of uit te schakelen
(bijvoorbeeld door middel van een checkbox).