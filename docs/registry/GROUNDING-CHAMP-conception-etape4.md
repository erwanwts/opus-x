`docs/registry/GROUNDING-CHAMP-conception-etape4.md` · conception (étape 4) · 2026-07-25 *(hash : voir commit)*

# Le champ de grounding (D-017) — CONCEPTION (étape 4, pour revue)

> **Aucun champ écrit dans les Records.** Conception du champ D-017 et de son test d'attestation, à réviser
> avant écriture. Ferme la boucle **ouverte** : aujourd'hui aucun Record ne cite son rapport, aucun test ne
> lit les rapports, `Review Status` est inerte.

## 0 — Une NUANCE mesurée avant les 4 états

En lisant `OCR-GROUND-001-rapport-F1`, un **5ᵉ cas** apparaît, que les 4 états ne couvrent pas :
un Record peut avoir un rapport **« Conforme »** *mais avec un GAP bloquant* → **NON promouvable**.
Exemple mesuré : **OCR-112** est « **Conforme** (réception ; hors supersession) » **et** GAP-F1-01 grave
« 112/114 **NON-promouvables** en Normative tant que [la supersession] non codée » (BACKLOG CODE). Donc
« groundé » ≠ « promouvable ». **Le champ doit porter cette nuance**, sinon un script naïf lisant « Conforme »
sur-promeut. *(Constat — à trancher : 5ᵉ état, ou qualificateur `hors GAP` sur l'état Conforme.)*

## 1 — Le schéma du champ

- **Où :** dans l'**en-tête** (front-matter), un champ **`Grounding`**, au même rang que `Version`/`Status`/
  `Review Status` — c'est une métadonnée **par Record** de sa disposition de grounding. *(Il remplace à terme
  le `Review Status` inerte, ou le précise.)*
- **Sous-champs, encodés dans la valeur :** `état` **+** (si rapport) `rapport` **+** `commit`. **Un seul
  champ**, rempli **différemment** selon l'état — pas de champs distincts éditorial/Conforme (c'est **un**
  concept : la disposition de grounding ; les sous-valeurs `rapport·commit` n'apparaissent que quand un
  rapport existe).
- **Les états (4 + la nuance mesurée) :**

| État | Valeur du champ | Pour |
|---|---|---|
| éditorial, non requis | `éditorial — non requis` | méta éditoriaux (000–005, 008) |
| cohérence documentaire requise | `cohérence documentaire requise (doc↔tooling)` *(→ `· Conforme · <réf> · <commit>` une fois faite)* | 007, 009 |
| protocole requis, non fait | `protocole requis — non fait` | les 6 : 101,104,106,107,108,109 |
| protocole Conforme | `protocole Conforme · rapport <F#> · commit <hash>` | groundés sans GAP bloquant |
| **[mesuré] Conforme, GAP ouvert** | `protocole Conforme hors <GAP-id> · rapport <F#> · commit <hash> · NON PROMOUVABLE (BACKLOG)` | ex. OCR-112 |

## 2 — Le raccord rapport → champ : MANUEL (mesuré), machine-VÉRIFIABLE

- **Mesure de la structure du rapport :** `OCR-GROUND-001-rapport-F*` est **semi-structuré, à dominante
  prose**. Il porte des verdicts par Record (« **111** : … **Conforme** (hors GAP-F1-02) ») **mais** avec des
  **qualifications** (« hors GAP-XX ») et une **grille G0–G4** qui **décide la promouvabilité** — pas un
  simple `id → Conforme`.
- **⇒ Dérivation automatique NON sûre :** un script extrayant « Conforme » **perdrait** la nuance des GAP
  bloquants (il sur-promouvrait OCR-112). **Le champ s'écrit à la MAIN** (jugement humain lisant le verdict
  **et** sa classification G0–G4).
- **Mais la citation est machine-VÉRIFIABLE :** le champ **cite** `rapport <F#>` + `commit <hash>` → un test
  peut vérifier que le rapport **existe** à ce commit (`git cat-file -e`, fichier présent). L'écriture est
  humaine ; la **traçabilité** est testable.

## 3 — Le test d'attestation (D-017) — ce qu'il assère

Pour chaque Record, selon son champ `Grounding` et son statut :

- **machine-facing PROMU (Normative)** → `Grounding` **doit** être `protocole Conforme` (**sans** GAP
  bloquant), et le `rapport`/`commit` cités **doivent exister**.
- **éditorial** → `éditorial — non requis`.
- **cohérence documentaire (007/009)** → son état propre (`cohérence documentaire requise`, ou `Conforme`
  une fois le contrôle doc↔tooling fait).
- **machine-facing NON groundé (les 6)** → `protocole requis — non fait` **et NE PEUT PAS être Normative**.
- **[mesuré] Conforme hors GAP** → **NON promouvable** (pas Normative) tant que le GAP n'est pas clos.
- **Prouvé par mutation :** un machine-facing **promu sans `Conforme`** → **échec** ; un Record **`requis,
  non fait` promu** → **échec** ; un `Conforme hors GAP` **promu** → **échec**.

## 4 — Interaction avec le résolveur (étape 6) : ORTHOGONAL, pas un 6ᵉ lecteur du statut

- Le champ `Grounding` est **lu par la logique de PROMOTION** (étape 8) : il **conditionne** si un Record
  **peut** être promu. Il **n'est pas lu par le résolveur de statut** (qui dérive le statut courant
  Draft/Normative des **faits** RATIF/PROMO).
- **⇒ Orthogonal :** grounding = **éligibilité à promouvoir** (précondition vérifiée avant d'émettre
  l'approbation/PROMO) ; statut = **est-ce promu** (dérivé des faits, étape 6). **Deux concerns distincts.**
- **Donc : le champ `Grounding` n'est PAS un 6ᵉ lecteur du champ `Status`.** Il ne touche pas la liste des 5
  lecteurs du statut. **Cela évite de recréer une divergence** : le grounding gate la promotion en amont, le
  résolveur dérive le statut en aval — ils ne se lisent pas l'un l'autre.

---

**Rien écrit dans les Records. J'attends la revue — surtout : la NUANCE §0 (5ᵉ état `Conforme hors GAP`, ou
qualificateur ?), et si `Grounding` remplace `Review Status` ou le complète.**
