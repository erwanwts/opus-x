# OCR-007 — Doctrine de l'architecte (référence normative)

**Statut : Approved / Normative** (doctrine de cadrage — arrête les décisions 1→7).
**Portée** : cadre d'autorité pour la rédaction du registre **OCR-007 Predicates**.
**Date** : 2026-07-17.

> Ce document consigne les **7 décisions de l'architecte** qui régissent la production
> d'OCR-007 à partir de l'inventaire des 101 prédicats du WSP-001 Lot 0
> ([docs/wsp001-lot0/](../wsp001-lot0/)). Il fait autorité sur la rédaction : toute entrée
> d'OCR-007 doit s'y conformer. Les décisions sont recopiées fidèlement ; elles ne sont ni
> reformulées ni « améliorées ».

---

## Décision 1 — Noyau canonique (8) + `extends` Reserved

**NOYAU CANONIQUE (8)** : `is_a`, `part_of`, `depends_on`, `produces`, `consumes`,
`references`, `supersedes`, `related_to`.

`extends` = **Reserved** (0 occurrence, gardé en réserve).

Tout nouveau prédicat doit **prouver qu'il n'est pas exprimable par ce noyau** avant
acceptation.

## Décision 2 — Inverses

Les inverses sont des **vues dérivées** : une seule direction canonique est stockée,
référencée via `canonical_inverse`. Ils existent dans le SDK / l'API / l'UI mais **jamais
comme seconde source de vérité**.

## Décision 3 — Séparation des 6 registres

`OCR-007 Predicates` · `008 Attributes` · `009 Constraints` · `010 Types` ·
`011 Inference` · `012 Cardinality`.

- Négations → **009**.
- State → **008**.
- Cardinalités → **012** (référencées, **pas** définies dans 007).

OCR-007 décrit les **relations** — **ni états, ni contraintes, ni types**.

## Décision 4 — Arbitrages ouverts (Evolving)

Les prédicats dont le sens **dépend du graphe** portent `semantic_stability = Evolving`
(**Stable** en cycle de vie, **interprétation ouverte** jusqu'à validation par le graphe).

Concerne : `Conceptual`, `Computation`, `composition`.

**NE PAS figer artificiellement.**

## Décision 5 — Modèle de prédicat (14 champs)

`predicate_id`, `name`, `semantic_contract`, `family`, `relationship_type`,
`ontology_domain`, `signature` (réf **OCR-010**), `obligation`, `canonical_inverse`,
`symmetry`, `constraints_ref`, `stability`, `semantic_stability`, `introduced_in`,
`governed_by`, `used_by`.

Le **`semantic_contract`** est la **définition normative qui fait autorité**, indépendante
des implémentations.

## Décision 6 — Principe de réduction

Les 101 sont un **inventaire, pas le vocabulaire**. Chaque prédicat est classé en :
**Canonical / Alias / Derived / Reserved / Deprecated / Rejected**.

Le registre **tend vers le plus petit vocabulaire** capable d'exprimer tout le protocole.

## Décision 7 — Critère de validation (Approved quand)

OCR-007 est **Approved** quand :

- chaque relation du Lot 0 a une **résolution normative** ;
- **aucun prédicat ambigu** sans statut explicite ;
- chaque entrée a un **`semantic_contract`** ;
- **familles stabilisées** ;
- **inverses normalisés** ;
- **dépendances OCR-008–012 référencées** ;
- **utilisable comme source unique** par WSP-001.

---

## Matériau d'entrée (versionné)

Inventaire des 101 prédicats du WSP-001 Lot 0, trois représentations du même relevé :

- [predicate-inventory.md](../wsp001-lot0/predicate-inventory.md) — tableau (familles, inverses, réflexifs, colonne de suggestion de normalisation).
- [predicate-examples.md](../wsp001-lot0/predicate-examples.md) — liste avec exemples d'extrémités.
- [predicates.csv](../wsp001-lot0/predicates.csv) — CSV.

Relevé : **101 prédicats distincts** extraits de 32 Records ; **8 / 9** canoniques OCR-004
présents ; **93** hors-vocabulaire. Les générateurs `.mjs` restent en `build/wsp001-lot0/`
(hors versionnement) — ce sont des outils de production, pas de la matière normative.
