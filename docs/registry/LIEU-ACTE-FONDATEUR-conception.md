`docs/registry/LIEU-ACTE-FONDATEUR-conception.md` · conception · 2026-07-25 versée en `44824a3`

# Le lieu de l'acte fondateur — CONCEPTION (étape 3 partielle, précède l'étape 0)

> **Conception seule, rien d'écrit, rien construit.** Le lieu doit porter la **ratification fondatrice**
> (D-019) **sans en dépendre** : il ne peut pas être un OCR ratifié par l'acte qu'il contient (re-circularité).
> La ratification **elle-même** attend une décision **hors de ce chantier** (Opus X). Ici : **où** l'acte
> s'inscrit, **quelle forme**, **quel contenu**, et **comment le résolveur le lit** au même titre qu'un PROMO.

## 1 — La contrainte qui décide tout : hors du corpus ratifiable

L'acte déclare `{OCR-000, OCR-005}` Normative. Il ne peut donc vivre :
- **ni dans OCR-000/005** (ils sont ce qu'il ratifie) ;
- **ni dans un autre OCR** (tous Draft, aucun autoritatif — et le rendre autoritatif exigerait… un acte
  fondateur : régression) ;
- **ni via un PROMO** (D-020 : la ratification est d'une **autre nature** ; et le PROMO présuppose le
  grounding + l'approbation *ordinaire*, que l'amorçage précède).

⇒ **Le lieu est un registre d'une nature distincte, hors de la série OCR et hors de la série PROMO.** Son
autorité ne vient **pas** d'un statut Normative, mais de la **signature Opus X** — la seule autorité que le
corpus pose comme **antérieure/externe** (`OCR-000:35` « Opus X … holds sole write authority over canonical
meaning »). **C'est l'unique point où une autorité extra-corpus est admise**, précisément pour briser
l'amorçage.

## 2 — Forme et lieu

- **Nature :** un **fait fondateur** — objet immuable, append-only (même discipline que P2/P5 : jamais
  modifié, corrigé par addition ; une révocation serait un **second fait**, cf. D-013).
- **Série dédiée :** `RATIF-xxx` (comme `PROMO-xxx` fut déclarée hors plage par D-004), avec sa **garde de
  plage** — les ids `RATIF` sont **hors** des plages OCR et PROMO. `RATIF-001` = la ratification fondatrice.
- **Où il vit :** `content/registry/founding/` (répertoire dédié, **hors** `OCR-100/`), lisible par le
  résolveur au même endroit qu'il lira les PROMO. **Pas** un `.md` d'OCR ; un artefact de registre à
  front-matter machine-lisible (ou `.json`), car sa fonction première est d'être **lu comme un fait de
  statut**.

## 3 — Contenu (front-matter du fait `RATIF-001`)

```
id:            RATIF-001
kind:          founding-ratification        # ≠ "promotion" (D-020 : autre nature)
declares_normative: [OCR-000, OCR-005]        # PLURIEL — plusieurs Records en un acte
authority:     Opus X                          # la signature fondatrice
signature:     <signature Opus X>              # l'acte est SIGNÉ (D-019)
date:          <date>                          # l'acte est DATÉ (D-019)
basis:         OCR-000:35                      # l'autorité invoquée (extra-corpus)
ordinary_process: false                        # HORS processus ordinaire (D-019)
immutable:     true                            # append-only ; révocation = second fait
```

- **Pluriel `declares_normative`** — c'est la **différence de nature** avec le PROMO (`record:` **singulier**,
  D-016). Le fait fondateur nomme **deux** Records d'un coup ; le PROMO en nomme **un**.
- **Pas de `grounding_verdict`** — l'amorçage est **hors** de la porte grounding (elle-même Draft). Sa
  validité tient à la **signature**, pas au verdict doc↔code.

## 4 — Comment le résolveur le lit : deux natures, UNE lecture

Le résolveur de statut (D-013) **ne connaît pas les natures** — il lit une **interface commune de fait de
statut** :

| | PROMO (ordinaire) | RATIF (fondateur) |
|---|---|---|
| `kind` | `promotion` | `founding-ratification` |
| Records déclarés | `record:` **1** | `declares_normative:` **N** |
| autorité | approbation Opus X + grounding | **signature** Opus X (extra-corpus) |
| immuable | oui | oui |

**Règle de lecture (une seule) :** `statut(R) = Normative` **s'il existe un fait de statut** (PROMO **ou**
RATIF) qui **déclare R Normative**, et **aucun fait de révocation** postérieur. Le résolveur itère les faits,
collecte pour chaque Record les déclarations, applique les révocations. **Il lit l'interface, pas le
`kind`** — d'où « deux natures, une lecture » (la formule de D-020).

> **⚠️ CAVEAT du 2026-07-25 — l'interface NE TIENT PAS encore champ pour champ (vérification demandée).**
> Le tableau ci-dessus l'expose lui-même : PROMO porte **`record:` (scalaire, 1)**, RATIF
> **`declares_normative:` (liste, N)** — **noms et formes différents**. Voir PROMO comme « N=1 » **exige**
> qu'il expose une **liste** (`declares_normative: [OCR-xxx]`), pas un scalaire ; sinon le résolveur a besoin
> d'un **adaptateur par `kind`**, ce qui **contredit** D-020. De plus la **révocation n'est spécifiée pour
> aucun des deux** (la matière D-010 note l'absence de `revokes:`). **« Une lecture » est donc une fiction
> tant que l'interface n'est pas UNIFIÉE** : un champ de déclaration commun (`declares_normative: [...]`,
> PROMO = singleton) **+** une forme de révocation commune. **Unification = étape 3/6, pas ici. Constat, non
> corrigé.**

## 5 — Ce que la conception NE tranche pas (hors de ma main)

- **La ratification elle-même** — la signer, la dater, l'émettre : **décision d'Opus X, hors chantier**
  (l'étape 0 attend cela).
- **Le grain `RATIF` vs `PROMO` — D-010 N'EST PAS tranchée par RATIF.** Inscription explicite :
  **`RATIF` = grain GROS par NÉCESSITÉ** (acte fondateur unique déclarant 2 Records en un fait) ; **le grain
  de `PROMO` reste OUVERT — D-010, étape 6**. **Deux séries, deux grains, décidés séparément.** Lire RATIF
  comme ayant tranché D-010 serait **faux** : RATIF est un cas particulier (fondateur), il ne dit rien du
  grain ordinaire de PROMO.
- **L'écriture du régime** (le Record qui *normalise* cette forme) = **étape 3**, après l'amendement +
  promotion d'OCR-006 (étape 1). Ici : **conception**, pas normalisation.

## 6 — Le nœud d'ordre : découpage **0a / 0b** (proposé, non exécuté)

**La conception (ce document) NE suffit PAS à ratifier.** Une ratification est un **fait** qui doit
s'**inscrire** quelque part ; une conception est un plan, pas un lieu. Pour inscrire `RATIF-001`, le lieu
doit **exister réellement** : le répertoire `content/registry/founding/`, la **série `RATIF` déclarée**, et
sa **garde de plage armée** (comme D-004 pour PROMO). Donc **l'étape 0 se scinde** :

- **0a — CRÉER LE LIEU** *(construction)* : écrire le registre fondateur, déclarer la série `RATIF` hors
  plages, armer la garde, **et unifier l'interface de fait de statut** (caveat §4). C'est un **fragment de
  l'étape 3** (le régime), **tiré en tête** parce que l'étape 0b en dépend. **Ne crée aucune circularité :**
  le lieu n'est **pas** un OCR → il n'a pas besoin d'être ratifié pour exister.
- **0b — RATIFIER** *(hors chantier)* : Opus X signe/date/émet `RATIF-001` dans le lieu. **Attend Opus X.**

**Ordre : 0a (nous, sur go) → 0b (Opus X) → étape 1…** La **normalisation** de la forme du lieu dans le
Record du régime reste à l'**étape 3** (après OCR-006 promu) ; 0a n'en fait que la **partie matérielle**
(le fichier + la garde), tracée comme « objet avant règle » assumé (même schéma que PROMO : conçu/bâti à
l'étape 6, normalisé à l'étape 7).

**Rien construit, rien écrit hors cette conception. 0a attend votre go ; 0b attend Opus X.**
