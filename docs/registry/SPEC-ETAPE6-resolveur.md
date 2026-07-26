`docs/registry/SPEC-ETAPE6-resolveur.md` · spec (étape 6, cahier des charges) · 2026-07-26 *(hash : voir commit)*

# Étape 6 — résolveur + garde anti-forgeage + fermeture D-023 : SPEC MESURÉE

> **Cahier des charges dérivé du dry-run** `scripts/registry/dryrun-promote-104.mjs` (lecture seule, zéro
> écriture, réexécutable). **Ne construit rien** — spécifie. La construction sera le mandat suivant. Trois
> manques mesurés convergent ici (§2/§4 du dry-run + fenêtre D-023). **RATIF-001 intact.**

## Ce que le dry-run a PROUVÉ (reproductible)

`node scripts/registry/dryrun-promote-104.mjs` : le fait `PROMO-001` pour OCR-104 se construit proprement,
mais **la dérivation n'a personne pour l'exécuter** (aucun résolveur), et **rien n'empêche le forgeage** par
édition de champ (`recordPage.test:163-164`). Verdict : chemin **incomplet**. Cette spec ferme les trois.

## Composant 1 — Le lieu PROMO (miroir de `founding/`)

- **Où :** `content/registry/promo/` — série `PROMO`, comme `founding/` pour `RATIF`. Plage `PROMO-001..nnn`
  **déjà réservée** dans `expected_ranges` (mesuré : `…,PROMO-001..001` ; anomalie `missing_in_sequence`
  ["PROMO-001"] tant que le fichier n'existe pas). Acte en 2 parties (D-004) : fichier **+** borne (pour 001 la
  borne est là ; écrire le fichier clôt l'anomalie).
- **Garde de plage + contenu** (miroir de `foundingLieu.test.ts`) : `PROMO-nnn` dans la plage ; `kind:"promotion"` ;
  `declares_normative` = **ids OCR existants** ; `grounding.verdict` **présent** ; `authority:"Opus X"`. Prouvée
  par mutation. *Différence avec RATIF : `ordinary_process:true`, plusieurs PROMO possibles (RATIF = 001..001).*

## Composant 2 — Le résolveur (la fonction qui manque)

```ts
resolveStatus(recordId: string, facts: ApprovalFact[]): 'Draft' | 'Normative'
  LIT    : RATIF-* (founding/) + PROMO-* (promo/) + faits de RÉVOCATION (D-013)
  DÉRIVE : promoted  = ∪ declares_normative(approbations non révoquées)
           revoked   = ∪ revokes_normative(révocations)
           effective = promoted \ revoked
  REND   : recordId ∈ effective ? 'Normative' : 'Draft'
  ÉCRIT  : RIEN (dérivation pure ; le champ n'est jamais touché)
```

- **Interface de projection** (D-016, voie 2) : un `loadFacts()` qui lit les deux lieux + révocations.
- **Rouvre D-010** (per séquence) : la révocation commune PROMO/RATIF se décide **une fois** ici (D-013).

## Composant 3 — Migration des 5 lecteurs (les 3 familles d'accès, D-023)

Chaque lecteur du **champ** passe au **fait dérivé** :

| Lecteur | Aujourd'hui (champ) | Après (dérivé) |
|---|---|---|
| `recordPage.ts:115` | `fields['Status']` | `resolveStatus(id, facts)` |
| `recordPage.ts:143` | `fields['Status'] ?? ''` | `resolveStatus(id, facts)` |
| `geo.ts:294` | `metadata['Status']` | `resolveStatus(id, facts)` |
| manifeste `lifecycle_status` (`manifest.mjs`→`api.ts`) | champ | dérivé au build |
| `robotsFromStatus`/sitemap/`/records` | via `buildRecordPage` (central) | suit le central |

**Critère :** après migration, `git grep "fields\['Status'\]"` (pour une décision de statut) = **0**.

## Composant 4 — La garde anti-forgeage (spec)

- **Règle :** aucun Record `.md` ne porte `Status: Normative`/`Validated` **authored**. Le statut est **dérivé**,
  jamais authored (OCR-009 §4, D-022). Un `Normative` authored = **forgeage = échec**, la garde **nomme** le Record.
- **Prouvée par mutation :** éditer un champ en `Normative` → échec.
- **Ferme `recordPage.test:163-164`** : ce test (qui promeut *en éditant le champ*) est **réécrit** — la
  promotion se prouve désormais **via un fait PROMO → résolveur → indexable**, plus jamais par `raw.replace`.
  Double fermeture : la garde interdit le champ authored **et** le résolveur l'ignore.

## Composant 5 — Fermeture de la fenêtre D-023

- Avec le résolveur, `{OCR-000, OCR-005}` **dérivent Normative** de `RATIF-001` (champ resté Draft, **ignoré**).
  La **divergence champ/fait disparaît** parce que **plus rien ne lit le champ**.
- **L'exception nominative `recordPage.test:132`** (`{OCR-000, OCR-005}` exclus du « Draft→noindex ») est
  **RETIRÉE** — inutile une fois le statut dérivé. La dette bornée D-023 (`DETTES-ouvertes.md`) est **close**.

## Critères d'acceptation (le « fini » de l'étape 6)

1. `resolveStatus` existe, **pure**, testée (dont révocation → retour Draft).
2. Les **5 lecteurs** utilisent le résolveur ; `grep` du champ pour décision de statut = 0.
3. Garde anti-forgeage **verte + mutation-prouvée** ; `recordPage.test:163-164` réécrit.
4. Fenêtre **D-023 close** : `{000,005}` lus Normative par dérivation ; exception `:132` retirée ; suite verte.
5. **Preuve par le dry-run :** re-`node scripts/registry/dryrun-promote-104.mjs` montre alors §2 **dérivation
   RÉUSSIE** (résolveur présent) et §4 **garde PRÉSENTE**. Le dry-run est le **test avant/après**.
6. **OCR-009 devient franchissable** : le mécanisme qu'il décrit existe enfin (il était bloqué par sa propre
   règle — `FRANCHISSABLE-SOUS-D026`). Son grounding doc↔tooling passe alors de « en désaccord » à « conforme ».

---

**Conséquence de séquence :** l'étape 6 **débloque à la fois** la promotion des 11 (résolveur pour dériver),
**OCR-009** (son mécanisme existe), **et** la fenêtre D-023 (champ ignoré) — **un seul chantier**. L'étape 8
(dry-run réel sur OCR-104, puis les 11) ne s'ouvre qu'**après** ces critères. **Rien promu, rien construit,
rien écrit dans les Records. RATIF-001 intact.**
