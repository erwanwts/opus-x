# OPUS X — ARCHITECTURE V3

**Infrastructure documentaire et machine GEO native**

Document pilier · Version définitive · 21 juillet 2026

---

## RÉGIME DE CE DOCUMENT

**[GRAVÉ]**

> Le document d'architecture est une projection documentaire de référence. Il ne fait pas
> autorité sur le protocole ; il rassemble, organise et explique les décisions gravées dans
> le Canonical Corpus et les règles découvertes en attente de normalisation. Il est réédité
> lorsque l'évolution de l'architecture dépasse un seuil de divergence défini, et non selon
> une périodicité fixe.

### Deux natures dans ce document

| Nature | Contenu | Traitement à la réédition |
|---|---|---|
| **[DÉRIVABLE]** — état réel | nombre de Records, de règles découvertes, de nœuds, état des lots, volumes, métriques | **recalculé** depuis le dépôt |
| **Synthèse architecturale** | progression logique, explications, justifications, narration | **réécrit** éditorialement |

Les tableaux de chiffres portent la marque **[DÉRIVABLE]**. Le jour d'une réédition, on sait
sans hésiter ce qui se recalcule et ce qui se réécrit.

### Seuil de réédition

**[GRAVÉ]** Une nouvelle édition est produite si **au moins une** condition est remplie :

- un principe architectural est normalisé ;
- une partie est restructurée ;
- une nouvelle surface majeure apparaît ;
- les métriques structurantes changent significativement (ex. : 33 → 60 Records) ;
- le document ne reflète plus fidèlement l'architecture courante.

> Ce n'est pas une fréquence. C'est un seuil de divergence.

---

## STATUT DE CE DOCUMENT

Ce document décrit l'architecture d'Opus X. Il est **définitif** au sens où il ne sera plus restructuré : les architectures futures l'amenderont, elles ne le remplaceront pas.

**Il n'est pas normatif.** Les règles qu'il énonce font autorité ailleurs — dans les Records du Canonical Corpus pour celles qui y sont gravées, dans le registre des règles découvertes pour celles qui attendent leur normalisation.

Trois niveaux de qualification sont employés :

| Marque | Signification |
|---|---|
| **[GRAVÉ]** | décision normative rendue, opposable |
| **[DÉCOUVERT]** | règle appliquée dans le code, non encore normalisée |
| **[V3]** | décision prise dans ce document, à valider |

Les décisions marquées **[V3]** sont regroupées en section 27. Elles sont au nombre de deux et procèdent d'une mesure, non d'une préférence.

---

# PARTIE I — FONDATIONS

## 1. Principe fondamental

Opus X n'est pas un site avec une base de données. C'est **un corpus avec des projections**.

```
                    ┌─────────────────────┐
                    │  CANONICAL CORPUS   │
                    │  source unique      │
                    └──────────┬──────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────┐
        ▼          ▼           ▼           ▼          ▼
    Registry   Knowledge    Public      Website   Traductions
     public      Graph        API
```

**[GRAVÉ]** Une seule règle gouverne l'ensemble :

> Aucune information n'est écrite deux fois. Toute surface dérive du corpus, aucune ne le redéfinit.

Cette règle a une conséquence que le projet a mis des semaines à établir : **une projection ne fait jamais autorité.** Elle est régénérable, supprimable, reconstructible, périssable. Si elle diverge du corpus, c'est la projection qui a tort.

**[DÉCOUVERT — RD-009]** *Une projection peut organiser, relier, présenter et agréger des informations ; elle ne peut jamais établir un fait, prendre une décision de gouvernance ou produire une nouvelle norme.*

**[DÉCOUVERT — RD-010]** *Les fonctions de constat, de décision et de projection doivent rester découplées. Une mesure ne décide pas, une décision ne se projette pas elle-même, et une projection n'établit jamais ce qu'elle représente.*

**[DÉCOUVERT — RD-011]** *Une même décision de gouvernance peut produire plusieurs projections spécialisées répondant à des usages différents, à condition qu'aucune de ces projections ne porte sa propre logique décisionnelle.*

Ces trois règles expliquent l'ensemble des scissions du projet : l'audit terminologique séparé du backlog, la revue de qualification séparée du dictionnaire, l'index normatif refusé comme source, les deux plans de site dérivés d'une seule décision.

---

## 2. Les trois natures d'objet

Les confondre est la principale source d'erreur.

### 2.1 Le corpus normatif

Ce qui fait autorité. Aujourd'hui : **33 Records**, un registre de prédicats, un registre de types.

Il n'est jamais modifié en place. Toute correction est un ajout. Toute évolution est une nouvelle publication.

**Il est invisible en tant que tel** — personne ne consulte le corpus, on consulte ses projections.

### 2.2 Les projections

Ce qui rend le corpus lisible : le graphe de connaissances, l'interface machine, le registre public, les pages du site, les traductions.

Chacune est une **vue dérivée**. Elle peut être détruite et régénérée sans perte.

### 2.3 La plateforme

Ce qui produit et consomme des faits. `app.opusx.world` — passeports, Evidence, vérifications, Trust.

**Elle n'est pas une projection.** Elle écrit dans un magasin append-only régi par le corpus, mais elle n'en dérive pas.

---

## 3. Le cycle de publication normative

**[DÉCOUVERT — RD-007]**

```
Authoring → Review → Validation → Promotion → Publication → Indexation
```

Trois notions distinctes qu'il ne faut jamais confondre :

| Acte | Ce qu'il décrit |
|---|---|
| **Publication** | l'existence du Record — servi par l'API, connu du corpus, accessible |
| **Promotion** | sa qualification documentaire — il ne le crée pas, il change son statut |
| **Indexation** | son exposition aux moteurs — conséquence de la qualification |

**[GRAVÉ]** *La publication rend un artefact accessible ; la promotion lui confère une autorité documentaire. Ces deux actes sont indépendants et relèvent de décisions de gouvernance distinctes.*

**Conséquence directe.** Un Record en Draft est publié, navigable, servi par l'interface machine, et porte `noindex,follow`. Sa promotion le rend indexable sans aucune intervention technique.

**Propriété remarquable de cette architecture.** Dans la plupart des systèmes documentaires, l'ordre est *écrire puis publier*. Ici il devient *écrire, publier, gouverner, promouvoir, rendre visible*. La publication n'est plus la fin du cycle : elle en est le commencement.

---

## 4. Ce que l'architecture refuse

Aussi important que ce qu'elle prévoit.

- **Aucun blog.** Chaque page représente une entité, une définition, un protocole, un framework, une relation ou un cas d'usage.
- **Aucune vérité recréée.** Le site présente, il ne définit pas.
- **Aucune redirection implicite** entre deux représentations d'une même entité.
- **Aucune source concurrente.** Le graphe ne lit pas la base. Le site ne lit pas la base. Tout dérive du corpus.
- **Aucune hypothèse comblant une absence.** Une valeur non dérivable n'est pas produite ; la lacune est tracée.
- **Aucun statut persisté.** Tout statut est dérivé des relations publiées.
- **Aucune modification d'un artefact publié.** Toute correction est un ajout.
- **Aucune traduction du corpus.** Les artefacts canoniques sont en anglais et le restent.

---

# PARTIE II — LE CORPUS

## 5. Canonical Corpus

### 5.1 Contenu

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Objet | Volume | Localisation |
|---|---:|---|
| OCR Records | 33 | `docs/web/registry-import/` |
| Prédicats | 37 identifiants distincts | OCR-007 |
| Familles de prédicats | 15 | OCR-007 |
| Types | 6 | OCR-007 |
| Manifeste d'intégrité | 33 entrées | `content/registry/_manifest.json` |

### 5.2 Séries d'identifiants

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Série | Rangs | Objet |
|---|---|---|
| OCR-000 à OCR-006 | 7 | fondations, gouvernance, architecture normative |
| OCR-008 à OCR-012 | réservés par OCR-007 | prédicats à venir |
| OCR-100 à OCR-125 | 26 | mécanismes, entités, registres |

**[GRAVÉ]** *On ne choisit jamais un identifiant avant d'avoir observé l'espace des identifiants existants.*

La série fondationnelle est close : son dernier rang libre a été attribué au Record d'architecture normative. Une nature fondamentale nouvelle devra justifier l'ouverture d'une nouvelle série, non l'ajout opportuniste dans une série devenue trop petite.

### 5.3 Structure d'un Record

```
# OCR-XXX — Titre
[ligne éditoriale optionnelle]
| Champ | Valeur |          ← tableau de métadonnées documentaires
| ... | ... |
> Grounding note (removed at publication)    ← présente sur 17 Records
---                                          ← FRONTIÈRE CANONIQUE
[corps du Record]
```

**[V3 — décision 1]** La frontière du contenu canonique est le **premier séparateur horizontal**.

Justification mesurée, non préférentielle : ce délimiteur est présent et constant sur les 33 Records. Il est le seul des deux candidats qui n'expose pas les 17 blocs portant la mention *removed at publication* — un texte qui demande sa propre suppression ne doit pas figurer sur 17 pages publiques.

Un seul Record porte du texte entre son titre et son tableau : celui d'architecture normative, qui n'a jamais été relu formellement.

---

## 6. Empreinte et intégrité

### 6.1 Signification

**[GRAVÉ]** L'empreinte représente le **contenu canonique**, non l'artefact documentaire complet.

> Si une simple promotion modifie l'empreinte, alors l'empreinte ne représente plus le contenu canonique : elle représente un état administratif du document.

**Conséquence :** le calcul exclut l'en-tête documentaire. Une promotion ne modifie donc pas l'empreinte — seuls les champs de gouvernance changent.

### 6.2 Méthode de calcul

**[DÉCOUVERT]** Le calcul porte sur le **blob LF**, jamais sur le fichier disque.

Le dépôt est en CRLF sur poste Windows. Hacher les octets bruts du disque produirait 33 empreintes fausses. Normaliser le dépôt marquerait 33 fichiers comme modifiés sans changement de contenu.

**Méthode retenue :** miroir LF hors dépôt. Ce piège a coûté quatre incidents avant d'être documenté.

### 6.3 Absence de contrôle

**Fait mesuré :** aucun contrôle d'intégrité n'existe. L'empreinte est produite et servie, jamais comparée.

La preuve est historique : onze empreintes sur trente-trois sont demeurées fausses plusieurs jours sans qu'aucun build, aucun test ni aucun déploiement n'échoue.

**Conséquence :** une divergence de manifeste ne casse rien. Elle diverge en silence. C'est une dette inscrite.

---

## 7. Gouvernance documentaire

### 7.1 Les invariants de promotion

**[GRAVÉ]** Toute promotion répond aux mêmes questions :

| Question | Réponse |
|---|---|
| Le contenu normatif change-t-il ? | Non — sinon c'est une révision, pas une promotion |
| L'identité change-t-elle ? | Non |
| L'empreinte change-t-elle ? | Non — elle porte sur le contenu canonique |
| La version documentaire change-t-elle ? | Non — une promotion est une qualification, pas une version |
| Le manifeste change-t-il ? | Oui — il décrit l'état du corpus |
| Les projections changent-elles ? | Oui — les pages deviennent indexables |

**[GRAVÉ]** *Une promotion est une qualification. Elle n'est pas une version. Sinon on introduit un quatrième axe de versionnement implicite, alors que le huitième principe affirme précisément leur indépendance.*

### 7.2 Le Cycle 1

**[GRAVÉ]** Trois phases, avec un critère documentaire et non temporel.

| Phase | Critère | Objectif | Volume |
|---|---|---|---:|
| 1 | contenu normatif stable depuis la dernière révision substantielle, aucune dette ouverte | valider la **procédure** | 30 |
| 2 | dettes explicitement inscrites et non corrigées | valider le **contenu** | 2 |
| 3 | jamais relu formellement | valider la **méthode** | 1 |

**[GRAVÉ]** Chaque Record est examiné individuellement. Aucune promotion automatique. Aucun traitement global.

> L'objectif de la Phase 1 n'est pas d'obtenir des Records promus. C'est d'obtenir une procédure de promotion éprouvée.

**Précondition non résolue.** Le corpus exige un *ancrage documentaire préalable* à toute promotion. Cette notion n'est définie nulle part. Dette inscrite.

---

# PARTIE III — LES PROJECTIONS

## 8. Règles communes

**[GRAVÉ]** *Toute métadonnée publiée par une projection est dérivée exclusivement du Canonical Corpus selon une chaîne de dérivation déterministe. Lorsqu'une valeur ne peut être dérivée sans hypothèse, elle n'est pas produite et la lacune est tracée.*

**[GRAVÉ]** *Toute projection publiée doit porter des métadonnées éditoriales suffisantes pour être correctement interprétée par les moteurs de recherche et les systèmes de découverte.*

**[GRAVÉ]** Un gabarit de repli est étiqueté `Derived metadata`, jamais `Canonical summary`. Les champs dérivés doivent être identifiables comme projections.

### Dérivation mesurée

| Champ | Source | Couverture |
|---|---|---:|
| `title` | titre principal du Record | 33/33 |
| `description` | résumé GEO du Record | 32/33 |
| `description` (repli) | gabarit projeté, étiqueté | 1/33 |
| `robots` | dérivé du statut documentaire | 33/33 |
| `canonical` | adresse sans locale sous `/records` | 33/33 |
| `@type` | `Article` | 33/33 |

Le champ de nom canonique n'a pas été retenu : il n'existe que dans 26 Records sur 33.

---

## 9. L'invariant de projection

### 9.1 La règle

**[GRAVÉ]** *Le contenu d'un Record constitue un texte canonique. Toute séquence susceptible d'être interprétée comme du balisage est traitée comme du texte tant qu'elle n'appartient pas explicitement au langage de représentation utilisé.*

**[GRAVÉ]** *Le nombre de caractères significatifs du corps publié doit être identique avant et après projection, à l'exception des transformations explicitement autorisées par le moteur de rendu.*

### 9.2 Les onze transformations autorisées

**[V3 — décision 2]** Mesurées sur les 33 Records, prouvées exhaustives.

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Construction | Occurrences | Retiré | Préservé |
|---|---:|---|---|
| gras | 2 228 | 4 astérisques | le texte |
| titres | 1 046 | dièses et espace | le libellé |
| puces | 1 088 | tiret et espace | le texte |
| listes ordonnées | 795 | numéro, point, espace | le texte |
| code en ligne | 796 | 2 accents graves | le texte |
| tableaux | 356 lignes | barres et remplissage | le contenu des cellules |
| blocs de code | 104 | les 2 lignes de clôture | tout le bloc, à l'octet |
| italique | 205 | 2 astérisques | le texte |
| séparateurs de tableau | 33 | la ligne | *(structure)* |
| règles horizontales | 39 | la ligne | *(structure)* |
| citations | 46 | chevron et espace | le texte |

**Aucun lien, aucune image dans tout le corpus.** Les 52 blocs de code sont tous du même type. Les tableaux ne dépassent jamais deux colonnes.

### 9.3 Les deux règles de frontière

Sans elles, la liste ne suffit pas.

**Un bloc de code est opaque.** Aucune transformation ne s'y applique. Ce n'est pas une commodité d'écriture : **70 des 73 séquences ressemblant à du balisage y vivent**, et cette règle seule les protège.

**L'ordre de retrait compte.** Les constructions de bloc avant celles en ligne, et le gras avant l'italique — sinon une emphase forte se lit comme une emphase faible contenant un astérisque.

### 9.4 La grandeur mesurée

L'invariant porte sur les **caractères non blancs**.

Le compte des marqueurs bruts et le compte mesuré divergent de plus de trois mille caractères — l'écart tient aux espaces des marqueurs et au remplissage des tableaux. Seule la grandeur non blanche est stable face à l'indentation et à l'alignement.

### 9.5 La démonstration

```
non blancs        431 630  →  413 505   (retirés 18 125)
pseudo-balises         73  →       73
PERDUES : AUCUNE
```

Si un marqueur non autorisé avait été retiré, ou un bloc de code traité comme du texte, le compte aurait baissé. **C'est la démonstration que la liste est complète.**

### 9.6 Ce que le test a révélé

Le test a été écrit **avant** le rendu, avec un défaut volontaire pour l'éprouver. Il a détecté la perte prévue.

Il a aussi révélé un défaut que personne n'avait anticipé : sur cinq Records, l'emphase forte capturait un bloc entier sans traiter les marques imbriquées. Ce défaut n'était pas volontaire, et c'est l'invariant qui l'a mis au jour, sur du corpus réel.

**Écrit après le rendu, ce test serait passé sur un moteur défectueux.**

---

## 10. Knowledge Graph

### 10.1 Nature

**[GRAVÉ]** *Le graphe est toujours une projection fidèle du corpus publié à un instant donné. Il n'anticipe jamais des faits futurs et ne réécrit jamais des faits passés. Toute publication produit une nouvelle projection, sans modifier les projections antérieures.*

### 10.2 État

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Métrique | Valeur |
|---|---|
| Nœuds | 80 |
| Arêtes | 222 |
| Concepts déclarés | 42 |
| Référence courante | `4b39afcc` |
| Référence historique | `c172712` |

Les projections antérieures demeurent valides comme photographies de leur époque.

### 10.3 Règle d'extraction

**[GRAVÉ]** L'extracteur ne fabrique jamais une sémantique absente de la source. Les arêtes proviennent exclusivement de la section de relations de chaque Record.

**[GRAVÉ]** *Within a Relations section, if a target identifier matches both a Record title and a declared Concept, concept resolution SHALL take precedence. Record resolution SHALL only occur when no declared Concept matches the identifier.*

Cette règle ne crée aucune capacité. Elle rend applicable une déclaration de concept qui resterait sans effet dès qu'elle porterait le nom d'un Record.

### 10.4 Ce que le graphe ne fait pas

- il ne connaît pas les instances, seulement les concepts ;
- il ne déduit rien de la base de données ;
- il ne projette que ce que le corpus énonce.

Ces limites ne sont pas des défauts. Elles garantissent qu'il ne devient jamais une source concurrente.

**Épisode révélateur.** La réidentification d'un framework a été publiée en base sans qu'aucun Record ne l'énonce. Le graphe ne pouvait donc pas la projeter. Le diagnostic initial — *le graphe est en retard sur le corpus* — était faux : le graphe était le reflet exact du corpus, et c'est le corpus qui ne portait pas la relation. La correction a consisté à publier la règle dans le Record des Frameworks, non à modifier le générateur.

---

## 11. Registry public

### 11.1 Statut

**[GRAVÉ]** *Une page de Registry est une projection documentaire dérivée du Canonical Corpus. Elle ne constitue jamais une publication normative indépendante ni une représentation faisant autorité.*

Conséquences : régénérable, supprimable et reconstructible, périssable, jamais source de vérité.

### 11.2 Le fait qui fonde ce lot

L'interface machine sert **déjà** le corps intégral de chaque Record, en JSON, sans authentification. Le corpus est donc déjà exposé publiquement dans son intégralité.

Une page de registre ne crée pas une seconde surface : elle rend lisible une surface qui existe.

**[GRAVÉ]** Ne montrer que l'identité reviendrait à cacher artificiellement un contenu déjà exposé.

### 11.3 Ce qu'affiche une page

```
Bandeau de statut (AVANT le titre, si Draft)
Identifiant · Titre
Métadonnées documentaires
Corps intégral du Record
Relations du Knowledge Graph
Lien vers la représentation machine
Pied de page déclarant la nature de la page
```

**[GRAVÉ]** Bandeau Draft, verbatim :

> **STATUS — Draft**
> This Record is published as part of the Canonical Corpus but has not yet been formally validated.

Il est dérivé du statut. Le jour d'une promotion, il disparaît sans intervention — aucune liste à tenir, aucun drapeau à basculer.

### 11.4 Périmètre

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Objet | Volume |
|---|---:|
| Records | 33 |
| Prédicats | 37 |
| Familles | 15 |
| Types | 6 |
| **Total pages** | **91** |

### 11.5 Contrainte de rendu

**[GRAVÉ]** Jamais d'insertion HTML directe. Le rendu produit des éléments, jamais du balisage interprété. C'est cette règle qui protège les séquences ressemblant à du balisage.

---

## 12. Interface machine publique

| Route | Objet | Contenu |
|---|---|---|
| `/api/registry` | index | métadonnées seules |
| `/api/registry/{id}` | Record | **corps intégral**, markdown brut |
| `/api/graph` | graphe | 80 nœuds, 222 arêtes |
| `/api/graph/{id}` | nœud | nœud et voisinage |
| `/api/concepts` | index | concepts déclarés |
| `/api/concepts/{slug}` | concept | définition, alias, statut sémantique — tous nuls aujourd'hui et tracés comme lacunes, conformément à la règle de dérivation |

**[GRAVÉ]** Les trois familles en lecture sont explorables. Les routes d'écriture et l'espace privé demeurent interdits.

Le registre et l'interface machine servent un contenu identique dans deux représentations différentes.

---

# PARTIE IV — LE SITE PUBLIC

## 13. Nature du site

### 13.1 Ce que le site n'est pas

Aucun calcul métier. Aucune donnée métier stockée. Ni tableau de bord, ni back-office, ni blog.

### 13.2 Ce que le site est

Une projection documentaire dont la mission est d'expliquer, documenter, référencer, servir d'autorité, être cité, être compris, et être réutilisé par les modèles de langage.

### 13.3 Audiences

| Audience | Attente | Surface servie |
|---|---|---|
| Moteurs génératifs | réponse citable, entité identifiée | données structurées |
| Moteurs classiques | contenu indexable, maillage | HTML, plan du site, canonical |
| Développeurs | contrat stable | interface machine, documentation |
| Partenaires | preuve d'autorité | registre, corpus |
| Utilisateurs | compréhension | pages piliers, questions |

### 13.4 Un seul bouton privé

```
Login → app.opusx.world
```

---

## 14. Architecture GEO

### 14.1 Les sept questions

Avant de créer une page, il faut pouvoir répondre :

1. Quelle entité représente-t-elle ?
2. À quel problème répond-elle ?
3. À quelle question utilisateur répond-elle ?
4. Quels modèles pourraient la citer ?
5. Quelles données structurées doit-elle contenir ?
6. Quelles relations du graphe doit-elle exposer ?
7. Quelles autres pages doivent pointer vers elle ?

**Une page qui ne peut répondre aux sept ne doit pas être créée.**

### 14.2 Ce qui rend une page citable

| Propriété | Mécanisme |
|---|---|
| Entité identifiée | identifiant stable, adresse canonique |
| Réponse immédiate | premier paragraphe autonome, sans contexte |
| Autorité traçable | lien vers le Record normatif source |
| Relations explicites | liens vers les entités voisines |
| Fraîcheur vérifiable | version documentaire, date de modification |

---

## 15. Entités et fabriques

### 15.1 Classes d'entités publiées

| Classe | Source | Adresse | Volume |
|---|---|---|---:|
| Pilier | prose gravée | `/{locale}/{slug}` | 11 |
| Record | Canonical Corpus | `/records/{id}` | 33 |
| Prédicat | OCR-007 | `/records/predicates/{id}` | 37 |
| Type | OCR-007 | `/records/types/{id}` | 6 |
| Famille | OCR-007 | `/records/families/{id}` | 15 |
| Concept | Knowledge Graph | `/concepts/{slug}` | 42 déclarés |
| Framework | base de données | `/frameworks/{slug}` | 2 représentations |

### 15.2 Trois fabriques distinctes

| Fabrique | Objet | Contenu |
|---|---|---|
| `pillarPage` | pages piliers | prose gravée, gabarit éditorial fixe |
| `archetypePage` | archétypes | prose gravée, structure variable |
| `recordPage` | pages de registre | projection intégrale, aucun texte éditorial |

**[GRAVÉ]** Une page pilier **interprète** un Record selon un gabarit éditorial. Une page de registre **restitue** un artefact. Ce sont deux objets différents et ils ne partagent pas la même fabrique.

---

## 16. URLs et adressage

### 16.1 Trois régimes

**[GRAVÉ]** Les artefacts canoniques sont en anglais et le resteront. Aucun préfixe de locale : un préfixe annoncerait une traduction qui n'existera jamais.

| Régime | Forme | Objets |
|---|---|---|
| Localisé | `/{locale}/{slug}` | pages éditoriales |
| Canonique | `/{namespace}/{id}` | Records, prédicats, types, frameworks |
| Technique | `/api/{...}` | projections machine |

### 16.2 Plan d'adressage

```
/                              → 307 vers /en
/{locale}                      → homepage
/{locale}/{pilier}             → 7 piliers + 3 archétypes
/concepts/{slug}               → bibliothèque de concepts

/records                       → index du Canonical Corpus
/records/{id}                  → page Record
/records/predicates/{id}       → page prédicat
/records/types/{id}            → page type
/records/families/{id}         → page famille

/frameworks/{slug}             → découverte canonique
/frameworks/{slug}/skills      → compétences d'un framework

/api/...                       → projections machine
```

**[GRAVÉ]** L'index du corpus est à `/records`, non à `/registry`. Quatre appels à l'action gravés y pointent déjà, et `/en/registry` existe comme page pilier. Placer l'index à `/registry` créerait une collision.

### 16.3 Résolution d'identité

**[GRAVÉ]** *Une identité n'est pas une adresse de découverte. Le protocole ne doit jamais présumer qu'une identité constitue, à elle seule, une adresse résoluble.*

Deux portes existent pour un framework : son identifiant canonique complet et son slug public. L'identifiant nu ne résout pas — c'est le raccourci que portent les faits, non une adresse.

---

## 17. Maillage interne

### 17.1 La règle

**[DÉCOUVERT — RD-001]** *Toute référence interne à un artefact est soumise au résolveur canonique. Si l'artefact n'existe pas, la référence n'est pas activée et l'absence est signalée.*

Elle couvre les liens du corps, les appels à l'action, les cartes de navigation, les renvois, et toute référence à venir. Elle n'est pas attachée à un composant d'interface mais à la notion de référence interne.

**Formulation de l'objectif :** faire disparaître des pages publiées toute référence vers un artefact inexistant, tout en conservant la connaissance de cette absence dans la chaîne de construction. Le lecteur ne voit aucune incohérence ; le constructeur reçoit toute l'information.

### 17.2 État mesuré

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Page | Liens d'entités | Actifs | Inertes |
|---|---:|---:|---:|
| world-skills-protocol | 25 | 6 | 19 |
| evidence | 17 | 5 | 12 |
| trust | 16 | 5 | 11 |
| verification | 13 | 5 | 8 |
| professional-passport | 11 | 4 | 7 |
| frameworks | 11 | 4 | 7 |
| registry | 1 | 1 | 0 |
| **Total** | **94** | **30** | **64** |

**68 % des liens d'entités du site sont morts aujourd'hui**, pointant vers 19 Records distincts.

Publier les pages du registre activerait automatiquement les 64 liens inertes. Le site passerait de 30 à 94 liens actifs sans modifier une ligne de contenu.

**Ce n'est pas un lot de contenu : c'est ce qui transforme onze pages isolées en corpus navigable.**

---

## 18. Données structurées

| Page | Types |
|---|---|
| Homepage | `Organization`, `WebSite`, `BreadcrumbList` |
| Pilier | `WebPage`, `BreadcrumbList` |
| Archétype questions | `FAQPage` (Question/Answer) |
| Record | `Article`, `BreadcrumbList` |
| Concept | `DefinedTerm`, `WebPage` |
| Framework | `EducationalOccupationalCredential` |

**[GRAVÉ]** Générés, jamais rédigés. Une valeur non dérivable n'est pas produite : la lacune est tracée.

---

## 19. Multilingue

### 19.1 Périmètre

**[GRAVÉ]** Le Canonical Corpus est **monolingue anglais**. Un Record traduit constituerait une seconde représentation d'une même définition, ce que le premier principe interdit.

| Objet | Traduisible |
|---|---|
| Records, prédicats, types, identifiants | **non** |
| Pages éditoriales, concepts, questions | oui |

### 19.2 Statut d'une traduction

**[GRAVÉ]** *Une traduction ne constitue jamais une nouvelle source documentaire ; elle constitue une projection linguistique d'une source canonique.*

L'anglais fait seul autorité. Une divergence signifie que la projection est périmée, non que deux vérités coexistent.

### 19.3 Production

**[GRAVÉ]** Une traduction générée est acceptable comme projection, à condition que le vocabulaire canonique soit intégralement préservé.

> Le moteur de traduction n'invente rien. Il transforme une représentation.

Le point critique est le **verrouillage du vocabulaire canonique** : les termes canoniques ne sont jamais traduits, en aucune langue.

**Dépendance mesurée.** La liste des termes à verrouiller est dérivable de trois sources déjà publiées — 33 titres, 42 concepts du graphe, 111 termes de sections terminologiques — soit 152 termes après union. Mais 60 d'entre eux sont aussi des mots anglais courants employés en minuscules dans le corpus. Un verrouillage par correspondance littérale est irréalisable : il buterait sur la casse.

**La faisabilité est acquise pour 92 termes sur 152.** Les 60 autres exigent une règle de désambiguïsation qui relève du chantier terminologique.

### 19.4 Statut de qualité

**[GRAVÉ]** Trois niveaux, décrivant la révision et non l'autorité :

| Statut | Signification |
|---|---|
| Generated | projection automatique non révisée |
| Reviewed | projection révisée par un humain |
| Certified | projection validée formellement |

### 19.5 Cycle applicable

**[GRAVÉ]** Deux cycles parallèles, jamais confondus.

```
Record        : Authoring → Review → Validation → Promotion → Publication → Indexation
Traduction    : Generation → Validation de fidélité → Publication
```

Une traduction n'ajoute aucune information normative. Elle ne requiert donc pas une promotion mais une validation de fidélité.

### 19.6 Règle transitoire

**[GRAVÉ]** Tant qu'une langue n'a pas sa page traduite, elle redirige vers l'anglais. La redirection disparaît automatiquement dès qu'une traduction officielle est publiée.

**[GRAVÉ]** Une langue non générée ne publie jamais de contenu partiel.

---

# PARTIE V — LA PLATEFORME

## 20. Plateforme privée

**Surface :** `app.opusx.world`

### 20.1 Séparation

**[GRAVÉ]** Le site public et la plateforme sont deux surfaces distinctes. Le site ne lit pas la base ; la plateforme n'écrit pas dans le corpus.

### 20.2 État réel mesuré

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Table | Lignes en production |
|---|---:|
| Evidence | 0 |
| Demonstrates skill | 0 |
| Issuers | 0 |
| Fact revocations | 0 |

**[GRAVÉ]** Cet état est conforme. Deux patrimoines coexistent :

| Patrimoine | Contenu | État |
|---|---|---|
| Normatif | définitions, relations, règles | présent |
| Factuel | Evidence, faits immuables, calculs de confiance | vide |

> C'est un protocole prêt à recevoir ses premiers faits.

### 20.3 Garanties structurelles vérifiées

| Garantie | Mécanisme | Vérifié en production |
|---|---|---|
| Immuabilité | trigger sur 8 tables, opposable au service_role | oui |
| Intégrité | coordonnée scellée dans le condensat | oui |
| Réidentification | table append-only, statut dérivé | oui |
| Découverte canonique | statut calculé à la lecture | oui |

**[DÉCOUVERT — RD-004]** *La coordonnée est scellée dans le condensat d'intégrité.*

C'est la seule règle découverte adossée à une preuve matérielle dans le code plutôt qu'à une formulation : le calcul copie littéralement les identifiants dans la préimage soumise au hachage. C'est ce fait qui a rendu toute mutation impossible et fondé la réidentification par pure addition.

---

# PARTIE VI — GOUVERNANCE

## 21. Terminologie

### 21.1 Le pipeline

**[GRAVÉ]**

```
Terminology Audit          → constat de l'état documentaire
Terminology Qualification  → décision (qualification + politique de traduction)
Canonical Dictionary       → projection publique
Translation Pipeline       → application
```

**La revue décide. Le dictionnaire expose. Le pipeline applique.** Aucun document ne remplit deux fonctions.

### 21.2 Les quatre documents

| Document | Objet | Nature |
|---|---|---|
| Terminology Audit | concepts **déclarés** et leur état | constat |
| Terminology Qualification Review | qualification et politique de traduction | décision |
| Terminology Backlog | concepts **envisagés**, hors protocole | matière |
| Canonical Dictionary | projection publique | projection |

**[GRAVÉ]** Le dictionnaire est généré depuis l'audit, **jamais** depuis le backlog.

### 21.3 État mesuré

Sur 47 termes du périmètre :

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Verdict | Volume |
|---|---:|
| Établi — entrée de terminologie ou titre de Record | 12 |
| Employé sans définition | 22 |
| Arête seule — n'existe que comme cible d'une relation | 8 |
| Termes du chantier de réidentification | 5 |

**Aucune formulation n'existe dans un artefact pour les 5 derniers.** Le Record d'architecture les *suppose* : il prescrit leur comportement sans jamais dire ce qu'ils sont.

### 21.4 Le critère de qualification

**[GRAVÉ]** *Un concept du protocole n'existe que s'il est établi par le corpus. Une relation peut référencer un concept existant. Une relation ne crée jamais un concept.*

La question n'est donc pas *faut-il définir ces termes* mais **le protocole a-t-il réellement besoin de chacun d'eux**.

### 21.5 Exposition publique

**[GRAVÉ]** Les dettes sont publiques, avec une exposition maîtrisée.

| Statut public | Signification |
|---|---|
| Established | établi par un Record |
| Under Qualification | en cours de qualification |
| Planned | envisagé |
| Deprecated | déprécié |

Le dictionnaire ne dit jamais *ce terme est absent*. Il dit *ce terme n'est pas encore établi*. La justification, les arbitrages et l'historique demeurent dans la revue de qualification.

**Conséquence :** le dictionnaire est productible immédiatement. Il n'attend plus que les termes soient établis — il les expose dans leur état réel. Il devient l'instrument qui rend le chantier visible, au lieu d'en être le produit final.

---

## 22. Règles découvertes

**[GRAVÉ]** Deux statuts distincts :

| Statut | Définition |
|---|---|
| **Règle découverte** | identifiée pendant un chantier, non normalisée. Reconnue valide, peut guider les développements, ne fait pas partie du corpus |
| **Règle normalisée** | publiée dans un Record identifié. Opposable, appartient au protocole |

**[GRAVÉ]** *Aucun principe normatif ne peut avoir pour unique source une conversation, un compte rendu de chantier ou un échange de conception. Le protocole n'est modifiable que par ses propres artefacts.*

### Registre — 11 entrées, toutes au statut découvert

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| # | Règle |
|---|---|
| RD-001 | Toute référence interne passe par le résolveur canonique |
| RD-002 | Distinction entre règle découverte et règle normalisée |
| RD-003 | La locale d'une référence interne n'est pas couverte par RD-001 |
| RD-004 | La coordonnée est scellée dans le condensat d'intégrité |
| RD-005 | Précédence du concept sur le Record lors de la résolution |
| RD-006 | Une source plausible n'est pas une source vérifiée |
| RD-007 | Cycle de publication normative en six étapes |
| RD-008 | Le code révèle les conséquences ; la gouvernance décide de leur conformité |
| RD-009 | Une projection n'établit jamais ce qu'elle représente |
| RD-010 | Découplage des fonctions de constat, décision et projection |
| RD-011 | Une décision peut produire plusieurs projections spécialisées |

**[GRAVÉ]** Un Record en attente de relecture n'est pas enrichi au fil des découvertes du chantier. Sinon la validation devient une cible mouvante. Ces onze règles attendent le prochain cycle de normalisation.

---

## 23. Dettes ouvertes

**[GRAVÉ]** *Une entrée n'est jamais supprimée du registre des dettes. Elle est close, avec le motif de sa clôture.*

| Dette | Nature | État |
|---|---|---|
| Deux anomalies d'alias dans le graphe | mécanisme distinct de la résolution par titre | ouverte |
| Énumération hétérogène dans OCR-100 | révélée par la règle de précédence | ouverte |
| Absence de `.gitattributes` | 4 incidents CRLF comptés | ouverte |
| Seed divergent | ne reproduit ni l'ancien ni le nouvel état | ouverte |
| Ancrage documentaire non défini | précondition de promotion | ouverte |
| Absence de contrôle d'intégrité | l'empreinte est servie, jamais comparée | ouverte |
| Emphase typographique non rendue | close — le besoin a disparu au lieu d'être satisfait | **close** |

---

# PARTIE VII — EXÉCUTION

## 24. État réel

### 24.1 En production

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Surface | État |
|---|---|
| Pages publiques | 11, vérifiées |
| Interface machine | 6 routes, explorable |
| Réidentification | publiée, exposée par la découverte canonique |
| Knowledge Graph | 80 nœuds, 222 arêtes |
| Magasin de faits | vide, conforme |

### 24.2 Lots GEO

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Lot | Objet | État |
|---|---|---|
| 1 | Fondations et piliers | **fait** — 11 pages |
| 2 | Registry public | **en cours** — moteur et fabrique livrés |
| 3 | Glossaire et entités | débloqué par la décision sur les dettes publiques |
| 4 | Knowledge Graph public | non commencé |
| 5 | Comparatifs | non commencé |
| 6 | Documentation développeurs | partiellement — une page publiée |
| 7 | Localisation | doctrine gravée, non commencé |
| 8 | Automatisation | non commencé |

### 24.3 Chantiers de gouvernance

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Chantier | État | Bloqueur |
|---|---|---|
| Relecture du Record d'architecture | ouverte | architecte |
| Cycle 1 de promotion | 33 Records répartis en 3 phases | architecte |
| Gouvernance terminologique | 3 documents produits | 54 termes, deux décisions chacun |
| Normalisation | 11 règles découvertes | relecture du Record |

---

## 25. Roadmap

```
Lot 2 (Registry) ──► Cycle 1 (Promotion) ──► indexation des 91 pages
       │
       └──► Lot 4 (Graphe public)

Gouvernance terminologique ──► Lot 3 (Concepts) ──► Lot 5 (Applications)
                            └► Lot 7 (Localisation)
```

### Priorisation

| Priorité | Lot | Raison |
|---|---|---|
| 1 | Registry public | ne dépend d'aucun arbitrage ; débloque 64 liens morts |
| 2 | Cycle 1 de promotion | conditionne l'indexation des 91 pages |
| 3 | Gouvernance terminologique | conditionne concepts, dictionnaire et traductions |
| 4 | Graphe public | dépend d'un registre stable pour le maillage |
| 5 | Bibliothèque de concepts | dépend du dictionnaire |
| 6 | Localisation | dépend du verrouillage terminologique |

**Point structurant.** Les 91 pages du registre naîtront en non-indexation puisque les 33 Records sont en projet. Le Cycle 1 n'est donc pas un chantier de gouvernance parallèle : **c'est la condition de visibilité du corpus**.

### Plans du site

**[GRAVÉ]** Une seule décision de gouvernance, deux projections spécialisées.

**[DÉRIVABLE]** — recalculé depuis le dépôt, jamais réécrit.

| Plan | Contenu | Volume |
|---|---|---|
| Indexation | uniquement les pages indexables | 11 aujourd'hui, remonte avec les promotions |
| Découverte | tous les Records publiés, quel que soit leur statut | **103** — 11 éditoriales + l'index `/records` + les 91 pages du registre |

Le décompte de la découverte est **103 et non 102** : l'index `/records` est une URL
publiée et découvrable, mais il n'est aucune des 91 pages du registre. Mesuré, non
arrondi.

Le premier remonte vers 102 à mesure des promotions, sans intervention.

---

## 26. Recommandations techniques

### 26.1 Stack

| Élément | Choix | Justification |
|---|---|---|
| Framework | Next.js 15, App Router | génération statique |
| Rendu | statique intégral | aucune donnée dynamique |
| Rendu markdown | ciblé, zéro dépendance | principe du plan GEO ; 20 dépendances au dépôt, aucune de rendu |
| Métadonnées | dérivées du corpus | chaîne déterministe |
| Robots, bandeau, plans | dérivés du statut | une seule décision de gouvernance |

### 26.2 Disciplines éprouvées

**Le test avant l'implémentation.** L'invariant de projection s'écrit avant le rendu. Écrit après, il serait passé sur un moteur défectueux — et il a révélé un défaut réel que personne n'avait prévu.

**L'extraction avant la modification.** Extraire une fonction pure, écrire la matrice de tests sur l'état actuel, prouver la neutralité, puis seulement modifier le comportement. Cette discipline a évité deux régressions.

**Le garde-fou cède au grand jour.** Un test qui fige un comportement n'est jamais contourné : il est amendé explicitement, avec l'ancien et le nouveau comportement assertés côte à côte.

**La mesure avant la conception.** Trois fois pendant ce chantier, une mesure préalable a invalidé une hypothèse de conception : le delta nul de reprojection du graphe, le corps déjà servi par l'interface machine, et les 70 pseudo-balises vivant dans des blocs de code.

**[DÉCOUVERT — RD-008]** *Le code sert à révéler les conséquences d'une implémentation ; la gouvernance décide ensuite si cette implémentation exprime correctement les principes.*

---

## 27. Décisions prises dans ce document

Deux, toutes deux mesurées.

### Décision 1 — La frontière du contenu canonique

**Retenue :** le premier séparateur horizontal.

| Candidat | Conséquence mesurée |
|---|---|
| Premier séparateur | n'expose aucun bloc *removed at publication* — 33/33 |
| Fin du tableau | exposerait 17 blocs demandant leur propre suppression |

Ce délimiteur est présent et constant sur les 33 Records. Rien n'est à définir.

**Conséquence :** l'empreinte porte sur le corps seul. Une promotion ne la modifie plus — la question que l'architecte voulait trancher une fois pour toutes se referme d'elle-même.

### Décision 2 — Les transformations autorisées

**Retenues :** les onze constructions mesurées, plus les deux règles de frontière, plus la grandeur non blanche.

La liste n'est pas supposée : son application aux 33 Records préserve les 73 séquences sensibles. Toute transformation non listée ferait baisser le compte.

**Réserve de l'architecte.** Cette liste vaut pour le corpus **actuel**. Elle devra évoluer
si le corpus introduit une construction au-delà des onze.

**Le mécanisme d'alerte existe déjà** : le test d'exhaustivité parcourt les 33 Records et
**échoue** si une construction non couverte apparaît — avant que le rendu ne la traite au
jugé. Une douzième construction ne passera donc pas inaperçue ; elle cassera le build.


---

# ANNEXE A — Les dix principes d'architecture normative

Source : OCR-006, en projet, en attente de relecture formelle.

| # | Principe |
|---|---|
| 1 | Distinction entre définition logique et représentation canonique |
| 2 | Distinction entre fait immuable et mécanisme de lecture |
| 3 | Distinction entre identité et adresse de découverte |
| 4 | La résolution d'identité appartient exclusivement à la couche de lecture |
| 5 | Toute réidentification procède exclusivement par ajout |
| 6 | Seules les relations référençables depuis un fait immuable sont publiées |
| 7 | Une réidentification conserve les propriétés normatives |
| 8 | Les trois niveaux de versionnement sont indépendants |
| 9 | Le statut est dérivé et jamais persisté |
| 10 | Toute décision architecturale est normalisée avant la clôture du chantier |

---

# ANNEXE B — La philosophie

> Ne concevoir ni un site web, ni une documentation, mais **une base de connaissances mondiale** dont le HTML n'est qu'une représentation parmi d'autres.

Chaque page est une entité d'un graphe de connaissances, optimisée simultanément pour les humains, les moteurs de recherche, les modèles de langage, les interfaces machine et les agents.

Cette philosophie explique toutes les décisions qui précèdent : pourquoi le corpus est publié avant d'être qualifié, pourquoi une projection ne fait jamais autorité, pourquoi une absence est tracée plutôt que comblée, et pourquoi le statut d'un document est dérivé plutôt que stocké.

**Le site n'est pas le produit. Le corpus est le produit. Le site est la manière dont il devient lisible.**

---

*Document définitif. Non normatif. Les règles citées font autorité dans les Records qui les portent.*
