# TROIS MESURES — frontière en-tête/corps · répartition de promotion · verrouillage terminologique

> **MESURE, LECTURE SEULE.** Aucun fichier du dépôt n'a été modifié. Aucune procédure n'est
> proposée, aucune promotion recommandée.

**Date** : 2026-07-21 · corpus 33 Records · `main` + branche `web/web-003-lot-geo-2`.

---

# 1 · FRONTIÈRE EN-TÊTE / CORPS

## La structure est régulière sur les 33 Records

| Élément | Position | Régularité |
|---|---|---|
| H1 `# OCR-nnn — Label` | **ligne 0** | **33/33** |
| Tableau de métadonnées | lignes 2→12/13 (4→14 pour OCR-006) | **33/33** |
| Règle `---` | ligne 14 à 17 selon le Record | **33/33** |

**Le délimiteur existe et il est constant : la première règle `---` du fichier.** Aucun
Record n'en est dépourvu. Il n'y a donc rien à définir — seulement à constater.

## Une seule ambiguïté, dans un seul Record

**OCR-006** est le seul à porter du contenu **entre le H1 et le tableau** :

```
*Normative architectural constraints gov…*
```

Chez les 32 autres, le tableau suit immédiatement le H1. Si la frontière se définit comme
« tout ce qui précède la première `---` », cette ligne d'OCR-006 tombe **dans l'en-tête**
alors qu'elle est du texte éditorial. C'est le seul cas, et il concerne le Record déjà
signalé comme jamais relu.

## ⚠️ 17 Records sur 33 portent un bloc explicitement marqué « à retirer à la publication »

Entre le tableau et la première `---`, **17 Records** contiennent :

> **Grounding note (removed at publication).** …

Ce bloc **dit lui-même** qu'il ne doit pas être publié. Il se situe **avant** le délimiteur
`---`, donc du côté en-tête — ce qui, s'il est retenu comme frontière, l'exclut
naturellement du corps publié. **C'est un argument mesuré en faveur de ce délimiteur**, et
il n'avait pas été anticipé.

Si à l'inverse la frontière était placée à la fin du tableau, ces 17 notes entreraient dans
le corps publié — et 17 pages de Registry afficheraient un texte qui demande sa propre
suppression.

## Combien d'empreintes changent — **les 33**

```
checksum ACTUEL == sha256(fichier entier)      : 33/33
checksum du CORPS SEUL ≠ checksum actuel       : 33/33
```

Redéfinir l'empreinte sur le corps seul **change les 33 empreintes**, sans exception. Ce
n'est pas un effet de bord : c'est la conséquence directe de ce qui a été mesuré au dossier
de promotion — le hachage porte aujourd'hui sur `readFileSync(full)`, donc sur l'en-tête
autant que sur le corps.

## Qu'est-ce qui casse

| Artefact | Effet |
|---|---|
| `_manifest.json` | 33 `checksum_sha256` à régénérer |
| `MANIFEST-OCR.json` | 33 `sourceChecksum`, dérivés du précédent |
| Contrôle d'intégrité | **aucun n'existe** — rien n'échouerait, l'écart serait silencieux |
| `/api/registry/[id]` | sert `checksum` depuis le manifeste : la valeur servie changerait |
| Moteur de rendu (Lot B) | **aucun effet** — il ne consomme pas le checksum |

**Ce que la frontière déciderait, au-delà de la technique** : si l'empreinte porte sur le
corps seul, une promotion (`Draft → Validated`) **ne la modifie plus** — la question ouverte
du dossier de promotion se referme d'elle-même. Si elle porte sur le fichier entier, chaque
promotion change 1 empreinte. Le choix de la frontière **est** la réponse à la question
« l'empreinte représente-t-elle le contenu canonique ou l'artefact documentaire ». Ce
dossier ne la tranche pas.

---

# 2 · DOSSIER DE PROMOTION — nouvelle répartition

**Critère gravé** : *« Records dont le contenu normatif est stable depuis leur dernière
révision substantielle et qui ne portent aucune dette documentaire ouverte. »*

Ce critère **remplace** celui de l'ancienneté, qu'aucun Record ne pouvait satisfaire (le
corpus a 5 jours). Il déplace le discriminant de la **date** vers la **dette ouverte**.

## Répartition : **30 · 2 · 1** *(auparavant 16 · 15 · 2)*

| Phase | Records | Motif mécanique |
|---|---:|---|
| **1 — stables** | **30** | stables depuis leur dernière révision · aucune dette ouverte |
| **2 — dette documentaire ouverte** | **2** | OCR-100, OCR-114 |
| **3 — jamais relu** | **1** | OCR-006 |

### Pourquoi 15 Records passent de la Phase 2 à la Phase 1

Les 11 Records rectifiés par `62027b4` et les 4 de la migration `wtf → wtr` étaient en
Phase 2 sous l'ancien critère, **parce qu'ils avaient été modifiés**. Sous le nouveau,
ce qui compte est la **dette ouverte** — or leurs rectifications sont **closes** :
le corpus a été corrigé (`62027b4`), et les deux manifestes régénérés (`1c9ffa3`). Aucune
dette ne subsiste sur eux.

**OCR-115**, amendé hier (v1.1.0), entre en Phase 1 : son amendement est complet, committé,
et ne laisse aucune dette. Il est stable depuis sa dernière révision substantielle.

### Les 2 Records de Phase 2

| Record | Dette ouverte |
|---|---|
| **OCR-100** | énumération hétérogène (§ KG ligne 145) **et** `alias_self_loop` — les deux explicitement « à instruire », non corrigées |
| **OCR-114** | `alias_self_loop` — explicitement « hors périmètre », non corrigé |

### Le Record de Phase 3

**OCR-006** — jamais relu formellement, **absent de la synthèse de grounding** (0 mention ;
il a été créé après), sans `Canonical Name` ni `GEO Summary`. Il reste le seul à ne pas
satisfaire la précondition d'OCR-005 : *« `Draft → Normative` MUST require grounding »*.

### Un Record qui change de phase et mérite d'être signalé

**OCR-123** était en Phase 3 sous l'ancien critère — seul Record que **personne ne cite**.
Le nouveau critère ne retient que la stabilité et la dette : n'étant l'objet d'aucune dette
documentaire, il entre en **Phase 1**. Le fait qu'il ne soit jamais cité **subsiste** ; il
n'est simplement plus discriminant. Je le signale pour que la bascule soit un choix, pas un
effet de bord.

---

# 3 · FAISABILITÉ DU VERROUILLAGE TERMINOLOGIQUE

## La liste est dérivable — de trois sources déjà publiées

| Source | Termes |
|---|---:|
| Titres de Record (H1) | 33 |
| Concepts déclarés du graphe | 42 |
| Definienda des sections `## Terminology` | **111** |
| **UNION dédupliquée** | **152** |

**Oui, la liste est dérivable**, sans rédaction et sans hypothèse : les trois sources sont
déjà publiées et déjà exploitées par le dépôt. Les 111 definienda de Terminology sont la
source la plus riche — et la moins exploitée jusqu'ici : l'audit terminologique n'en
retenait que ceux qui étaient aussi des concepts du graphe.

## Combien sont aussi des mots anglais courants — **60 sur 64**

Sur les 152 termes, **64 tiennent en un seul mot**. De ceux-là, **60 sont également
employés en minuscules** ailleurs dans le corpus, hors sections `Keywords`/`SEO` et hors
blocs de code — c'est-à-dire comme mots anglais ordinaires :

```
Acceptance · Accountability · Answer · Attribution · Authorization · Binding
Capability · Certification · Competency · Computation · Consent · Coordinate
Criterion · Derivation · Determinism · Digest · Disclosure · Entity · Evidence
Framework · Grounding · Holder · Identifier · Identity · Index · Input
Interpretation · Issuer · Layer · Level · Mapping · Organization · Owner
Process · Professional · Projection · Provenance · Query · Recomputation
Record · Resolution · Revocation · Role · Scope · Skill · Stage · Standard
Status · Subject · Supersession · Trust · Verification · Verifier · Version …
```

**Seuls 4 termes d'un seul mot ne sont jamais employés en minuscules** — donc verrouillables
sans ambiguïté par simple correspondance de chaîne.

## Ce que cela implique pour la faisabilité

Un verrouillage par **correspondance littérale** est **irréalisable** : il produirait des
faux positifs sur 60 termes, y compris les plus centraux — `Evidence`, `Trust`, `Framework`,
`Record`, `Identity`. Le corpus lui-même emploie ces mots dans les deux registres, souvent
dans la même phrase.

Un verrouillage **sensible à la casse** réduit le bruit sans l'éliminer : la capitale de
début de phrase est indiscernable de la capitale terminologique — c'est exactement l'écueil
qui a fait passer le balayage de la Qualification Review de 117 candidats bruts à 39 après
filtrage des majuscules de position.

Les **88 termes de plusieurs mots** (152 − 64) sont, eux, verrouillables sans ambiguïté :
`Immutable Fact`, `Evidence Link`, `Canonical Registry`, `Professional Passport`…

**La faisabilité n'est donc pas uniforme** : elle est acquise pour 88 termes + 4 termes
simples, soit **92 sur 152**, et exige une règle de désambiguïsation pour les **60 autres**.
Ce dossier ne propose pas cette règle.

---

**Aucun fichier du dépôt n'a été modifié par ces mesures.**
