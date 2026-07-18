# REG-TERMINOLOGY — Registry · Record · OCR

**World Skills Protocol · Opus Canonical Registry · Terminologie fondatrice**

| | |
|---|---|
| **Document** | REG-TERMINOLOGY (Record de gouvernance) |
| **Statut** | Official — verrouillé (WEB-003A) |
| **Version** | 1.0 |
| **Date** | 2026-07-16 |
| **Portée** | Nomenclature canonique de la bibliothèque officielle Opus X |

> Ce Record définit les termes qui nomment la bibliothèque et ses entrées. Il prime sur tout usage antérieur du sigle « OCR ». Règle directrice : **un sigle, un sens.**

## Définitions canoniques

**Opus Canonical Registry** — la **bibliothèque officielle** d'Opus X : la collection de toutes les définitions canoniques du World Skills Protocol. Analogue au *RFC Editor* pour les RFC, au *W3C* pour ses Recommendations. Sigle admis : **OCReg**, ou « the Registry ». **Ne porte jamais le sigle « OCR » seul.**

**Opus Canonical Record** — un **document individuel** du Registry : une définition officielle, une entrée numérotée, une référence permanente, une source canonique, un objet versionné. Sigle : **OCR**. Un identifiant de la forme `OCR-###` désigne **toujours** un Record, jamais la collection.

## Règle « un sigle, un sens »

- `OCR` = **Record** (le document). Le sigle appartient à l'objet le plus fréquemment cité (`OCR-101`, `OCR-117`).
- La collection s'écrit **en toutes lettres** — *Opus Canonical Registry* — ou **OCReg**. Jamais « OCR » pour la collection.
- Un identifiant `OCR-###` est **toujours** un Record. Il n'existe pas d'identifiant « Registry-### ».

## Hiérarchie

```
World Skills Protocol
        │
Opus Canonical Registry            (la bibliothèque — OCReg)
        │
        ├── OCR-100  Opus Canonical Record
        ├── OCR-101  Opus Canonical Record
        ├── OCR-102  Opus Canonical Record
        └── …
```

## Forme canonique d'un Record (en-tête type)

```
OCR-117 · Opus Canonical Record · Competency
Version 2.0 · Status: Official
```

## Phrase de référence (citable)

> The Opus Canonical Registry contains Opus Canonical Records (OCRs). Each OCR is a versioned, official definition. The Registry is the collection; a Record is an entry.

## Points laissés ouverts (à trancher en WEB-003A, corpus en main)

1. **L'espace de numérotation** `OCR-###` doit-il encoder un sens (ex. `1xx` entités du protocole, `2xx` frameworks, `3xx` rôles) ? — livrable WEB-003A, pas décidé ici.
2. **La liste des Records** (quelles entités méritent un OCR) se décide après extraction du graphe depuis le corpus. « Competency » et « Capability » ne sont donnés ici qu'à titre d'illustration de forme — leur statut d'entité canonique reste **à confirmer** contre ARCH-001 / WSP / SCHEMA.

*REG-TERMINOLOGY v1.0 — verrouillé. Aucun document normatif modifié ; ce Record nomme, il ne redéfinit rien.*
