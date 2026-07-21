# Dettes ouvertes — Registry & outillage

Registre des correctifs **identifiés, non appliqués**, chacun à traiter pour lui-même.
Un amendement traite une normalisation clairement identifiée : ce qui devient visible à
cette occasion est **inscrit ici**, pas embarqué dans le lot en cours.

Une entrée n'est jamais supprimée : elle est **close**, avec le motif de sa clôture.

---

## DETTE DOCUMENTAIRE — énumération hétérogène d'OCR-100

**Ouverte le** 2026-07-21, à l'occasion de l'amendement OCR-115 v1.1.0
(règle de précédence du Concept sur le Record).

**Constat.** OCR-100 (World Skills Protocol), section *Knowledge Graph Relationships*,
ligne 145 :

```
- `has_part` → Evidence, Trust, Framework, Identity, Verification, Issuer, Passport
```

Depuis l'application conjointe de la règle de résolution et de la déclaration du concept
`Framework`, cette énumération produit des cibles **de deux natures** :

| Terme | Résout vers | Pourquoi |
|---|---|---|
| `Framework` | `ext:framework` (concept) | titre de Record **et** concept déclaré → précédence du concept |
| `Evidence` | `OCR-110` (Record) | titre de Record, aucun concept déclaré de ce nom |
| `Trust` | `OCR-105` (Record) | idem |
| `Verification` | `OCR-107` (Record) | idem |
| `Issuer` | `OCR-120` (Record) | idem |
| `Passport` | `OCR-101` (Record) | raccourci `name_aliases` |
| `Identity` | `ext:identity` | titre **ambigu** (`ambiguous_aliases`), jamais résolu globalement |

Une même énumération désigne donc tantôt un concept, tantôt un Record — sans que rien
dans le texte ne signale la différence.

**Ce n'est pas un défaut de la règle.** La règle est cohérente ; c'est la **liste**
`protocol_concept` qui décide de sa portée. Aujourd'hui un seul titre de Record y figure
(`Framework`) : l'hétérogénéité vient de là, et non de la sémantique de résolution.

**À instruire.** Un chantier sur la classification des concepts : quels titres de Record
sont **aussi** des concepts déclarés, et l'énumération d'OCR-100 doit-elle être réécrite
pour lever l'ambiguïté (par exemple en portant les `(OCR-xxx)` explicites, qui priment
sur toute règle de résolution).

**Hors périmètre de l'amendement OCR-115 v1.1.0.** Aucune correction appliquée.

---

## DETTE OUTILLAGE — absence de `.gitattributes` (piège EOL récurrent)

**Ouverte le** 2026-07-21. **Quatrième occurrence** du même piège.

**Constat.** Le dépôt n'a **aucun `.gitattributes`** et tourne sous
`core.autocrlf=true` : les blobs sont en **LF**, le checkout Windows est en **CRLF**.
Or les checksums d'intégrité du corpus (`_manifest.json`, `MANIFEST-OCR.json`, golden)
sont des sha256 du **contenu LF**. Tout outil qui lit le disque brut produit des
checksums qui divergent **silencieusement** de la convention.

**Incidents comptés — quatre, tous coûteux :**

1. Régénération du manifeste lisant le disque CRLF → **17 checksums parasites**
   (faux positifs). *(réf. `docs/migration/MIG-wtf-to-wtr-2026-07-18.md`)*
2. Patch du manifeste via `subprocess.run(text=True)` → décodage cp1252 →
   **mojibake** des em-dash ; corrigé en lecture d'octets.
3. Normalisation LF de tous les Records **sur le disque** → **18 diffs EOL parasites** ;
   annulée.
4. **2026-07-21** — correction des 11 checksums périmés : la normalisation du corpus
   sur disque a fait marquer **33 fichiers « modifiés »** par `git status` alors que
   `git diff` est **vide**. Contournement : génération sur un **miroir LF hors dépôt**,
   puis rétablissement manuel de `generated_from` sur le chemin canonique.

Le contournement fonctionne mais doit être **redécouvert à chaque fois**, et il impose
une retouche manuelle dans un artefact d'intégrité — exactement ce qu'on cherche à éviter.

**Correction proposée.** Un `.gitattributes` à la racine :

```
*.md text eol=lf
```

Les Records seraient alors **LF sur disque comme en blob**, les générateurs pourraient
lire le disque directement, et le piège disparaîtrait définitivement.

**Pourquoi ce n'est pas un correctif qu'on glisse dans un lot en cours.** Il
normaliserait **33 Records d'un coup**, ce qui touche leur représentation sur disque et
impose de revérifier les checksums de l'ensemble du corpus. C'est un changement de
convention de dépôt : il se traite pour lui-même, avec sa propre preuve.

**✅ CLOSE le 2026-07-21** — après un **cinquième** incident (URLs de vérification
écrites en CRLF, harnais rapportant « 0 / 92 »). Correctif d'une ligne :
`* text=auto eol=lf`, plus la liste des binaires jamais convertis.

Ce qui bloquait était la crainte de toucher les 33 checksums. La mesure l'a écartée :
les **blobs étaient déjà en LF**, seul le disque était en CRLF. `git add --renormalize .`
n'a modifié aucun blob. Après conversion de l'arbre de travail :

```
corpus sur disque                  LF 33 / CRLF 0
checksums conformes au manifeste   33 / 33
lecture du DISQUE BRUT == checksum du manifeste : OUI
```

Le contournement par miroir LF hors dépôt, avec rétablissement manuel de
`generated_from`, n'est plus nécessaire.

---

## ✅ CLOSE PAR DÉCISION ÉDITORIALE — l'emphase en gras des archétypes

**Ouverte** le 2026-07-21 (transcription des archétypes Phase A) · **close** le même jour.

**Le constat.** Les textes de l'architecte portent du gras d'insistance — « The graph does
**not** contain operational data ». Le modèle des archétypes (`lib/content/archetype.ts`)
ne transporte que du texte : les **mots** sont verbatim, le **style** est perdu. `GeoPage`
sait projeter l'italique d'un Record ; l'équivalent n'existe pas pour les archétypes.

**La décision, verbatim :**

> « Si la fabrique ne restitue pas le gras, j'écrirai désormais des textes qui restent
> parfaitement lisibles sans emphase typographique. La hiérarchie doit être portée par la
> structure ; l'emphase ne doit jamais porter le sens. »

**Rien n'est ajouté à la fabrique.** La dette n'est pas reportée, elle est **close** : le
besoin disparaît au lieu d'être satisfait. Si la fabrique venait un jour à prendre le gras,
les textes en bénéficieraient **sans en dépendre** — c'est la propriété recherchée.

Aucune ligne de code n'a été écrite au titre de cette entrée.

---

## DETTE ÉDITORIALE — le lien cross-registre depuis une page localisée

**Ouverte le** 2026-07-21, à l'occasion de l'extension d'`entityHref` (Lot GEO 2).

**Constat.** Depuis l'extension de la chaîne de résolution, **64 pastilles d'entités**
des pages piliers mènent à une page Record. Le lien est **techniquement valide** — la
page existe, elle répond 200, et aucun `href` ne pointe vers une page non générée.

Mais il fait franchir au lecteur **deux frontières à la fois** : il quitte le régime
localisé `/{locale}/…` pour le régime canonique `/records/…`, et passe d'une **fiche
éditoriale** à une **projection documentaire brute**. Rien n'a encore décidé si un
lecteur d'une page pilier doit être conduit vers le corpus, ni comment l'y préparer.

**Déclaré comme lacune, pas comme acquis** : chaque lien émet `cross-locale-link:{id}`
dans `_gaps` — journal de build, jamais rendu. Le compte y est visible page par page.

**À qualifier éditorialement.** Aucune correction appliquée : le lien reste actif, la
lacune reste ouverte.

---

## HORS PÉRIMÈTRE (rappel) — les 2 `alias_self_loop`

```
OCR-100 --is_a--> OCR-100    raw: `is_a` → Protocol
OCR-114 --is_a--> OCR-114    raw: `is_a` → Record / Fact
```

Ces deux auto-boucles proviennent du mécanisme `name_aliases` (`Protocol` → OCR-100,
`Fact` → OCR-114), **non** de la résolution par titre. La règle de précédence gravée le
2026-07-21 ne les couvre pas et ne les corrige pas — mesuré, y compris en l'étendant aux
alias : ni `Protocol` ni `Fact` n'est un concept déclaré.

Leur correction suppose deux décisions distinctes : déclarer ces libellés comme concepts,
**et** étendre la règle aux raccourcis. À instruire séparément.
