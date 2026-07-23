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

## 4 · Résolution des items-frontière (D-006 — le ≈ devient enjeu de marqueur)

Chaque frontière tranchée contre une source **vérifiée**. Sous D-006, un item rangé à tort en C
perdrait sa marque à tort — donc chaque verdict porte son motif et sa source.

| Ligne | Verdict | Source vérifiée / motif |
|---|---|---|
| 485 | **A** | `CLAUDE.md:28-29` + `WEB-001B:43,79,166` — RLS deny-by-default, zéro `service_role`, lecture whitelistée. Opposable. |
| 731 | **A** | idem — séparation site/plateforme, le site ne lit pas la base. Opposable. |
| 385 | **A** | OCR-006 **P9** *verbatim* : « Status Is Derived and Never Persisted ». |
| 405 | **B** | grep vide dans OCR-115 et OCR-007 : la précédence n'est dans **aucun Record**, seulement RD-005. |
| 296 | **B** | RD-009 / RD-010 ; pas de formulation verbatim dans un Record. |
| 153 | **B** | RD-007. OCR-000 grave l'**acte** de promotion (Draft→Normative), mais **pas** le cadrage « publication indépendante de promotion » — c'est l'apport de RD-007. |
| 678 | **C** | grep « translation » vide dans les Records : descend de l'orphelin monolingue (579/669), lui-même sans source. |
| 607 | **C** | index `/records` : décision de session (Lot GEO 2), absente de toute décision verrouillée (grep `CLAUDE.md` vide). |
| 717 | **C** | redirection transitoire : notes MIG (non opposables) **et retirée**. Rien de vivant. |
| **813** | **INDÉCIDABLE** | « un concept n'existe que s'il est établi par le corpus » : domaine d'OCR-004 / OCR-006 P6, mais **aucun ancrage verbatim** et **aucune RD nette**. Reste indécidable — non poussé dans un seau pour faire tomber le compte. |

**Comptes FERMES après résolution** (total 47, exact) :

| Seau | Ferme | Δ vs approx. |
|---|---|---|
| **A — opposable** | **9** | 813 sort (→ indécidable) ; 485, 731, 385 fermes |
| **B — écho non opposable** | **8** | 678 sort (→ C) |
| **C — orphelin** | **29** | + 678 |
| **Indécidable** | **1** | 813 |

**Seau C ferme = 29.** (Un seul item reste indécidable ; il n'est compté dans aucun seau.)

## 5 · Dépendances — avant toute suppression

Orphelins du seau C **invoqués ailleurs comme décidés** (retirer leur marqueur les dégraderait en
silence) :

| Orphelin | Invoqué comme décidé par | Risque |
|---|---|---|
| **230 — empreinte** | grille de promotion : `DOSSIER-promotion-cycle-1.md`, `MESURES-frontiere-promotion-terminologie.md`, `DOSSIER-SESSION-ARCHITECTE.md` (§5), `REGLES-DECOUVERTES.md` | **fort** — critère de qualification ; le retirer casse la grille |
| **449 — bandeau Draft (verbatim)** | **code** : `components/geo/RecordPage.tsx` (rendu), `REGLES-DECOUVERTES.md` | **fort** — dépendance exécutable ; le texte est rendu tel quel |
| **607 — index `/records`** | `DETTES-ouvertes.md` (dette d'adressage) | moyen — adresse invoquée |

**Cas distinct — la permanence anglaise (579/669)** est invoquée par `DETTES-ouvertes.md` et
`DOSSIER-SESSION-ARCHITECTE.md`, mais **comme question OUVERTE**, jamais comme décidée. Retirer sa
marque **aligne** ces documents au lieu de les dégrader. *(Balayage non exhaustif des 29 : ces
dépendances sont établies, d'autres orphelins peuvent en porter ; le relevé complet fait partie du
mandat de suppression, pas de celui-ci.)*

## 6 · Seuil de divergence — constat avant édition

Retirer **≈ 29 marqueurs sur 47** (62 %) touche **toutes les sections** : ce n'est pas un chiffre
isolé, c'est la **couche de qualification** du document qui change. Deux conditions du seuil gravé
sont réunies : *une partie est restructurée* (le régime de marquage), et — via D-006 — *un principe
architectural est normalisé* (le régime `[GRAVÉ]` lui-même). **Le seuil est franchi.**

**Conséquence, constat (non décision) :** c'est une **réédition**, pas 29 corrections. Le régime
`[GRAVÉ]` se traite **en une fois** — résolution A/B/C + préservation des dépendances (§5) intégrées
à l'édition — et la réédition recalcule au passage les parties `[DÉRIVABLE]` si elles ont bougé.
Vingt-neuf retraits ponctuels rejoueraient la mécanique du 41 : une suite de gestes locaux là où
une seule décision de régime est en jeu.

## 7 · Relevé des dépendances sur les 29 orphelins (prérequis de la réédition)

Balayage `docs/** components/** lib/** app/** CLAUDE.md` (ARCHITECTURE-V3 et ce fichier exclus).
Chaque invocation classée **DÉCIDÉ** (le document/code s'en sert comme d'un acquis) ou **OUVERT**
(il la traite comme question non tranchée — la retirer aligne au lieu de dégrader).

### 7a · Classe la plus dure — RENDUE/EMBARQUÉE par du code (visible en production)

| Orphelin | Code | Nature | Statut |
|---|---|---|---|
| **449 bandeau Draft** | `components/geo/RecordPage.tsx` | **verbatim rendu** (33 pages) | DÉCIDÉ → **dette séparée** (hors lot) |
| **300 « Derived metadata »** | `lib/registry/recordPage.ts:118` | **verbatim rendu** | DÉCIDÉ → **dette séparée** (hors lot) |
| **607 index `/records`** | `lib/routing/routeKind.ts:51` + 4 CTA | comportement embarqué (routing) | DÉCIDÉ |
| **717 redirect de locale** | `lib/seo/archetype.ts:8-14` | comportement embarqué (redirect vivant — **PAS** le 301 wtf retiré) | DÉCIDÉ |
| **571 pilier interprète / Record restitue** | `lib/seo/pillars.ts:65` | commentaire + ordre de chaîne | DÉCIDÉ |
| **661 lacune tracée (`_gaps`)** | ~10 fichiers `lib/`, `components/` | règle embarquée | DÉCIDÉ |
| **470 jamais d'insertion HTML** | `RecordPage.tsx` (aucun `dangerouslySetInnerHTML`) | règle embarquée | DÉCIDÉ *(non captée par phrase — comportement)* |

### 7b · Documents et mandats

| Orphelin | Invoqué par | Statut |
|---|---|---|
| **230 empreinte = contenu canonique** | grille : `DOSSIER-promotion-cycle-1.md:178/181/274`, `MESURES…:77`, `DOSSIER-SESSION…:207`, `REGLES-DECOUVERTES.md:277` | **OUVERT** — le dossier PARTIE II flague sa signification comme *non établie* ; la retirer aligne |
| **276 · 284 procédure de promotion** | `DOSSIER-promotion-cycle-1.md:117 / 5` | DÉCIDÉ |
| **298 métadonnées éditoriales** | mandat `WEB-003-LOT-GEO-2-instruction-4-points.md:18` | DÉCIDÉ |
| **684 vocabulaire canonique préservé** | mandat `WEB-002-fondations-mandat.md:5` | DÉCIDÉ |
| **579 · 669 permanence anglaise** | `DETTES-ouvertes.md`, `DOSSIER-SESSION…` *(paraphrase, hors phrase)* | **OUVERT** — traitée comme question ; la retirer aligne |

### 7c · Sans dépendance trouvée (14)

11, 31, 69, 202, 261, 435, 678, 706, 744, 774, 794, 819, 863, 869 — aucune invocation captée.

**Réserve de méthode, dite : le balayage par phrase a des FAUX NÉGATIFS connus.** Il a raté la
permanence (invoquée en paraphrase) et le `no-HTML` (embarqué comme comportement, pas comme phrase) —
les deux rattrapés à la main. Les 14 « sans dépendance » sont donc **« sans dépendance VERBATIM
trouvée »**, non « sans dépendance prouvée ». La vérification par-orphelin exhaustive (paraphrase +
comportement) fait partie de la réédition, sur cette base — je ne prétends pas au « aucun écart ».

## 8 · Indécidables — marqueur conservé (D-006)

**L813** (« un concept n'existe que s'il est établi par le corpus ») : **INDÉCIDABLE**, domaine
d'OCR-004 / OCR-006 P6 sans ancrage verbatim ni RD. Sous D-006 : **marqueur conservé + drapeau
« statut de traçabilité non établi »**. Un indécidable ne se retire pas sur présomption.

**Vérification — aucun autre item rangé par défaut.** Les 9 de A et 8 de B portent chacun une
source vérifiée (§4) ; les 29 de C sont soit sans source trouvée, soit vérifiés orphelins (permanence,
empreinte). **L813 est le seul pur indécidable.** Réserve honnête : les 3 items encore marqués `?`
au §2 (405 tranché B, 485/731 tranchés A) ont été **résolus**, pas rangés par défaut ; si l'arbitrage
conteste un verdict de §4, il redevient indécidable — il ne bascule pas en retrait silencieux.

## 9 · Vérification par orphelin AVANT réédition (point 6 du cadrage) — MOTIFS QUI NE TIENNENT PAS

La vérification par-orphelin (non par phrase) a révélé cinq dispositions à corriger. Le total
reste 47, mais l'ensemble à retirer change — je m'arrête avant tout retrait, comme prévu.

| Item | Motif d'origine | Ce que la vérification établit | Nouvelle disposition |
|---|---|---|---|
| **69** | orphelin retirable | c'est la **LÉGENDE** (`\| [GRAVÉ] \| décision normative rendue, opposable \|`) — la **définition** du marqueur, pas une affirmation | **hors retrait — D-006 la MET À JOUR** |
| **11** | orphelin | le **RÉGIME** lui-même (« projection de référence, non normative ») — décision de régime rendue, amendée par D-006 ce lot | **indécidable / question de portée** |
| **31** | orphelin | le **seuil de réédition** — règle de régime rendue | **indécidable / question de portée** |
| **863** | sans dépendance | cité verbatim comme règle fondatrice, `REGLES-DECOUVERTES.md:27` | **DÉCIDÉ → retrait + candidate** |
| **869** | sans dépendance | énoncé + pratiqué, `DETTES-ouvertes.md:7,92,111` | **DÉCIDÉ → retrait + candidate** |

**Compte corrigé (somme = 47, inchangée) :** A 9 · B 8 · **C retirable 24** (dont **11 retrait+candidate**
[607,717,571,661,470,276,284,298,684,**863,869**] et **13 retrait simple**) · dette hors-lot 2
(449,300) · **indécidable 3** (813,**11,31**) · **légende 1** (69). → 9+8+(24+2)+3+1 = **47**.

**QUESTION DE PORTÉE — bloquante, D-006 ne la tranche pas.** D-006 dit : `[GRAVÉ]` = source normative
EXTERNE. Mais la **légende** (69) et le **régime** (11, 31) sont la couche **méta** du document — sa
propre définition du marqueur et ses règles d'édition. Les traiter comme des orphelins retirables
stripperait le document de sa constitution, et ferait perdre sa marque à la règle qui *définit* la
marque. Portée à trancher : **D-006 s'applique-t-il aux marqueurs méta (légende, régime), ou seulement
aux affirmations substantielles ?** Je ne l'improvise pas.
