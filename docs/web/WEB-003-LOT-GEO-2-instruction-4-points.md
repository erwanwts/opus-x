# LOT GEO 2 — instruction des 4 points restants

> **CONCEPTION SEULEMENT.** Aucune ligne de code. Toutes les valeurs sont **mesurées** sur
> l'état du dépôt. Les propositions de règle sont **soumises à validation** ; rien n'est
> appliqué.

**Date** : 2026-07-21 · `main` à `1022cc7` · corpus 33 Records.
Fait suite à [WEB-003-LOT-GEO-2-registry-public-conception.md](WEB-003-LOT-GEO-2-registry-public-conception.md).

## Décisions gravées, prises pour acquises

1. **Statut** — « Une page de Registry est une projection documentaire dérivée du Canonical
   Corpus. Elle ne constitue jamais une publication normative indépendante ni une
   représentation faisant autorité. » Régénérable, supprimable, périssable, jamais source
   de vérité. **Traitée exactement comme le Knowledge Graph.**
2. **Les Draft sont publiés**, statut affiché **avant** le titre.
3. **Record intégral affiché.**
4. **Métadonnées éditoriales suffisantes**, générées et non rédigées.
5. **Aucun préfixe de locale.**
6. **Le Registry est la porte d'entrée du Canonical Corpus.**

---

# (a) RENDU MARKDOWN

## Ce que le corpus contient réellement — inventaire exhaustif

| Construction | Occurrences | Records concernés |
|---|---:|---:|
| gras `**` | 2 228 | 33 |
| liste `-` | 1 088 | 33 |
| titre `##` | 1 002 | 33 |
| code inline `` ` `` | 796 | 33 |
| liste ordonnée `1.` | 795 | 32 |
| tableau (lignes) | 389 | 33 |
| italique `*` | 205 | 29 |
| bloc de code clôturé | 52 | 26 |
| citation `>` | 46 | 27 |
| règle `---` | 39 | 33 |
| titre `###` | 40 | **1** |
| titre `#` | 4 | **1** |
| **lien `[x](y)`** | **0** | **0** |
| **image `![]`** | **0** | **0** |

**Le jeu de constructions est CLOS et petit** : titres, listes (ordonnées et non), tableaux,
blocs de code, citations, règles, gras, italique, code inline. **Rien d'autre.**

Deux précisions qui simplifient encore :

- **les 52 blocs de code sont tous en `json`** — un seul langage, aucune coloration
  syntaxique multi-langage à prévoir ;
- **les tableaux font au maximum 2 colonnes** — aucun tableau complexe, aucune fusion.

## Le vrai risque n'est pas l'injection : c'est la **disparition silencieuse**

Le corpus vient du dépôt, pas d'un utilisateur — le risque XSS est structurellement nul.
Mais la mesure a trouvé **73 occurrences de `<…>` dans 18 Records** :

```
33 <opus_id>   9 <issuer_id>   8 <id>   7 <level>   3 <uuid>   2 <org_id>
2 <jcs-digest>   2 <context>   1 <what was demonstrated>   1 <verifier_id>
1 <optional_ids>   1 <hmac-over-jcs-canonical-bytes>   1 <computed_status> …
```

**Ce ne sont pas des balises HTML : ce sont des placeholders de prose.** Tout rendu qui
laisse passer le HTML — `dangerouslySetInnerHTML`, ou une bibliothèque configurée en
`allowDangerousHtml` — les interprétera comme des éléments inconnus et **les fera
disparaître de la page, sans erreur ni avertissement**. Le lecteur verrait
« An Evidence references  and  » au lieu de « An Evidence references `<opus_id>` and
`<level>` ».

C'est le danger réel du rendu markdown ici : **une perte de contenu invisible dans
18 Records sur 33**, pas une faille de sécurité.

## Deux approches

### Option A — bibliothèque (`react-markdown` + `remark-gfm`)

- Couvre tout, y compris ce que le corpus n'utilise pas.
- **Coût de dépendances** : le dépôt en compte **20 au total**, et **aucune** touchant au
  markdown. `react-markdown` + `remark-gfm` en ajoutent une quinzaine de transitives
  (`unified`, `micromark`, `mdast-*`, `hast-*`).
- **Poids de bundle sur les 91 pages** — un parseur markdown côté client si le rendu n'est
  pas strictement serveur.
- **Configuration critique** : il faudrait explicitement **désactiver** le passthrough HTML
  pour ne pas perdre les 73 placeholders — un réglage à ne pas manquer, sur lequel rien ne
  préviendrait en cas d'oubli.

### Option B — rendu déterministe ciblé, zéro dépendance — **je recommande**

Le jeu de constructions étant **clos et mesuré**, un rendu ciblé le couvre intégralement.
Et le dépôt en possède déjà la moitié : `lib/content/geo.ts` a un modèle `Block`
(`p` / `ul`) et une fonction `inline()` qui projette gras, italique et code inline en
segments de **texte** — jamais en HTML.

Il resterait à ajouter : titres `##`/`###`, listes ordonnées, tableaux (2 colonnes), blocs
de code `json`, citations, règles.

Arguments :

- **le plan GEO 1a a posé « Zéro dépendance markdown »** comme principe explicite ; l'option
  B le respecte, l'option A le renverse ;
- le corpus **ne peut pas** contenir de construction inattendue sans que le lot le sache :
  ajouter une construction au corpus sans l'ajouter au rendu produirait un cas non couvert,
  qu'un test d'exhaustivité détecterait (voir ci-dessous) ;
- **coût de build négligeable** : `loadRecord` parse déjà les 33 Records pour l'API, à
  chaque build. Le surcoût est celui du rendu, pas de l'analyse.

## Ce qui doit être échappé ou interdit

| Règle | Motif |
|---|---|
| **Jamais `dangerouslySetInnerHTML`.** Le rendu produit des éléments React depuis du **texte** ; React échappe. | Les 73 placeholders `<…>` survivent en texte littéral. C'est la règle qui protège le contenu, pas seulement la sécurité. |
| **HTML brut du corpus : jamais interprété**, toujours rendu comme texte. | Idem. |
| **Images interdites** — 0 dans le corpus. Si une apparaît : le lot ne la rend pas et la signale. | Aucune source d'image publiée ; en rendre une serait fabriquer une référence. |
| **Liens : 0 aujourd'hui.** Si un lien apparaît dans un corps de Record, il **doit passer par le résolveur canonique** (RD-001) et rester inerte si la cible n'existe pas. | Un lien de corps est une référence interne. RD-001 le couvre explicitement (« liens du corps »). |
| **Blocs de code : rendus en `<pre><code>`, contenu littéral**, aucune exécution, aucun `json` re-sérialisé. | Le contenu doit rester octet pour octet celui du Record. |
| **Test d'exhaustivité** : un test parcourt les 33 Records et échoue si une construction non couverte apparaît. | Sans lui, un ajout au corpus produirait une page silencieusement dégradée — le même mode de défaillance que les placeholders. |

---

# (b) RÈGLE DE DÉRIVATION DES `title` ET `description` — proposition

## Disponibilité réelle des champs, mesurée sur 33/33

| Champ | Présence | Observation |
|---|---:|---|
| **H1 (`# OCR-nnn — Label`)** | **33/33** | seule source de nom **universelle** |
| Document ID · Canonical ID · Version · Status · Owner · Review Status · Normative/Informative · Last Update | 33/33 | |
| `Canonical Name` | **26/33** | absent des 7 Records de gouvernance |
| `Layer` | 26/33 | mêmes 26 |
| `Kind` | **7/33** | **exactement les 7 autres** — complémentarité parfaite |
| `## GEO Summary` | **32/33** | **absent d'OCR-006 seul** |

Deux familles apparaissent : **26 fiches conceptuelles** (`Canonical Name` + `Layer`) et
**7 Records de gouvernance** (`Kind`). Aucune règle fondée sur `Canonical Name` seul ne
couvrirait le corpus.

## Règle proposée — purement mécanique

### `title`

```
{Document ID} — {Label} | Canonical Registry
```

`Label` = **le libellé du H1**, après le tiret cadratin. Présent 33/33, donc **jamais de
repli nécessaire**. Exemple : `OCR-110 — Evidence | Canonical Registry`.

*Pourquoi le H1 et non `Canonical Name`* : le H1 est universel, `Canonical Name` ne couvre
que 26/33. Une règle qui a besoin d'un repli pour 7 cas sur 33 n'est pas une règle.

### `description` — cascade à deux niveaux, sans troisième

1. **Première phrase de `## GEO Summary`**, verbatim, coupée à la frontière de phrase, sans
   dépasser 160 caractères et **jamais au milieu d'un mot**. → couvre **32/33**.
2. **À défaut** — gabarit de champs mesurés, aucun mot de prose :
   ```
   {Kind ou Layer} · Version {Version} · Status {Status} · Canonical Registry of the World Skills Protocol
   ```
   → couvre **1/33** (OCR-006) et tout Record futur sans GEO Summary.

**Il n'y a pas de troisième niveau.** Si les deux échouent, la page **n'émet pas de
description** et la lacune est tracée dans `_gaps`. Aucune description n'est fabriquée.

### Autres métadonnées

| Champ | Valeur dérivée |
|---|---|
| `canonical` | `https://opusx.world/registry/{id}` — **sans locale** (décision 5) |
| `og:type` | `article` (aligné sur les pages piliers) — **à valider** |
| `alternates.languages` | **aucun** — un Record n'est pas traduit ; émettre un `hreflang` annoncerait une traduction inexistante |
| `robots` | **⚠️ NON GRAVÉ — voir ci-dessous** |
| JSON-LD | `Organization` + `BreadcrumbList` + un type de page — **à valider** |

## ⚠️ Trois points que la règle ne peut pas trancher seule

**1 — `robots` pour les Draft.** La décision 4 impose `robots` dans le minimum, mais **sa
valeur n'est pas gravée** — et la décision 2 publie 33 Draft sur 33. Trois lectures :
`index` (le corpus est public, le bandeau informe), `noindex` (précédent interne : WEB-D3
applique déjà `noindex` aux textes juridiques non validés), ou `index` assorti d'un
`datePublished`. **Je ne tranche pas.**

**2 — le type JSON-LD.** Un Record projeté n'est ni un `Article` éditorial ni une
`WebPage` ordinaire. Candidats : `TechArticle`, `WebPage`, `DefinedTerm`, ou `CreativeWork`
avec `isBasedOn` vers l'API. La décision 1 dit *« traitée exactement comme le Knowledge
Graph »* — or les pages actuelles n'émettent que `WebPage`. **Cohérence à arbitrer.**

**3 — le gabarit de repli contient des mots.** « Version », « Status », « Canonical
Registry of the World Skills Protocol » sont des **étiquettes**, pas de la prose ; mais ce
sont des mots que personne n'a gravés. Si la règle doit être strictement « générée, pas
rédigée », ces étiquettes doivent être **validées comme faisant partie de la règle**.

---

# (c) L'INDEX — et la collision de nom

## Le problème, posé exactement

`/en/registry` **existe déjà** : page pilier, projection d'**OCR-124 « Canonical
Registry »**, avec la prose gravée de l'architecte et son CTA. Elle décrit le **concept**
de registre canonique.

L'index projeté décrirait le **corpus lui-même** : 33 Records, 37 prédicats, 15 familles,
6 types.

**Ce sont deux objets différents qui porteraient le même nom, à deux adresses.** C'est
exactement l'ambiguïté que la réidentification a appris à éviter — *« deux portes, pas
trois »*. Un lecteur qui cherche « le registre » ne saurait pas laquelle ouvrir, et les
deux pages se concurrenceraient dans l'index des moteurs.

## Ce que la mesure apporte

**`/records` est déjà cité par les textes de l'architecte, et 4 CTA y pointent — tous
inertes aujourd'hui :**

| Page | CTA | Destination |
|---|---|---|
| Developers, hero | *Read the Protocol Records* | `/records` |
| Developers, CTA final | *Read the Protocol Records* | `/records` |
| Questions, hero | *Browse the Protocol Records* | `/records` |
| Questions, CTA final | *Read the Protocol Records* | `/records` |

Ces quatre CTA ont été **délibérément conservés inertes**, avec l'absence documentée dans
`_gaps`. Ils décrivent précisément l'objet dont il est question : *« Read the Protocol
Records »*, c'est-à-dire **l'index du corpus**.

Et à l'inverse : **aucun texte de l'architecte ne pointe vers un index appelé `/registry`.**

## Trois options

| Option | Conséquences |
|---|---|
| **(i) Index à `/records`**, pages à `/records/{id}` | **4 CTA s'activent immédiatement**, sans retouche éditoriale — le mécanisme RD-001 fait le travail. Aucune collision de nom : `/en/registry` reste la page du concept, `/records` est le corpus. Les textes de l'architecte deviennent cohérents avec le site. **Mais** la décision 6 nomme « Registry » la porte d'entrée : il faudrait acter que la porte d'entrée du Canonical Corpus s'adresse `/records`. |
| **(ii) Index à `/registry`**, pages à `/registry/{id}` | Fidèle au vocabulaire de la décision 6. **Mais** collision de nom avec `/en/registry`, cannibalisation SEO probable, et les **4 CTA `/records` restent morts** — il faudrait soit les réécrire (donc toucher au texte de l'architecte), soit les laisser inertes indéfiniment. |
| **(iii) Index à `/registry`, redirection depuis `/records`** | **Écarté** : la doctrine interdit les redirections implicites — *« il ne faut pas corriger au mieux ni créer de redirection implicite »*. Ce serait exactement cela. |

**Ma lecture** : l'option (i) est la seule qui n'exige ni de toucher au texte gravé, ni de
laisser 4 CTA morts, ni de faire cohabiter deux « registry ». Mais l'arbitrage sur le
**nom** de la porte d'entrée appartient à l'architecte : c'est du vocabulaire, pas de la
technique.

## Contenu de l'index — dans les deux cas

Projeté, jamais rédigé : les 33 Records (identifiant, libellé du H1, version, **statut**,
famille), les 37 prédicats, les 15 familles, les 6 types. Plus un renvoi explicite vers
`/en/registry` (le concept) et vers `/api/registry` (la surface machine). Le bandeau de
statut de la décision 2 s'applique **aussi à l'index** : il liste 33 Draft sur 33.

---

# (d) LE MIDDLEWARE — le point le plus risqué

## L'état exact

```ts
export async function middleware(request: NextRequest) {
  const first = request.nextUrl.pathname.split('/')[1] ?? '';
  if (hasLocalePrefix(first)) return intlMiddleware(request);   // /en /fr /es
  if (RESERVED.has(first)) return appSession(request);          // app + api
  return intlMiddleware(request);                               // ajoute la locale (307)
}
```

`RESERVED` = `dashboard · emission · establish · verify-email · passport · link · me · p ·
passports · auth · api · frameworks · issuers`.

Il n'existe aujourd'hui que **deux** catégories : *localisé* et *réservé à l'application*.
Une page **publique et non localisée** n'a pas de catégorie — c'est la lacune.

## Le changement exact

Ajouter une **troisième catégorie**, sans toucher aux deux existantes :

```ts
// Chemins de SITE publics, NON localisés (projections du corpus).
const PUBLIC_NO_LOCALE = new Set(['records']);   // ou 'registry', selon (c)

export async function middleware(request: NextRequest) {
  const first = request.nextUrl.pathname.split('/')[1] ?? '';
  if (hasLocalePrefix(first)) return intlMiddleware(request);
  if (PUBLIC_NO_LOCALE.has(first)) return NextResponse.next();  // ← AJOUT
  if (RESERVED.has(first)) return appSession(request);
  return intlMiddleware(request);
}
```

**Pourquoi `NextResponse.next()` et non `appSession`** : une page publique n'a besoin
d'aucun rafraîchissement de session. Passer par `appSession` déclencherait un `getUser()`
sur chaque requête de chaque page du registre — un coût inutile, et un couplage entre le
corpus public et la couche d'authentification qui n'a aucune raison d'être.

**Placement** : après le test de locale, avant `RESERVED`. L'ordre importe peu ici (les
ensembles sont disjoints), mais le placer avant `RESERVED` rend l'intention lisible.

## Surface de régression — analysée segment par segment

| Chemin | Premier segment | Avant | Après | Touché ? |
|---|---|---|---|---|
| Les **11 pages** `/{en,fr,es}/…` | `en` `fr` `es` | `intlMiddleware` | `intlMiddleware` | **non** |
| Racine `/` | `''` | `intlMiddleware` → 307 `/en` | idem | **non** |
| Les **6 routes API** `/api/…` | `api` | `appSession` | `appSession` | **non** |
| `/p/{handle}` | `p` | `appSession` | `appSession` | **non** |
| `/frameworks/{id}/skills` | `frameworks` | `appSession` | `appSession` | **non** |
| `/dashboard`, `/emission`, `/passport` | réservés | `appSession` (garde) | idem | **non** |
| `/records/…` *(nouveau)* | `records` | `intlMiddleware` → 307 `/en/records/…` | `NextResponse.next()` | **oui, voulu** |

**Aucun chemin existant ne change de branche** : l'ajout n'intercepte qu'un segment qui
n'était servi par personne. Le risque est **structurellement borné** — à condition que le
segment choisi ne soit pas déjà utilisé, ce qui est vérifié (`/records` → 404 aujourd'hui).

⚠️ **Si l'option (ii) était retenue** (`registry`), la vérification serait la même — le
premier segment de `/en/registry` est `en`, pas `registry` — mais le risque de confusion
humaine à la lecture du middleware serait réel.

## Le vrai risque : **le middleware n'a aucun test unitaire**

Mesuré : le seul test qui le mentionne est `tests/integration/auth-callback-landing.integration.test.ts`
— un test d'intégration sur le retour d'authentification. **La logique d'aiguillage n'est
couverte par rien.** C'est ce qui rend le changement risqué, bien plus que le changement
lui-même.

## Comment le vérifier AVANT déploiement

1. **Extraire la décision d'aiguillage en fonction pure**, testable :
   ```ts
   export type RouteKind = 'intl' | 'app' | 'public';
   export function routeKind(pathname: string): RouteKind
   ```
   Le middleware n'appelle plus qu'elle. C'est un refactor de code prouvé — même discipline
   que l'extraction de `node-ref.mjs` : **prouver l'identité de comportement avant d'ajouter
   quoi que ce soit**, en écrivant d'abord le test sur l'état actuel.

2. **Matrice de test exhaustive**, écrite **avant** la modification et devant passer
   **inchangée** dessus : les 11 pages × 3 locales, la racine, les 6 routes API,
   `/p/{handle}`, `/frameworks/x/skills`, les 4 segments protégés, un segment inconnu — puis
   seulement, l'ajout des chemins `/records/…`.

3. **Contrôle du `matcher`** : `'/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'`
   exclut tout chemin à extension. Vérifier qu'aucun identifiant de Record n'en contient —
   c'est le cas (`OCR-110`, sans point), mais la règle doit être **testée**, pas supposée.

4. **Matrice `curl` après déploiement**, celle déjà utilisée en clôture de Phase A : les
   11 pages en 200, `/fr` et `/es` en 307, les 6 routes API en 200, la découverte de
   Framework inchangée (`wtf` → `reidentified`, `world-trader` → `canonical`, `wtr` → 404),
   plus les nouvelles adresses.

**Recommandation de séquencement** : livrer l'extraction et sa matrice de test en **premier
lot, seul**, avant toute page. On saurait alors que le filet existe avant d'y toucher.

---

# CE QUI RESTE À TRANCHER

1. **(a)** option A (bibliothèque) ou **option B** (rendu ciblé, zéro dépendance) — je
   recommande B.
2. **(b)** validation de la règle de dérivation ; et trois points qu'elle ne peut trancher :
   **la valeur de `robots` pour les Draft**, le **type JSON-LD**, et le statut des
   **étiquettes du gabarit de repli**.
3. **(c)** le nom de la porte d'entrée : **`/records`** (4 CTA s'activent, aucune collision)
   ou **`/registry`** (fidèle au vocabulaire, collision et 4 CTA morts).
4. **(d)** accord sur l'extraction de `routeKind` et sur le séquencement en lot séparé.

**Aucune ligne de code n'a été écrite.**
