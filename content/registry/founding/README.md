# `content/registry/founding/` — le lieu de l'acte fondateur (étape 0a)

Ce répertoire est le **lieu de la ratification fondatrice** (D-019 / D-020). Il porte l'acte par lequel
Opus X déclare `{OCR-000, OCR-005}` **Normative** en premier — la **sortie de l'amorçage** : le corpus ne
peut pas se rendre autoritatif par ses propres règles (toutes en Draft), donc l'autorité vient d'un point
**extra-corpus**, la **signature Opus X** (`OCR-000:35`).

## Ce que ce lieu N'EST PAS (non-circularité — vérifié)

- **Ce n'est pas un OCR.** Il ne vit pas dans `docs/web/registry-import/OCR-100/`, n'est pas scanné par
  `scripts/registry/manifest.mjs`, n'apparaît pas dans `content/registry/_manifest.json`.
- **Pas de `Status`** (aucun cycle `Draft → Normative`), **pas de promotion**, **pas de grounding**. Un lieu
  qui devrait être ratifié pour exister recréerait l'amorçage — il ne l'est pas.

## Contenu (étape 0a — le lieu, pas l'acte)

| Fichier | Rôle |
|---|---|
| `founding.manifest.json` | déclare la **série `RATIF`** et sa **plage** (`RATIF-001..001` — unique, D-019) ; `records: []` |
| `RATIF.schema.json` | la **forme** d'un fait `RATIF` (champs), **vide de contenu** |
| `README.md` | ce fichier |

**Aucun `RATIF-001` n'est émis ici.** L'émission (signée, datée) est l'**étape 0b**, décision d'Opus X,
**hors de ce chantier**. La **garde de plage** `RATIF` est armée et prouvée par mutation dans
[`lib/registry/foundingLieu.test.ts`](../../../lib/registry/foundingLieu.test.ts).

## Lecture par le résolveur (étape 6, pas ici)

Un fait `RATIF` porte `declares_normative: [...]` (liste) ; un `PROMO` porte `record:` (scalaire). Le
résolveur de statut (D-013) les lit via une **projection commune** `declaredRecords(f) = f.declares_normative
?? [f.record]` (**voie 2**) — l'interface vit au résolveur, pas au fichier ; **D-016 intact, pas de D-021**.
La **forme de révocation** (commune aux deux séries, D-013) se décide aussi à l'étape 6. Rien de tout cela
n'est construit ici.
