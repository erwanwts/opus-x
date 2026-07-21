# LOT GEO 2 — REGISTRY PUBLIC · dossier de conception

> **CONCEPTION SEULEMENT.** Aucun code, aucune page, aucun artefact généré. Toutes les
> valeurs ci-dessous sont **mesurées** sur l'état du dépôt à la date, en lecture seule.
> Les trois questions doctrinales sont **instruites, non tranchées**.

**Date** : 2026-07-21 · `main` à `1022cc7` · graphe `4b39afcc3ebd` · corpus 33 Records.

**Règle du plan GEO qui gouverne ce lot** : *« le contenu éditorial ne doit pas recréer
manuellement la vérité, il doit consommer les artefacts publiés. »*

---

# 1 · LA SOURCE — ce que servent les trois routes

## `/api/registry/[id]` — **sert le CORPS, pas seulement les métadonnées**

`lib/registry/api.ts` → `recordDetail(id)` :

| Champ | Contenu |
|---|---|
| `_meta` | triptyque de versions + fichier source |
| `id` | `OCR-nnn` |
| `title` | H1 du Record |
| `checksum` | sha256 (blob LF) |
| `metadata` | **tous** les champs du tableau d'en-tête, tels quels |
| `sections` | **TOUTES les sections, en markdown brut** |

**C'est le fait le plus important de ce dossier.** Le commentaire du code est explicite :
`sections: doc.sections, // TOUTES les sections, markdown brut`. Le corps intégral du
corpus est **déjà exposé publiquement**, en JSON, sans authentification. Une page
`/registry/ocr-110` ne serait donc pas la première duplication du corpus — **l'API en est
déjà une**. Cela déplace la question (a) : la doctrine n'a pas à décider *s'il faut* une
seconde surface, mais *ce qu'est* une surface qui existe déjà.

## `/api/registry` — index, **métadonnées seules**

`registryIndex()` : `id` · `canonical_id` · `name` (titre sans le préfixe `OCR-nnn —`) ·
`version` · `status` · `normative_informative` · `checksum` · `href` (vers l'API).
Aucune section, aucun corps. 33 entrées + un `_meta` et un `count`.

## `/api/concepts/[slug]` — projection du graphe, **jamais du corps**

`conceptDetail(slug)` : `slug` · `name` · `classification` (`node_type`, `canonical`,
`registry_entry`, `specialization_of`) · `records` (Records qui portent le concept) ·
`relations` (`out` / `in` / `via`, avec prédicat et stabilité sémantique) ·
`definition: null` · `alias: null` · `semantic_status: null` — **explicitement nuls**, avec
un `_gaps` qui les liste. La discipline « jamais fabriqué » est déjà appliquée là.

> ⚠️ **Un engagement déjà pris dans le code, à ne pas contredire.** `conceptDetail` émet
> `geo_page: { planned: true, href: '/concepts/${slug}' }`. **L'API annonce déjà une page
> future — à `/concepts/{slug}`, sans préfixe de locale.** Ce lot doit soit honorer cette
> adresse, soit la corriger. La laisser diverger créerait une promesse fausse servie par
> une API publique.

---

# 2 · LE PÉRIMÈTRE RÉEL

## Records — 33, et **100 % en `Draft`**

```
lifecycle_status : {'Draft': 33}
```

**Aucun Record n'est `Normative`.** Les 33 portent des *sections* normatives
(`normative_informative` renseigné sur 33/33), mais leur **statut documentaire** est
`Draft` sans exception. La question (b) n'est donc pas marginale : elle porte sur
**l'intégralité** du registre.

Nuance de périmètre : le manifeste couvre **33** Records ; le graphe n'en projette que
**26** (`node_type: record`, plage `OCR-1xx`). Les 7 Records de gouvernance
`OCR-000..006` sont adressables par l'API mais **absents du graphe** — ils n'auront donc ni
relations ni voisinage à afficher.

## Prédicats — 103 formes de surface, **37 identifiants distincts**

```
predicate_id distincts : 37
statuts  : Alias 36 · Derived 33 · Domain 21 · Canonical 8 · Rejected 5
emit_edge=true : 98
```

Une page **par `predicate_id`** donne **37**. Une page par forme de surface donnerait 103,
dont 36 alias et 33 formes dérivées — c'est-à-dire 69 pages qui ne sont que des vues d'un
même prédicat. **Décision de granularité requise** ; elle n'est pas tranchée ici.

## Familles — 15 nommées

`Reference · Structural · Governance · Production · Resolution · Lifecycle · Provenance ·
Computation · Ownership · Verification · Consumption · Dependency · Conceptual ·
Projection · Temporal` — plus **5 entrées sans famille** (`null`), qui n'en forment pas une.

## Types — 6

`protocol_concept` (42) · `record` (26) · `entity` (6) · `external_prior_art` (3) ·
`technical_dependency` (2) · `ambiguous_alias` (1).

## Compte total

| Famille de pages | Nombre |
|---|---:|
| Records | **33** |
| Prédicats (par `predicate_id`) | **37** |
| Familles de prédicats | **15** |
| Types de nœuds | **6** |
| **TOTAL** | **91 pages** |

En granularité maximale (une page par forme de surface de prédicat) : **157**.

---

# 3 · LA FABRIQUE — deux objets différents, pas un

**`pillarPage.tsx` ne peut pas servir.** Ce n'est pas une question de commodité mais de
nature.

| | Page pilier | Page Record |
|---|---|---|
| Contenu | prose **gravée** par l'architecte, projetée par section canonique | **projection intégrale** d'un artefact |
| Structure | 15 sections dans un **ordre canonique figé**, chacune omise si vide | structure **variable**, propre à chaque Record |
| Source | un Record **+ un CTA éditorial gravé** | un artefact, **rien d'éditorial** |
| Titre, description | titre canonique + `GEO Summary` | à dériver — **aucun texte éditorial n'existe** |
| Traçabilité | `_gaps` = sections canoniques sans source | sans objet : il n'y a pas de gabarit à remplir |

Une page pilier **interprète** un Record selon un gabarit éditorial ; une page Record
**restitue** un artefact. La première a une prose, la seconde n'en a pas et n'en aura
jamais — sauf à en écrire, ce que le lot s'interdit.

**Conséquence** : une **troisième fabrique**, à côté de `pillarPage` (fiches concept) et
`archetypePage` (archétypes éditoriaux). Le dépôt en compterait trois, ce qui est cohérent
avec la mesure : trois natures de page, trois fabriques.

Ce qui est **réutilisable tel quel** : `pageMetadata`, `JsonLd` et ses constructeurs,
`ctaHref` / `entityHref` (RD-001), `guardArchetypeLocale` si la locale s'applique.

---

# 4 · LE MAILLAGE — **64 pastilles inertes s'activeraient**

Mesure sur les 7 pages piliers (les 4 archétypes n'ont pas de liens d'entités) :

| Page | Liens | Actifs | **Inertes** |
|---|---:|---:|---:|
| /en/world-skills-protocol | 25 | 6 | **19** |
| /en/evidence | 17 | 5 | **12** |
| /en/trust | 16 | 5 | **11** |
| /en/verification | 13 | 5 | **8** |
| /en/professional-passport | 11 | 4 | **7** |
| /en/frameworks | 11 | 4 | **7** |
| /en/registry | 1 | 1 | 0 |
| **TOTAL** | **94** | **30** | **64** |

**64 pastilles inertes sur 94 — soit 68 % des liens d'entités du site actuellement morts.**
Elles pointent vers **19 Records distincts** : OCR-102, 103, 104, 106, 108, 109, 111, 112,
113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 125.

C'est le gain de maillage, et il est considérable : le site passerait de 30 à 94 liens
d'entités actifs.

**`entityHref` doit-il être étendu ?** Oui, mais **pas modifié**. Aujourd'hui :

```ts
export function entityHref(ocrId: string, locale: string): string | null {
  const p = PILLARS.find((x) => x.recordId === ocrId && x.translatedLocales.includes(locale));
  return p ? `/${locale}/${p.slug}` : null;
}
```

Il ne connaît que `PILLARS`. Deux voies, **non tranchées** :

- **(i) inscrire les 33 Records dans `PILLARS`** — le résolveur fonctionne sans une ligne
  de code modifiée, et le sitemap les prend automatiquement. Mais `PILLARS` deviendrait un
  registre hétérogène (7 fiches concept + 4 archétypes + 33 Records), et son type
  `ctaLabel` n'a aucun sens pour un Record ;
- **(ii) une seconde table, et une résolution en cascade** — `entityHref` chercherait
  d'abord un pilier, puis un Record. Plus propre sémantiquement, mais RD-001 exige alors
  que la cascade reste **une seule source de vérité** et non deux résolveurs concurrents.

Un point à ne pas manquer : **une pastille qui s'active change la destination éditoriale**.
Aujourd'hui `OCR-114` est du texte brut ; demain il mènerait à une page. Si cette page
affiche un Draft, le lecteur d'une page pilier validée atterrit sur un document non
validé — c'est le croisement des questions (b) et du maillage.

**`/en/registry` (OCR-124) n'a qu'un seul lien d'entité.** La page pilier du registre est
donc, en l'état, presque coupée du registre qu'elle décrit. Son articulation avec
`/registry/[id]` relève de l'éditorial : elle n'a aucun index, aucune liste, aucun renvoi
généré. Un index des Records est **à concevoir** ; il n'existe nulle part.

---

# 5 · L'ÉCHELLE

| | Aujourd'hui | Après ce lot |
|---|---:|---:|
| **URLs au sitemap** | 11 | **102** (11 + 91) |
| Pages statiques générées | 199 | **290** (EN seul) ou **472** (3 locales pré-générées) |

Le build actuel produit 199 pages en ~3 s de compilation. Il porte déjà **122 routes
préchargées** pour `/api/concepts` et `/api/graph` — l'ordre de grandeur visé est donc
**déjà atteint** côté API, sans difficulté.

**Y a-t-il un seuil ?** Pas à cette échelle. Les difficultés de génération statique
apparaissent à plusieurs milliers de pages ; 290 à 472 en est très loin. Le vrai coût est
ailleurs :

- **le sitemap passe de 11 à 102 URLs** — la proportion s'inverse : le site public devient
  majoritairement du registre, et 11 pages éditoriales se retrouvent noyées dans 91 pages
  d'artefacts. C'est une décision **éditoriale et SEO**, pas technique ;
- **91 pages sans prose** — chacune sans `title` ni `description` éditoriale. Il faudra les
  **dériver** de l'artefact, et cette dérivation est une règle à graver, pas un détail
  d'implémentation.

---

# 6 · LA LOCALE — la cohérence impose l'absence de préfixe, et le routage l'exige

**Le fait** : un Record est en anglais et le restera. Il n'est pas traduit ; il n'est pas
traduisible sans devenir une seconde représentation canonique (cf. question a).

**L'état du dépôt** — trois régimes coexistent déjà :

| Régime | Exemple | Comportement |
|---|---|---|
| Fiche concept | `/[locale]/evidence` | EN seul ; autre locale → **404** |
| Archétype | `/[locale]/questions` | EN rendu ; `/fr` `/es` → **307** vers `/en` |
| **Sans locale** | `/api/…`, `/p/[handle]`, `/frameworks/[id]/skills` | aucun préfixe |

**Ce que la cohérence impose** : un Record relève du **troisième** régime. Lui donner un
préfixe de locale reviendrait à annoncer une traduction qui n'existera pas — et la garde
d'archétype produirait `/fr/registry/ocr-110 → 307 → /en/registry/ocr-110`, c'est-à-dire
une redirection permanente vers un document qui n'a jamais eu d'autre langue. La
redirection y serait **doctrinalement fausse**, exactement comme l'était le 301
`wtf → world-trader`.

L'API le dit déjà : `geo_page.href = '/concepts/{slug}'`, **sans locale**.

> ⚠️ **CONTRAINTE DE ROUTAGE MESURÉE — décision requise.** Le middleware fonctionne ainsi :
>
> ```ts
> if (hasLocalePrefix(first)) return intlMiddleware(request);
> if (RESERVED.has(first)) return appSession(request);
> return intlMiddleware(request);   // ajoute la locale (307)
> ```
>
> `RESERVED` = `dashboard, emission, establish, verify-email, passport, link, me, p,
> passports, auth, api, frameworks, issuers`. **`registry` n'y est pas.**
>
> Conséquence : `/registry/ocr-110` serait **redirigé en 307 vers `/en/registry/ocr-110`**
> par next-intl. L'adresse sans locale **n'est pas atteignable** en l'état.
>
> Ajouter `registry` à `RESERVED` l'enverrait vers `appSession` — la garde de session de
> l'application, ce qui n'est pas davantage le comportement voulu pour une page publique.
>
> **Le middleware devrait donc être amendé** : c'est du code prouvé, sur le chemin de
> toutes les requêtes. Ce n'est pas un détail du lot — c'en est probablement le point le
> plus risqué, et il ne doit pas être traité en passant.

---

# QUESTIONS DOCTRINALES — instruites, non tranchées

## (a) PROJECTION OU DUPLICATION ?

### Ce que le corpus dit déjà

**OCR-006, Principe 1** (Draft) — Canonical Statement :

> « The definition is the normative object. A canonical representation is one of the
> published expressions of that definition. A logical definition is never multiplied by the
> number of representations expressing it. »

Et sa conséquence normative :

> « Publishing an additional canonical representation SHALL NOT be interpreted as creating,
> modifying or superseding the logical definition it expresses. »

**OCR-123 (Professional Profile)** donne au corpus son seul traitement développé d'une
**projection** — et il est directement transposable :

> « **Projection** — a derived view, not a store. » *(§ Terminology)*
>
> « A Profile is a projection, not a store. […] A Profile is reproducible under the same
> disclosure and version. A Profile goes stale as facts/disclosure change. »
>
> « A Profile **MUST NOT** be treated as a permanent, authoritative credential; prefer
> reprojection. »

Le corpus possède donc **un modèle éprouvé** de la vue dérivée : elle présente, elle ne
stocke pas ; elle est reproductible ; elle **périme** ; elle ne doit jamais être prise pour
l'original. Attention : OCR-123 parle d'un **Profile**, pas d'une page web de Record. C'est
une **analogie disponible**, pas une règle applicable — la transposer est précisément la
décision demandée.

### Le fait qui reformule la question

**Le corps du corpus est déjà servi publiquement** par `/api/registry/[id]`. Si une page
web est une seconde représentation canonique, alors **l'API en est déjà une** et le
problème est antérieur à ce lot. Si elle n'en est pas une, il reste à dire ce qui distingue
une vue d'une représentation — et le critère ne peut pas être le format, puisque le
markdown brut circule déjà en JSON.

### Les deux lectures

- **Vue dérivée** — la page est au Record ce que le graphe est au corpus : une projection,
  reproductible, sans autorité propre. Cohérent avec la page Knowledge Graph
  (*« The protocol remains the source. The graph remains its projection. »*). Impose une
  mention explicite de non-autorité et un renvoi vers la source.
- **Seconde représentation canonique** — elle relèverait alors du Principe 1 : elle ne
  crée ni ne modifie la définition logique, mais elle **doit être versionnée et
  identifiée** comme telle, et son ajout devient un acte de publication.

**Non tranché.** La distinction commande tout le reste : la mention portée par la page, la
politique de versionnement, et le traitement des Draft.

## (b) LES RECORDS EN DRAFT

**Le fait mesuré : 33 sur 33 sont en `Draft`.** Il n'y a pas une exception à gérer — la
question porte sur **la totalité** du registre public envisagé. Un registre qui exclurait
les Draft serait **vide**.

Trois voies, avec leurs conséquences :

| Voie | Conséquence |
|---|---|
| **Publier avec mention de statut** | Le registre existe. Chaque page porte `Draft` de façon non ambiguë. Risque : un document non validé devient citable et indexable ; les 64 pastilles activées mèneraient depuis des pages validées vers des Draft. |
| **Exclure les Draft** | Registre vide aujourd'hui. Le lot n'a pas d'objet tant qu'OCR-006 et les autres ne sont pas promus. Cohérent, mais reporte le lot entier derrière le chantier de relecture. |
| **Publier en `noindex`** | Le registre existe et maille le site (les 64 pastilles s'activent) sans entrer dans l'index des moteurs. Précédent au dépôt : la décision **WEB-D3** applique déjà `noindex` aux textes juridiques non validés. |

La troisième voie a un précédent interne ; c'est un argument, pas une décision.

**Point de vigilance** : la mention de statut n'est pas décorative. Si (a) conclut à une
seconde représentation canonique, publier un Draft revient à **publier une représentation
canonique d'un document non validé** — ce qui est une contradiction dans les termes.
Les deux questions ne peuvent pas être tranchées séparément.

## (c) LE CORPS OU LES MÉTADONNÉES ?

### Option 1 — page intégrale (métadonnées + toutes les sections)

- Le lecteur lit le Record sans quitter le site ; valeur GEO et LLM maximale (le corpus
  devient lisible par les moteurs et les agents, ce qui est l'objectif même du plan GEO).
- **Renforce (a)** : la page contient tout ce que contient la source. La distinguer d'une
  représentation canonique devient difficile à soutenir.
- **91 pages de contenu dense** entrent au sitemap ; le site devient majoritairement du
  corpus.
- Le corps est du markdown brut : il faut un rendu, donc des **règles de projection**
  (titres, listes, tableaux, blocs de code) — c'est-à-dire une fabrique de rendu markdown
  que le dépôt n'a pas, et qu'il a jusqu'ici **délibérément évitée**
  (« Zéro dépendance markdown » — plan GEO 1a).

### Option 2 — page d'identité (identité, statut, version, relations, lien vers la source)

- **Affaiblit (a)** : la page est manifestement une fiche d'index, pas une représentation
  du document. La question de la duplication ne se pose plus dans les mêmes termes.
- Le maillage fonctionne **intégralement** : les 64 pastilles s'activent, les relations du
  graphe sont affichées, chaque page renvoie à `/api/registry/{id}` pour le corps.
- Aucun rendu markdown nécessaire — tout vient de champs déjà structurés
  (`metadata`, `relations`, `checksum`).
- **Moins de valeur GEO** : le contenu substantiel reste dans un JSON, que les moteurs
  indexent mal. L'objectif du plan — exposer le corpus — n'est atteint qu'à moitié.
- Une nuance qui atténue l'objection : le corps **reste accessible** via l'API, sans
  authentification. L'option 2 ne cache rien, elle **ne redouble pas**.

### Ce que les deux options ont en commun

Aucune ne peut inventer un titre ni une description éditoriale : il n'en existe pas. Les
deux imposent une **règle de dérivation** des métadonnées de page depuis l'artefact, à
graver — sans quoi 91 pages porteraient un texte fabriqué, ce que la discipline du dépôt
interdit.

---

# CE QUI DOIT ÊTRE TRANCHÉ AVANT TOUT CODE

1. **(a)** vue dérivée ou seconde représentation canonique — commande tout le reste.
2. **(b)** Draft : publier avec mention, exclure, ou `noindex`. Indissociable de (a).
3. **(c)** corps intégral ou fiche d'identité.
4. **Adresse et locale** — `/registry/{id}` sans préfixe suppose un **amendement du
   middleware** (code prouvé, sur toutes les requêtes). Et l'adresse déjà annoncée par
   l'API pour les concepts est `/concepts/{slug}` : la contredire créerait une promesse
   fausse.
5. **Granularité des prédicats** — 37 identifiants ou 103 formes de surface.
6. **Extension d'`entityHref`** — inscrire les Records dans `PILLARS`, ou cascade à deux
   tables. RD-001 exige une source de vérité unique.
7. **Règle de dérivation** des `title` / `description` des 91 pages, aucune prose
   n'existant.
8. **Index des Records** — il n'existe nulle part ; `/en/registry` n'a qu'un lien d'entité.

**Aucune ligne de code n'a été écrite. Aucun artefact n'a été régénéré.**
