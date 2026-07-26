`docs/registry/CADRAGE-PROMOTION-avant-etape8.md` · cadrage (mécanisme de promotion, avant étape 8) · 2026-07-26 versé en `094ce05`

# Cadrage du mécanisme de promotion — AVANT toute étape 8 (mesure + conception)

> **Rien promu, rien construit, rien écrit dans les Records.** Cadrage du premier acte irréversible. Fil
> directeur mesuré : **le résolveur (étape 6) est la clef de voûte manquante** ; sans lui, le seul chemin
> Draft→Normative est un **forgeage par édition de champ, non gardé**. **RATIF-001 intact.**

## 1 — Qu'est-ce que promouvoir, exactement ?

**L'opération PRÉVUE** (OCR-009 + D-013/D-016/D-022), pour UN Record :

1. **Vérifier le grounding** — aucun désaccord doc↔code/tooling (OCR-009 §3 : l'approbation « SHALL presuppose
   grounding satisfied »). Pour les 11, c'est acquis (G0/conforme).
2. **Écrire un fait d'approbation `PROMO-nnn`** — un status-fact **signé, autorité Opus X**, déclarant le
   Record Normative (l'analogue **ordinaire** de RATIF). **Acte en DEUX parties (D-004)** : le fichier
   `PROMO-nnn` **et** l'extension de plage `expected_ranges → PROMO-001..nnn` — sinon la garde de plage
   (`manifest.attestation`) **échoue bruyamment**.
3. **Le RÉSOLVEUR dérive le statut** « Normative » **du fait** (D-016 lit RATIF + PROMO). **Le champ `Status`
   du Record n'est PAS édité** (D-022 : statut = projection ; OCR-009 §4 : « never authored directly »).
4. **La projection suit** : `robots` Draft→`index,follow`, entrée au sitemap, page `/records` indexable —
   **dérivés** du statut résolu.

**Irréversible :** le **fait `PROMO-nnn`** une fois committé (artefact historique, append-only — la discipline
d'immutabilité). *Que la promotion a eu lieu* est permanent.
**Rattrapable :** le **statut** est révocable par un **SECOND fait** (D-013 : révocation = fait neuf, jamais
suppression) ; le **champ** n'est pas touché (rien à défaire) ; la **projection** est re-dérivable à volonté.

**⚠️ RÉALITÉ MESURÉE :** les étapes **3 et 4 ne peuvent pas avoir lieu** — **le résolveur n'existe pas**
(`grep` d'un mécanisme PROMO/résolveur dans `lib/`,`scripts/` = **aucune implémentation** ; D-013 « résolveur
inexistant » ; étape 6 non lancée). Aujourd'hui, la **seule** façon de faire lire « Normative » à un Record est
d'**éditer son champ** — ce que OCR-009 §4 et D-022 **interdisent**. **Une promotion propre n'est pas encore
exécutable.**

## 2 — RATIF-001 et la garde : un chemin non gardé, NOMMÉ

- **RATIF-001 ne garde que l'acte FONDATEUR** ({000,005}) : `foundingLieu.test.ts` vérifie la plage
  `RATIF-001..001` **et** le contenu (`declaresExactSet` = exactement `{OCR-000, OCR-005}`). Les promotions
  **ordinaires** passent par **PROMO**, pas RATIF → elles se font **À CÔTÉ** de RATIF-001, sous une **garde
  PROMO qui n'existe pas encore**.
- **Existe-t-il un chemin où un Record serait promu sans que RATIF-001 (ni aucune garde) le voie ? OUI —
  nommé : l'ÉDITION DIRECTE DU CHAMP.** Mesuré : `recordPage.test.ts:163-164` **promeut en remplaçant le
  champ** — `raw.replace('| **Status** | Draft |', '| **Status** | Normative |')` → la page devient
  `index,follow`. Les **5 lecteurs** du statut font tous **confiance au champ authored** (`recordPage.ts:115/143`,
  `robotsFromStatus:126`, `geo.ts:294`, manifeste `lifecycle_status`). **Rien n'impose OCR-009 §2** (« a Record
  SHALL NOT promote itself by a field on its own representation »).
- **⇒ DÉFAUT À CORRIGER AVANT l'étape 8, pas après :** l'édition d'un champ = **promotion de facto, non
  gardée, sans fait, sans autorité**. C'est le **forgeage** que OCR-009 nomme et que rien n'empêche. **Le
  correctif = le résolveur** (statut dérivé des faits, champ **ignoré**) **+ une garde** qui refuse un
  `Status: Normative` authored. **Même manque que §1 : étape 6.**

## 3 — GAP-PROMOTION : prérequis des 11 ? NON. Mais ce n'est pas lui, la clef.

- **Les 11 sont sans GAP par construction** (G0/conforme). `GAP-PROMOTION` (« aucun GAP ouvert ») serait
  **vacue** pour eux (absents du registre → passent trivialement). **Il n'est donc PAS un prérequis de leur
  correction.**
- **Ce qu'il apporte** est un **filet de sécurité** pour l'étape 8 **entière** : empêcher de promouvoir par
  erreur un Record **gappé**. Sans lui, « les 11 sont sans GAP » repose sur le **verdict PROSE** (SYNTHÈSE), pas
  sur un test ; et rien n'empêche mécaniquement d'inclure un gappé par mégarde.
- **Le VRAI prérequis des 11 n'est pas GAP-PROMOTION — c'est le RÉSOLVEUR** (étape 6). `GAP-PROMOTION` décide
  si l'on **doit** écrire le fait ; le résolveur rend la promotion **réelle** (dérive le statut) **et** ferme
  le forgeage (§2). Pour les 11, le contrôle de GAP est un **no-op** ; le résolveur est **indispensable**.
- **⇒ Réponse nette :** l'étape 8 peut s'ouvrir sur les 11 **sans GAP-PROMOTION construit** — mais **pas sans
  le résolveur**. Construire GAP-PROMOTION **avant** ne serait qu'un filet (utile, non requis pour les 11) ;
  ne pas le construire laisse le « sans GAP » en **confiance-prose**. *Arbitrage : filet machine maintenant, ou
  confiance-prose sur 11 Records nommés ? — votre décision.*

## 4 — Le dry-run : sur UN seul Record

**Cas d'essai proposé : `OCR-104` (Opus ID).** Motif : **G0 pleinement conforme** (« réel + référencé par les
faits »), concept **feuille** à faible rayon (pas un pilier SEO majeur comme Evidence/Passport), sémantique
simple. *(Alternative : `OCR-120` Issuer.)* **Pas les 11** — un seul, pour juger le mécanisme, pas le lot.

**Ce que le dry-run doit MONTRER (à blanc, sortie inspectable, zéro écriture réelle) :**

1. **Le fait `PROMO-001` qui SERAIT écrit** — contenu, `authority: Opus X`, `declares_normative: [OCR-104]` —
   affiché, **non committé**.
2. **L'amendement de plage** `expected_ranges → PROMO-001..001` (D-004) — montré, **non appliqué**.
3. **La dérivation de statut** — étant donné ce fait, le résolveur **dériverait** Normative pour OCR-104. **Ici
   le dry-run EXPOSE le trou** : le résolveur n'existe pas → **rien ne dérive**. *(La révélation la plus
   importante.)*
4. **Le champ `Status` d'OCR-104 : INCHANGÉ** (preuve du non-édition en place, D-022).
5. **La projection à blanc** — `robots` Draft→`index,follow`, entrée sitemap, `/records/ocr-104` indexable —
   **calculée hypothétiquement** depuis le statut dérivé.
6. **La trace de garde** — la garde PROMO **validerait** le fait ; le **chemin d'édition de champ serait
   BLOQUÉ** (il ne l'est pas aujourd'hui — §2).
7. **La réversibilité** — le fait de **révocation** qui défolt la promotion (D-013).

**Critère de sûreté :** le dry-run n'est jugé **sûr** que s'il montre un chemin **complet, gardé, réversible**,
**champ intact**, statut **dérivé du fait**. **Verdict attendu, honnête : NON sûr encore** — le dry-run
**prouvera** que le chemin est **incomplet** (résolveur absent en §3, forgeage non gardé en §2). **C'est
précisément ce qu'un dry-run doit révéler avant l'acte irréversible :** l'étape 8 n'est pas sûre tant que
**l'étape 6 (résolveur + garde anti-forgeage)** n'est pas construite.

---

**Conclusion du cadrage (mesurée, non tranchée) :** promouvoir proprement = écrire un fait PROMO + **laisser le
résolveur dériver** le statut, champ intact, réversible par révocation. **Trois manques convergent sur l'étape
6 :** (§1) pas de résolveur → pas de dérivation ; (§2) chemin d'édition de champ **non gardé** = forgeage ;
(§3) le vrai prérequis des 11 est le résolveur, pas GAP-PROMOTION. **L'étape 8 ne doit pas s'ouvrir avant que
l'étape 6 ferme ces trois.** Le dry-run sur OCR-104 est l'instrument qui le prouvera à blanc. **Rien promu,
rien construit, rien écrit dans les Records. RATIF-001 intact.**
