# MATIÈRE — formulaire « régime des [GRAVÉ] »

**Objet.** Matière brute pour un formulaire à venir (non rédigé ici). Question de l'Architecte :
un document **non normatif** porte **47 `[GRAVÉ]`** ; combien renvoient à une source, combien
sont **traçables** à une source **opposable** ailleurs, combien sont **orphelins** (jamais
rendus). *Le dernier compte dit l'ampleur : un `[GRAVÉ]` traçable se répare — un orphelin est une
décision jamais rendue.* Aucune modification du document. Mesuré sur HEAD `61ba23a`.

**Réserve de méthode.** Le compte « sourcé par un jeton dans le bloc » est **instable** (3 à 6
selon la fenêtre de lecture) — je ne le retiens pas. Je classe par **traçabilité de l'affirmation**
(existe-t-elle ailleurs, et dans quel régime), plus robuste. Les cas d'ancrage nets sont vérifiés ;
les cas limites sont **marqués `?`** et relèvent de l'arbitrage.

## 1 · Les 47 par NATURE de ce qu'ils affirment

| Nature | Compte | Exemples (ligne) |
|---|---|---|
| **Règle de protocole** | 14 | identité≠adresse (611), précédence Concept (405), arêtes depuis faits (403), normaliser avant clôture (843), corpus monolingue (669) |
| **Décision produit / architecture** | 15 | index à `/records` (607), bandeau Draft (449), redirection transitoire (717), deux cycles (706), séparation site/plateforme (731) |
| **Propriété technique** | 11 | empreinte=contenu canonique (230), invariant de projection (323), pas d'insertion HTML (470), métadonnées dérivées du corpus (296) |
| **Méta (document / registre / dette)** | 7 | régime du doc (11), seuil de réédition (31), légende `[GRAVÉ]` (69), registre 2 statuts (836), dette jamais supprimée (869) |

## 2 · Régime de traçabilité — trois seaux

**Seau A — traçable à une source OPPOSABLE** (Record, OCR-006, décision verrouillée, WEB-001B).
Réparable : il suffit d'ajouter le renvoi. **≈ 10.**

| Ligne | Affirmation | Source opposable |
|---|---|---|
| 95 | une seule règle gouverne (def logique vs représentation) | OCR-006 **P1** |
| 272 | promotion = qualification, pas un axe de version | OCR-006 **P8** |
| 385 | graphe = projection fidèle, statut dérivé jamais persistant | OCR-006 **P9** |
| 403 | arêtes exclusivement depuis la section Relations | OCR-006 **P6** |
| 611 | une identité n'est pas une adresse de découverte | OCR-006 **P3** |
| 813 | un concept n'existe que s'il est établi par le corpus | OCR-006 **P6** / OCR-004 |
| 843 | aucun principe normatif issu d'une seule conversation | OCR-006 **P10** |
| 719 | une langue non générée ne publie pas de contenu partiel | `CLAUDE.md:55` · WEB-001B §10.2 |
| 485 `?` | familles en lecture explorables ; écriture/privé interdits | invariants WEB-001A / `CLAUDE.md` (RLS) |
| 731 `?` | site et plateforme distincts ; le site ne lit pas la base | invariants WEB-001A / `CLAUDE.md` |

**Seau B — écho seulement dans un locus NON opposable** (registre des règles découvertes, ou ce
document lui-même). Appliqué, jamais normalisé dans un Record. **≈ 9.**

| Ligne | Affirmation | Écho non opposable |
|---|---|---|
| 153 | publication vs promotion indépendantes | RD-007 |
| 296 | métadonnées dérivées exclusivement du corpus | RD-009 / RD-010 |
| 321 / 323 | contenu = texte canonique · invariant de caractères | invariant de projection (test, non-Record) |
| 405 `?` | précédence du Concept (verbatim EN) | RD-005 (amendement OCR-115, non gravé comme règle) |
| 425 | page de Registry = projection, jamais normative | RD-009 |
| 836 | registre : deux statuts | RD-002 |
| 966 | une décision, plusieurs projections | RD-011 |
| 678 `?` | une traduction ne crée jamais une source | écho du monolinguisme (non gravé) |

**CONSTAT — le seau B et la dette de normalisation sont LE MÊME problème, aux deux tiers.**
Correspondance mesurée, une par une :

| Item du seau B | RD identifiée |
|---|---|
| 153 | **RD-007** (cycle de publication) |
| 296 | **RD-009** + **RD-010** (projection / découplage) |
| 405 | **RD-005** (précédence du Concept) |
| 425 | **RD-009** (une projection n'établit rien) |
| 836 | **RD-002** (distinction découverte/normalisée) |
| 966 | **RD-011** (plusieurs projections, une décision) |
| **321 / 323** | **aucune RD** — écho de l'**invariant de projection**, couvert par un *test* (`markdown.invariant.test`), ni Record ni RD |
| **678** | **aucune RD** — écho du monolinguisme, lui-même orphelin (seau C) |

**Six des neuf** items du seau B correspondent à des RD identifiées (**RD-002, RD-005, RD-007,
RD-009, RD-010, RD-011** — six règles distinctes). Or les onze RD sont **toutes au statut
« découverte », zéro normalisée**, et le **principe 10** (OCR-006, seau A) exige la normalisation
avant clôture de chantier. Donc **ces six ne sont pas six décisions nouvelles : c'est la dette de
normalisation déjà connue**, vue depuis le document. La normaliser (graver les RD dans des Records)
résorbe six des neuf. **Trois résiduels** (321, 323, 678) n'ont pas de RD : deux renvoient à un
**test** (mieux qu'un Record pour un invariant — c'est exécutable), un renvoie à un orphelin.

**Seau C — ORPHELIN, nulle part ailleurs** (ni opposable, ni registre). Décision jamais rendue.
**≈ 28.** Inclut les marques signalées par l'Architecte et par les mesures :

- **579 · 669 — permanence anglaise** (« en anglais et le resteront » / « corpus monolingue »).
  **Vérifié : aucun Record ne la grave.** C'est *la cause mesurée de la qualification retirée* —
  l'un des `[GRAVÉ]` orphelins que l'Architecte a nommé.
- **230 — l'empreinte représente le contenu canonique.** Déjà établi : *aucune source normative*
  ne le dit (dossier promotion, PARTIE II).
- **449 — bandeau Draft verbatim** · **202 — on n'attribue pas un id avant d'observer l'espace** ·
  **607 — index à `/records`** · les décisions produit de traduction (**684, 696, 706, 717**) ·
  procédure de promotion (**276, 284**) · exposition des dettes (**819**) · méta du document
  (**11, 31, 69**) · registre/dette (**863, 869**) · propriétés techniques d'implémentation
  (**298, 300, 470, 571, 661, 744, 774**) · **435, 261, 794**.

## 3 · Le compte qui dit l'ampleur

| Seau | Compte | Exactitude | Signification |
|---|---|---|---|
| **Total `[GRAVÉ]`** | **47** | **EXACT** — `grep -c`, mesuré | — |
| **A — opposable** | **≈ 10** | **APPROXIMATIF** | 8 vérifiés (OCR-006 P1/P3/P6/P8/P9/P10, `CLAUDE.md:55`) + **2 limites** (485, 731, marqués `?`) |
| **B — écho non opposable** | **≈ 9** | **APPROXIMATIF** | 6 mappés à des RD (vérifiés) + **3 hors-RD** (321, 323 → test ; 678 → orphelin) ; 405 limite (`?`) |
| **C — orphelin** | **≈ 28** | **APPROXIMATIF** | absorbe le résidu — c'est `47 − A − B`, donc il porte toute l'incertitude des ~10 items-frontière ; MAIS ses orphelins **nommés** (permanence 579/669, empreinte 230) sont **vérifiés exacts** |

**Le total est exact ; les trois seaux sont approximatifs.** Le `≈` de chaque seau **doit
survivre au formulaire** — un compte approximatif qui perd son `≈` devient un fait (la mécanique
du 41 : un chiffre dérivé, jamais mesuré, pris pour mesuré). Ce qui est **exact et opposable
séparément**, à ne pas diluer dans l'approximation : le **total 47**, les **8 ancrages A
vérifiés**, les **6 items B mappés à des RD**, et les **2 orphelins nommés** (permanence,
empreinte). Le reste — ~10 items-frontière (`?`) — est à trancher, et le seau C porte
mécaniquement leur incertitude.

**≈ 28 des 47 `[GRAVÉ]` n'existent nulle part ailleurs** — approximatif, mais l'ordre de grandeur
tient : même en déplaçant les ~10 limites, le seau C reste la majorité. Dans un document qui se
déclare non normatif, ce sont ~28 décisions marquées « gravé » qu'aucune source opposable n'a
rendues. C'est l'ampleur.
