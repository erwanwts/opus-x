`docs/registry/CARTE-CONFORMITE-OCR-006.md` · *(hash d'application : voir commit de versement)*

# Carte des angles morts — 10 principes d'OCR-006

> **Date de mesure : 2026-07-24.** Ce document est une **MESURE**, pas un jugement de conformité.
> Il relève, principe par principe, **ce qu'un test / une garde / une mesure atteste** et **si la
> portée du principe est claire** — un principe de portée ambiguë ne *peut pas* être attesté, c'est un
> angle mort d'un autre type. Il ne prononce **aucune** conformité ni non-conformité : il dit ce qui
> est tenu et ce qui ne l'est pas, à cette date.
>
> **Erratum du 2026-07-24 (action 4 du même mandat, postérieure à la mesure) :** la ligne **P8** est
> **corrigée**. Elle affirmait « quelles sont les trois couches ? non identifiées explicitement ». C'est
> **faux** : OCR-006 les **nomme** — « *Documentary versioning, normative versioning and representation
> versioning* » (ligne 216). P8 n'est donc **pas** inatestable par construction ; il est **attestable en
> principe, non attesté**, et ce qui manque est la **cartographie** des trois couches nommées vers les
> champs de version concrets du dépôt. Le corps ci-dessous est laissé **tel quel** (mesure non retouchée) ;
> cette correction vaut pour la ligne P8.

Deux colonnes de risque : **attesté** (test/garde/mesure) et **portée** (un principe de portée
ambiguë ne *peut pas* être attesté — c'est un angle mort d'un autre type). Grounding : OCR-006 verbatim
+ inventaire des tests réels.

| Principe | Attesté ? | Par quoi | Portée |
|---|---|---|---|
| **P1** — Définition logique vs représentation canonique | **Partiel** | `registry-concept-precedence.test.ts` (Concept précède Record, RD-005) touche « une définition = un objet » ; **rien** ne garde « deux id ≠ deux définitions » | **Claire** (Concept = def logique, Record = représentation) |
| **P2** — Faits immuables vs mécanismes de lecture | **Oui (protocole)** | `wsp-fact-store` : *append-only par construction*, UPDATE/DELETE échouent **même en `service_role`** ; `rls-policies` : lecture sans écriture | ⚠️ **Ambiguë (documentaire)** — les Records `.md` sont modifiés (20 juil.) ; sont-ils des « published facts » ? Même frontière que P5/P9 |
| **P3** — Identité vs adresse de découverte | **Partiel** | 404 non-énumérant (privé indistinct d'inexistant) ; sitemap = adresses énumérables. **Rien** sur « changer l'adresse ne change pas l'identité » | **Claire** |
| **P4** — La résolution d'identité appartient à la lecture | **Partiel** | `emission-idempotence` (opus_id stable, jamais régénéré) ; RD-001 résolveur (`ctaHref`/`entityHref`). **Rien** n'atteste « la résolution n'écrit jamais » | **Claire** |
| **P5** — Réidentification par addition seule | **Non** | *Aucun* test n'interdit de modifier une représentation ; `manifest.attestation` **détecte** un checksum changé mais ne l'**interdit** pas | ⚠️ **Ambiguë** (Statement générale vs Consequences réidentification-bornées) — **double angle mort** |
| **P6** — Seules les relations référençables depuis des faits immuables sont publiées | **Partiel** | `registryEntities.test` (`emit_edge`/`flip_edge`) ; le graphe émet des arêtes depuis la **classification** | ⚠️ **Ambiguë** — dans le registre, quelles « immutable facts » gouvernent les arêtes ? Le graphe dérive d'une classification, pas d'un fact store |
| **P7** — La réidentification préserve les propriétés normatives | **Non** (vacant) | Aucune réidentification n'a eu lieu → non violé faute d'occasion | **Ambiguë par héritage de P5** |
| **P8** — Les trois couches de versioning sont indépendantes | **Non** | Aucun test | ⚠️ **Ambiguë** — **quelles** sont les trois couches dans ce dépôt ? Non identifiées explicitement → **inatestable en l'état** |
| **P9** — Statut dérivé, jamais persisté | **Non (protocole)** | Résolveur **inexistant** ; le statut est **actuellement persisté** (le champ). D-011 a mis le champ **documentaire hors P9** | **Clarifiée par D-011** — mais la **précision dans OCR-006 est en attente** (amendement Phase 3) |
| **P10** — Décisions normalisées **dans un Record** avant clôture | **Non** | **Les 13 décisions (D-001…D-013) vivent dans `DECISIONS-LOG.md`, un document de travail — PAS un Record du corpus OCR.** Aucun test ne garde « toute décision rendue est dans un Record avant clôture » | **Claire** |

## Les prises fortes de la carte

1. **P10 est le méta-principe, et c'est le moins tenu.** Tout le corpus décisionnel est **hors Record**. Le dispositif DECISIONS-LOG **rend visible** la dette (proposition (6)) mais **ne satisfait pas P10** — il n'est pas un Record. La clôture de la Phase 1 est donc conditionnée à une normalisation qui n'existe pas encore.
2. **Trois principes partagent la même frontière non tranchée** (P2, P5, P9) : *un Record `.md` est-il une représentation protocole, ou un artefact documentaire ?* D-011 l'a tranché **pour P9 seulement**. P2 et P5 héritent de l'ambiguïté.
3. **Deux principes sont inatestables parce que leur portée est floue, pas parce qu'un test manque** (P5 interne, P8 « quelles trois couches ? »). C'est l'angle mort du second type que vous nommiez : on ne peut pas écrire le test tant que la portée n'est pas dite.
4. **Le fact store protocole (P2) est le mieux attesté du corpus** — append-only prouvé jusqu'au `service_role`. La solidité est réelle, mais elle couvre le **protocole**, pas le **registre documentaire**.
