`docs/registry/DOSSIER-ARBITRAGE-GAP-PHASE1.md` · dossier d'arbitrage (préparation, pas décision) · 2026-07-25 *(hash : voir commit)*

# Dossier d'arbitrage — les 4 Records de Phase 1 encore bloqués par un GAP

> **Je prépare, je ne tranche pas.** Après D-024 (112 → Phase 2), quatre Records **restent Phase-1 + GAP
> ouvert**. Ce dossier les instruit pour l'Architecte. **Rien écrit dans les Records. RATIF-001 intact.**

## Les quatre cas

| Record | GAP | Registre du GAP | Ce qu'il bloque EXACTEMENT à l'étape 8 |
|---|---|---|---|
| **101** Professional Passport | **GAP-3** (lien Passport↔update 1:1 « prévu, non imposé » ; `passport_update_id UNIQUE` absent) | **BACKLOG CODE** (couche mission, jumeau de GAP-F1-02) | Promu Normative, 101 **asserterait une contrainte d'unicité 1:1** que le code **ne garantit pas** — un fait normatif sans son invariant. |
| **110** Evidence *(pilote)* | **GAP-2** (OCR : « MAY reference multiple criteria » + exemple à 4 ; code impose **exactement 1**) **+ GAP-3** | **OCR-REV** (`OCR-110-REV-01`) **+ BACKLOG CODE** | 110 porte un **défaut documentaire** (le texte **contredit le code** sur la cardinalité). Le promouvoir tel quel **publie un Record défectueux**. Levée = **reformuler l'OCR** (OCR-REV), pas coder. |
| **111** Evidence Source | **GAP-F1-02** (`ON DELETE RESTRICT` vers `mission_*` absent ; provenance = texte, pas FK) | **BACKLOG CODE** | 111 **asserterait l'intégrité référentielle source** (« source non supprimable ») **non implémentée**. *(Verdict F1 explicite : « Non promouvable jusqu'à arbitrage ».)* |
| **113** Evidence Integrity | **GAP-F1-03** (OCR dit « keyed-HMAC over canonical bytes » ; code = SHA-256 **non-keyé** sur JCS + HMAC de **transport**) | **OCR-REV à CONFIRMER** (G3 candidat) | 113 **conflate peut-être** intégrité (SHA-256) et authentification (HMAC). Si oui → **défaut doc** (reformuler) ; si « cible implémentée autrement » → **BACKLOG CODE**. **Nature non tranchée.** |

## Effet sur la partition — Phase 1 dans les deux hypothèses (par Record)

**État courant : Phase 1 = 32.** Chaque bascule ajoute 1 à `HORS_PHASE_1`.

| Hypothèse | HORS_PHASE_1 | Phase 1 |
|---|---|---|
| **reste en Phase 1** (le GAP se lève avant l'étape 8) | 4 | **32** |
| **101 → Phase 2** | 5 | **31** |
| **110 → Phase 2** | 5 | **31** |
| **111 → Phase 2** | 5 | **31** |
| **113 → Phase 2** | 5 | **31** |
| **les 4 → Phase 2** (cumul) | 8 | **28** |

## La question de fond — à trancher par l'Architecte

**D-024 a écarté 112 pour « GAP ouvert ». Est-ce un CRITÈRE ou une décision D'ESPÈCE ?**

- **Si CRITÈRE — « GAP ouvert → Phase 2 » :** il **s'applique aux quatre** (101, 110, 111, 113) → **Phase 1 = 28**.
  Alors le critère doit être **nommé et gravé** comme porte de préparation (famille de la grille étape 8), et
  `HORS_PHASE_1` recalculé. **Aujourd'hui D-024 pose cette règle sans la nommer** — c'est le trou.
- **Si décision D'ESPÈCE — 112 seul :** D-024 doit **porter son motif propre** (pourquoi 112 et pas les
  autres). Le motif plausible mesuré : 112 partage **GAP-F1-01** avec 114 (déjà Phase 2) — même bloqueur, même
  chantier code, ils **remontent ensemble**. Les quatre autres ont des bloqueurs **distincts** → jugés un par un.

**Une distinction que la règle devra intégrer — le REGISTRE du GAP :**
- **BACKLOG CODE** (implémentation absente — 101, 111, 110·GAP-3) : le protocole est la cible, le code rattrape.
  « Normative avec badge planifié » (règle d'or grounding) pourrait s'appliquer → **question E**.
- **OCR-REV** (défaut du texte lui-même — 110·GAP-2, 113) : ce n'est **pas** un retard d'implémentation, c'est
  un **Record défectueux**. Le lever = **reformuler l'OCR**, après quoi il est prêt. Autre nature, autre voie.

⇒ « GAP ouvert → Phase 2 » **ne peut pas** être un critère unique tant que **BACKLOG CODE** et **OCR-REV** ne
sont pas distingués : un défaut de code (le protocole attend) et un défaut de texte (le Record est faux) ne se
traitent pas pareil. **Lié à E** (un G1/BACKLOG-CODE est-il « prêt » avec badge ?).

---

**Rendu pour arbitrage. Je ne tranche pas.** Les 4 GAP et E restent chez l'Architecte. **Rien écrit dans les
Records, aucun artefact de promotion, RATIF-001 intact.**
