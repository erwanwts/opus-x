# REGISTRE DES RÈGLES DÉCOUVERTES

> **NON NORMATIF.** Ce registre n'appartient pas au corpus. Aucune de ses entrées n'est
> opposable, aucune ne peut être citée comme norme. Il conserve des règles **reconnues
> valides mais non encore normalisées**, pour qu'elles ne se perdent pas entre le moment
> où un chantier les découvre et celui où un Record les publie.
>
> **Onze entrées numérotées, toutes au statut « découverte », aucune normalisée — plus
> DEUX PROPOSITIONS sans numéro, en attente d'attribution — (1) un instrument non testé
> ne mesure rien · (2) un artefact jamais exercé ne prouve rien** :
> RD-001 (résolveur canonique) · RD-002 (distinction découverte / normalisée) ·
> RD-003 (la locale d'une référence, lacune de RD-001) · RD-004 (la coordonnée scellée
> dans le condensat) · RD-005 (précédence du Concept sur le Record) · RD-006 (une source
> plausible n'est pas une source vérifiée) · RD-007 (cycle de publication normative) ·
> RD-008 (le code révèle, la gouvernance décide) · RD-009 (une projection n'établit rien) ·
> RD-010 (découplage constat / décision / projection) · RD-011 (plusieurs
> projections spécialisées, une seule décision).
>
> Ce registre tient lieu d'**Architectural Decisions Backlog** — voir la section
> « Correspondance » pour la réconciliation des deux décomptes.

**Pourquoi ce registre existe.** Une règle identifiée en cours de chantier ne peut pas
être glissée dans un Record en attente de relecture :

> « Un Record en attente de relecture ne doit pas être enrichi au fil des découvertes du
> chantier. Sinon, la validation devient une cible mouvante. »

Il fallait donc un endroit qui ne soit ni le corpus, ni l'oubli. C'est celui-ci.

---

## Distinction gravée

| Statut | Définition | Portée |
|---|---|---|
| **RÈGLE DÉCOUVERTE** | identifiée pendant un chantier, non encore normalisée | reconnue valide, **peut guider les développements**, **ne fait pas partie du corpus** |
| **RÈGLE NORMALISÉE** | publiée dans un Record identifié | **opposable**, appartient au protocole |

Une règle découverte **peut être appliquée dans le code** — c'est même sa fonction : elle
guide les développements. Elle ne devient **citable comme norme** qu'une fois publiée dans
un Record identifié. Appliquer n'est pas normaliser.

**Cycle de vie d'une entrée** : `découverte` → (cycle de normalisation) → publiée dans un
Record → l'entrée est **close ici**, avec renvoi vers le Record qui l'établit. Une entrée
n'est jamais supprimée : elle est close.

---

## RD-001 — Résolveur canonique des références internes

**Formulation verbatim**

> « Toute référence interne à un artefact est soumise au résolveur canonique. Si
> l'artefact n'existe pas, la référence n'est pas activée et l'absence est signalée. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | WEB-003 — archétypes éditoriaux Phase A (Knowledge Graph, Developers, Cross-cutting Questions) |
| **Statut** | **découverte** |
| **Normalisée dans** | — (première entrée du prochain cycle de normalisation) |

**Ce qu'elle couvre**, tel qu'énoncé : liens du corps de texte, CTA, cartes de navigation,
renvois « See also », liens du dictionnaire futur, liens générés. Le comportement **n'est
plus attaché à un composant d'interface** mais à la notion de **référence interne**.

**Circonstance de la découverte.** Les trois archétypes citent six destinations, dont trois
sans page existante. Le résolveur (`entityHref`, `pillarHrefBySlug`) couvrait déjà les
liens d'entités et les Reading Paths, mais **pas les CTA** : `GeoPage` recopiait la
destination telle quelle dans son `href`. Inoffensif tant que `CTA_ENABLED` vaut `false`
— le libellé est rendu inerte, sans `href` — mais tout bascule en 404 vivants le jour où
le flag passe à `true`. La règle a été formulée en généralisant ce constat : le défaut
n'était pas dans le composant, il était dans le fait qu'une **référence interne** pouvait
exister sans être soumise au résolveur.

**Application dans le code (autorisée, non normative).**
`ctaHref` (`lib/seo/pillars.ts`) applique la règle aux CTA ; `lib/content/archetype.ts`
l'applique aux archétypes et trace chaque absence dans `_gaps` ; `ArchetypePage` et
`GeoPage` n'émettent un lien que si `enabled && href`.

**Écarts connus, non corrigés** — voir la section suivante.

---

## RD-002 — Distinction règle découverte / règle normalisée

**Formulation verbatim**

> « **RÈGLE DÉCOUVERTE** — identifiée pendant un chantier, non encore normalisée. Reconnue
> valide, peut guider les développements, ne fait pas partie du corpus.
> **RÈGLE NORMALISÉE** — publiée dans un Record identifié. Opposable, appartient au
> protocole. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | WEB-003 — arbitrage sur le rattachement de RD-001 à OCR-006 |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

Cette distinction est elle-même une **décision de gouvernance non normalisée** : elle
relève donc du statut qu'elle définit. Elle fonde ce registre sans en faire une source
normative — ce qui serait contradictoire.

---

## RD-003 — La règle du résolveur ne dit rien de la LOCALE d'une référence

**Formulation**

> RD-001 soumet toute référence interne au résolveur canonique, mais ne dit rien de la
> **locale** dans laquelle cette référence doit être résolue. Une référence peut donc
> être canoniquement résolue et néanmoins pointer vers une locale figée.

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | WEB-003 — audit des producteurs de références internes (constat É-2) |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**C'est une lacune de la règle, pas une violation.** Le fil d'ariane de `GeoPage` et
d'`ArchetypePage` écrit `<Link href="/en">Opus X</Link>` : la Homepage `/en` existe
toujours, ce n'est donc **pas un lien mort** et RD-001 n'est pas enfreinte. Mais la locale
est **figée** — depuis une page rendue dans une autre locale, le fil d'ariane ramène en
anglais.

**Non corrigé, délibérément** : corriger toucherait au **comportement de navigation**, pas
à la résolution de références. L'arbitrage revient à l'architecte au prochain cycle.

---

## RD-004 — La coordonnée est scellée dans le condensat

**Formulation verbatim (architecte)**

> « La coordonnée est scellée dans le condensat. »

| | |
|---|---|
| **Date** | 2026-07-18 |
| **Chantier d'origine** | WEB-003 LOT B — réidentification canonique de `framework:wtr` |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**Circonstance.** La migration `wtf → wtr` devait renommer la coordonnée portée par les
Evidence. La mesure a établi qu'elle en était **structurellement incapable** :
`lib/wsp/evidenceCovered.ts` copie `framework.id` et `demonstrates.skill_id` **littéralement
dans le préimage** soumis à la canonicalisation JCS puis au sha256. Réécrire une coordonnée
invaliderait le condensat de chaque fait qui la porte.

**Conséquence tirée à l'époque** : la coordonnée d'un fait publié **ne peut jamais être
réécrite** ; la résolution doit donc avoir lieu **à la lecture**, jamais dans la donnée.
C'est ce constat qui a fondé la réidentification par pure addition (`reidentified_as`,
OCR-007 PRD-306) et le statut d'identité **dérivé, jamais stocké**.

**Appliquée dans le code** : `lib/api/frameworkDiscovery.ts` (`deriveIdentity`) — les
79 Evidence conservent `wtf:212` à jamais, et la représentation antérieure reste publiée.

---

## RD-005 — Précédence du Concept sur le Record lors de la résolution

**Formulation verbatim (architecte)**

> « Within a Relations section, if a target identifier matches both a Record title and a
> declared Concept, concept resolution SHALL take precedence. Record resolution SHALL only
> occur when no declared Concept matches the identifier. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | WEB-003 — amendement OCR-115 v1.1.0 (`reidentified_as`) |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

L'architecte a explicitement refusé de la présenter comme une capacité nouvelle du
générateur : *« Je la présenterais comme la formalisation d'une règle de résolution qui
était implicitement attendue par l'architecture. »*

**Impact mesuré avant application** : à liste de concepts inchangée, **aucune arête ne
bascule** — titres de Record et concepts déclarés étaient disjoints. La règle et la
déclaration du concept sont **conjointes** : ni l'une ni l'autre ne produit d'effet seule.

**Appliquée dans le code** : `scripts/registry/node-ref.mjs`, étape `(c·bis)` ; couverte par
`tests/unit/registry-concept-precedence.test.ts` (8 tests).

**Portée expressément bornée** : la règle ne vise que la résolution **par titre**. Les
raccourcis de `name_aliases` relèvent d'un autre mécanisme — les 2 `alias_self_loop` connus
ne sont **pas** corrigés par elle, ce qui a été vérifié par la mesure.

---

## RD-006 — Une source plausible n'est pas une source vérifiée

**Formulation verbatim (architecte)**

> « Une source plausible n'est pas une source vérifiée. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | WEB-003 — audit terminologique ; blocage du dictionnaire |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**Circonstance.** Les 46 définitions rédigées avant l'audit renseignaient toutes le champ
*Established By* — par des familles inventées (*Foundation Records*, *Architecture
Records*, *Governance Records*…) sans aucun identifiant réel du corpus. Là où le constat
établissait que **12 termes sur 47** ont une source citable, ces 46 en citaient 46.

`OCR-006` était le **seul identifiant réel** cité, six fois — et il n'établit aucun de ces
termes : il n'a pas de section `## Terminology`, et il est en `Draft`.

**Conséquence** : le dictionnaire a été retiré. Le champ *Established By* n'accepte que des
identifiants réels ; **une case vide est une information**, un identifiant approximatif est
une régression. Trace conservée intacte dans
[TERMINOLOGY-BACKLOG.md](TERMINOLOGY-BACKLOG.md) — 20 mentions `⚠️ NON VÉRIFIÉ`, aucune
corrigée ni supprimée.

---

## RD-007 — Cycle de publication normative

**Formulation verbatim (architecte)**

> `Authoring → Review → Validation → Promotion → Publication → Indexation`
>
> « Publication décrit l'existence du Record. Promotion décrit sa qualification
> documentaire. Indexation décrit son exposition aux moteurs. »
>
> « Un Record existe déjà avant sa promotion : il est servi par l'API, il est connu du
> corpus, il est accessible. La promotion ne le crée pas, elle modifie son statut
> documentaire. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | LOT GEO 2 — Registry public ; ouverture du Cycle 1 de promotion |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**Ce que la règle sépare.** Trois notions étaient jusqu'ici confondues sous le mot
« publier ». La distinction les rend indépendantes : un Record peut être **publié** (il
existe, l'API le sert) sans être **promu** (son statut documentaire reste `Draft`), et
promu sans être **indexé** (son exposition aux moteurs est une décision distincte).

**Conséquence directe dans le code.** La valeur `robots` d'une page de projection est
**dérivée du statut du Record**, jamais codée en dur : `Draft` → `noindex,follow` ;
à la promotion → `index,follow`. Le jour où un Record est promu, sa page devient
indexable **sans intervention**. L'indexation suit la promotion, elle ne la précède pas
et ne s'y substitue pas.

**Ce que la règle interdit implicitement.** Faire évoluer le seuil d'indexation pour
compenser un état de gouvernance — « faire évoluer la règle pour compenser un problème de
gouvernance affaiblirait la signification du statut `Draft` ». Le fait que **33 Records
sur 33** soient aujourd'hui en `Draft`, et donc que 91 pages soient en `noindex`, est un
**résultat attendu et déterministe**, pas un défaut à contourner.

Voir [DOSSIER-promotion-cycle-1.md](DOSSIER-promotion-cycle-1.md) — la mesure qui ouvre
le Cycle 1.

---

## RD-008 — Le code révèle, la gouvernance décide

**Formulation verbatim (architecte)**

> « Le code sert à révéler les conséquences d'une implémentation ; la gouvernance décide
> ensuite si cette implémentation exprime correctement les principes. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | Cycle 1 de promotion — décision sur la signification de l'empreinte |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**Séquence** : constater le comportement réel · le comparer aux principes · décider ensuite.

*Note de traçabilité* : cette entrée avait été demandée dans un mandat sans être formulée,
d'où le saut de numérotation entre RD-007 et RD-009 relevé lors de la réconciliation. Le
numéro est rétabli à sa place chronologique.

---

## RD-009 — Une projection n'établit rien

**Formulation verbatim (architecte)**

> « Une projection peut organiser, relier, présenter et agréger des informations ; elle ne
> peut jamais établir un fait, prendre une décision de gouvernance ou produire une nouvelle
> norme. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | Terminology Governance — décision sur le statut du Canonical Dictionary |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

Elle borne ce qu'une page de Registry, le Knowledge Graph et le futur dictionnaire ont le
droit de faire : présenter, jamais établir.

---

## RD-010 — Découplage constat / décision / projection

**Formulation verbatim (architecte)**

> « Les fonctions de constat, de décision et de projection doivent rester découplées. Une
> mesure ne décide pas, une décision ne se projette pas elle-même, et une projection
> n'établit jamais ce qu'elle représente. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | Terminology Governance — décision sur le porteur de la Translation Policy |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

Elle généralise RD-009 en y ajoutant le **constat** : c'est la règle qui sépare l'audit
terminologique (mesure), la qualification (décision) et le dictionnaire (projection) — et
qui interdit qu'un même document remplisse deux de ces fonctions.

---

## RD-011 — Plusieurs projections spécialisées, une seule décision

**Formulation verbatim (architecte)**

> « Une même décision de gouvernance peut produire plusieurs projections spécialisées
> répondant à des usages différents, à condition qu'aucune de ces projections ne porte sa
> propre logique décisionnelle. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | Registry public — décision sur les sitemaps |
| **Statut** | **découverte** |
| **Normalisée dans** | — |

**La règle qu'elle sert** : *« Il n'existe qu'une seule décision de gouvernance : le statut
documentaire du Record. Toutes les représentations techniques qui en découlent sont des
projections dérivées. »*

**Application mesurée.** Le statut d'un Record produit **quatre** projections, sans qu'aucune
ne décide quoi que ce soit :

| Projection | Dérivation |
|---|---|
| `robots` de la page | `Draft` → `noindex,follow` · sinon `index,follow` |
| Bandeau de statut | rendu si et seulement si `Draft` |
| Plan d'**indexation** | inclut la page si `robots === 'index,follow'` |
| Plan de **découverte** | inclut tout Record publié, quel que soit son statut |

Le plan d'indexation **ne relit pas le statut** : il dérive de `robots`, qui en dérive déjà.
La chaîne reste à un seul maillon décisionnel. C'est la condition posée par la règle — une
projection qui consulterait le statut pour son propre compte porterait une seconde logique
décisionnelle, et deux sources finiraient par diverger.

**Pas de contradiction entre les deux plans** : ils ont des finalités différentes. Le premier
recommande à l'indexation, le second expose à la découverte ; les pages `Draft` continuent
de porter `noindex`, et rien dans le second ne le contredit.

Complète [[RD-009]] et [[RD-010]] : une projection n'établit rien, et le constat, la
décision et la projection restent découplés — ici, **jusque dans le nombre de projections**.

---

## PROPOSITION (1) — sans numéro, en attente d'attribution par l'architecte

**Formulation proposée**

> « Un instrument non testé ne mesure rien. Un harnais qui produit un compte sans test
> de son propre compte n'est pas une mesure, c'est une annonce. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | LOT GEO 2 — vérification en production du Registry public |
| **Statut** | **proposée** — numéro non attribué |

**Motif — deux incidents sur le même lot, tous deux du fait de l'instrument :**

1. **CRLF parasites.** La liste des 92 URLs à contrôler a été écrite sur disque, en
   CRLF. Chaque chemin traînait un `` invisible ; `curl` a échoué sur les 92, et le
   harnais a rapporté **« 200 : 0 / 92 »** puis **« aucun écart »** — les deux lignes
   étant fausses en même temps.
2. **92ᵉ ligne non lue.** Après correction, la boucle `while read` a rapporté
   **« 91 / 92 — AUCUN ÉCART »**. Le fichier n'avait pas de saut de ligne final : la
   dernière URL n'a jamais été testée, et le harnais a affirmé l'absence d'écart sur un
   ensemble qu'il n'avait pas parcouru en entier.

Dans les deux cas, l'instrument **annonçait autre chose que ce qu'il mesurait** — et il
l'annonçait avec la même assurance que lorsqu'il avait raison. Aucun des deux n'aurait
été détecté sans une relecture manuelle du compte.

**Appliquée dans le code** : `registryPaths()` (`lib/seo/sitemapPlans.ts`) dérive des
mêmes sources que les routes, et son test assère son propre compte — 92 = 1 + 33 + 37 +
15 + 6 — ainsi que l'absence de doublon, de chemin vide et de caractère de contrôle.

**Portée** : elle vise tout harnais de vérification, pas seulement celui-ci. Un compte
produit sans test du compte n'est pas opposable.

---

## PROPOSITION (2) — sans numéro, en attente d'attribution par l'architecte

> **Distincte de la première.** L'instrument qui mesure faux et l'artefact jamais exercé
> sont **deux défauts différents** : le premier annonce un résultat qu'il n'a pas obtenu,
> le second obtient un résultat qui ne prouve rien. Elles ne doivent pas être fusionnées.

**Formulation proposée**

> « Un artefact dont les conditions d'exercice ne surviennent jamais ne prouve rien, quelle
> que soit sa justesse. Une contrainte sur un champ toujours nul, un test qui ne peut pas
> échouer, un chemin de code jamais atteint : même défaut. »

| | |
|---|---|
| **Date** | 2026-07-21 |
| **Chantier d'origine** | LOT GEO 2 — rétractation sur le chemin `entityHref(id, 'fr')` |
| **Statut** | **proposée** — numéro non attribué |

**Motif — trois occurrences documentées, dans trois chantiers différents :**

| # | Artefact | Condition d'exercice | Ce qu'il prouvait réellement |
|---|---|---|---|
| 1 | FK `ON DELETE RESTRICT` (C1) | colonne **jamais peuplée** | rien — la contrainte ne pouvait pas se déclencher |
| 2 | Matrice QA (Phase 1) | **chemin heureux non vérifié** | rien sur le cas nominal |
| 3 | `entityHref(id, 'fr')` (Lot GEO 2) | **aucune page `fr`/`es` ne rend de lien d'entité** | rien — le chemin n'est jamais atteint |

Le troisième cas est celui qui a fait formuler la règle. Le repli vers la page Record avait
été étendu à toutes les locales, et l'extension présentée comme un gain : *« depuis `/fr` et
`/es`, aucune pastille n'était liée, elles pointent désormais vers la page Record »*. La
mesure a établi que **seul `GeoPage` émet des liens d'entités**, que les pages piliers ne
sont générées qu'en `en`, et que les 4 routes `fr`/`es` existantes sont des redirections.
Le comportement était **correct et inobservable**. L'affirmation a été retirée, et l'étape 2
de la chaîne bornée à la locale canonique — un garde-fou vérifiable valant mieux qu'un
comportement qui ne peut ni être constaté ni échouer.

**Conséquence pratique** : avant de compter un artefact comme une garantie, établir que ses
conditions d'exercice surviennent. À défaut, il rejoint le registre des dettes, pas celui
des preuves.

---

## Correspondance avec le décompte de l'architecte

Sa liste en compte 4, ce registre en portait 3 ; après réconciliation : **6**.

| Sa numérotation | Entrée de ce registre | État avant réconciliation |
|---|---|---|
| 1 — la coordonnée est scellée dans le condensat | **RD-004** | non inscrite |
| 2 — précédence du Concept sur le Record | **RD-005** | non inscrite |
| 3 — toute référence interne passe par le résolveur canonique | **RD-001** | déjà inscrite |
| 4 — une source plausible n'est pas une source vérifiée | **RD-006** | non inscrite |
| *(absente de sa liste)* | **RD-002** — distinction découverte / normalisée | déjà inscrite |
| *(absente de sa liste)* | **RD-003** — la locale d'une référence | déjà inscrite |

**Total après réconciliation : 6 règles découvertes, 0 normalisée.**
Aucune entrée n'a été renumérotée : RD-001 à RD-003 sont déjà référencées dans le code
(`lib/content/homepage.ts`, `components/geo/HomePage.tsx`).

**Sur l'« Architectural Decisions Backlog » proposé** : ce registre remplit déjà ce rôle —
il conserve les décisions d'architecture reconnues valides et non encore normalisées, avec
leur formulation, leur date, leur chantier d'origine et leur statut. **Aucun document
concurrent n'a été créé**, pour ne pas dupliquer la source.

---

## Écarts relevés au titre de RD-001

Audit de **tous** les producteurs de références internes du site public, à la date
ci-dessus.

### É-1 — Les deux CTA de la Homepage construisaient leur adresse sans résolveur — ✅ CORRIGÉ

`lib/content/homepage.ts`, état d'origine :

```ts
ctaPrimary: { label: 'Start with the Professional Passport', href: `/${locale}/professional-passport` },
finalCta:   { label: 'Explore the World Skills Protocol',    href: `/${locale}/world-skills-protocol` },
```

Les deux pages existent : aucun lien mort en pratique. Mais l'adresse était **fabriquée
par concaténation**, sans consulter le registre — le défaut exact que RD-001 nomme, au même
endroit logique que les CTA des pages GEO. Une page sortie de `PILLARS`, ou une Homepage
traduite dans une locale où la cible ne l'est pas, aurait produit un lien mort
**silencieusement**.

**Corrigé** : les deux CTA passent par `ctaHref`, le cas `null` rend le libellé inerte
(`HomeCta`), et l'absence est tracée dans `_gaps` — même mécanisme, même traitement, même
traçage que les CTA d'archétype. Couvert par `lib/content/homepage.test.ts`, dont le test
central vérifie qu'en locale non traduite **aucune adresse en `/fr/` n'est produite**.

*Documenter une règle et laisser subsister un cas connu qui y déroge serait incohérent.*

### É-2 — Le fil d'ariane pointe vers `/en` en dur — non corrigé, devenu RD-003

Voir RD-003 ci-dessus : lacune de la règle, arbitrage différé.

### Producteurs d'URL vérifiés CONFORMES

| Producteur | Pourquoi il est conforme |
|---|---|
| `app/sitemap.ts` | dérive de `PILLARS × translatedLocales` — **ne peut pas** produire l'URL d'une page inexistante |
| `lib/seo/metadata.ts` (canonical, hreflang) | dérive des `translatedLocales` de la page ; hreflang limité aux traductions réelles |
| `lib/seo/pillarPage.tsx`, `archetypePage.tsx` (`url` du JSON-LD) | **auto-référence** de la page en cours de rendu — elle existe par définition |
| `app/(site)/[locale]/page.tsx` (canonical `/en`) | auto-référence de la Homepage |
| Liens d'entités (`GeoPage`) | `entityHref` |
| Reading Paths et Resources (Homepage) | `pillarHrefBySlug` |
| CTA des pages piliers et des archétypes | `ctaHref` |

---

Documents liés : [TERMINOLOGY-AUDIT.md](TERMINOLOGY-AUDIT.md) ·
[DETTES-ouvertes.md](DETTES-ouvertes.md) · [CONSTAT-established-by.md](CONSTAT-established-by.md).
