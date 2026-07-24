# Registre des décisions — rendue vs appliquée

**Motif.** Une décision **rendue** par l'Architecte n'est pas une décision **appliquée** au dépôt.
D-005 a été rendue, jamais propagée, et présentée six tours plus tard comme encore ouverte. Rien
n'attestait qu'elle avait atteint le code. Ce registre est le **chaînon** manquant : chaque décision
y porte le commit qui l'a appliquée, ou l'aveu qu'elle ne l'a pas été. (Proposition (6) du registre
des règles découvertes.)

| Décision | Objet | Statut | Appliquée par |
|---|---|---|---|
| **D-001** | Option 1a — artefact de promotion à côté du Record | rendue | *(décision de conception ; pas de code — l'artefact n'existe pas encore)* |
| **D-002 v2** | Modèle B″ — projections non gouvernées | **rendue, NON appliquée** | ⚠️ **exécution en attente** — lot B″ chiffré (38 pages), jamais exécuté. **PENDING par conception** (l'Architecte l'a chiffré, pas ordonné d'exécuter), distinct de D-005 (propagation oubliée) |
| **D-003** | Fonction d'agrégation | **SANS OBJET** | rendue caduque — rien à appliquer |
| **D-004** | Série `PROMO-xxx` hors plages (`expected_ranges`) | rendue + appliquée | **`702c2d7`** (série PROMO déclarée, garde de plage) |
| **D-005** | OCR-123 → Phase 2, partition **29·3·1** | **rendue + APPLIQUÉE** | **`733646f`** (2026-07-24) — *rendue bien avant ; jamais propagée pendant six tours* ; dossier de promotion propagé le même jour |
| **D-006** | Régime `[GRAVÉ]` — source externe + renvoi | rendue + appliquée | **`528e303`** (2ᵉ réédition d'ARCHITECTURE-V3), `ce7c8d0` (motif unique) |
| **D-007** | Seau B suit le régime des orphelins | rendue + appliquée | **`528e303`** (2ᵉ réédition, même lot) |
| **D-008** | Q1 critère sur le contenu (→ retiré) · Q2 structurer les dettes | rendue + appliquée | **`31cad76`** (Q2 dettes structurées) ; Q1 → retrait, appliqué via D-009 |
| **D-009** | Retirer « modification substantielle » de la grille | **rendue + APPLIQUÉE** | **`733646f`** (2026-07-24) |
| **D-011** | P9 vise le statut **protocole**, pas le documentaire — le champ `Status` est hors P9, **pas de violation** | **rendue + APPLIQUÉE** | **`8a8b61d`** (2026-07-24, correction de la PARTIE III) — ⚠️ **conséquence NON tranchée : la seconde source reste ouverte → D-012.** Exige aussi une **précision de P9 dans OCR-006** (« any published representation » est général ; OCR-006 en Phase 3, jamais relu). **✅ Motif intact — confirmé et généralisé par D-014** (le split protocole/documentaire vaut pour les 10 principes, plus P9 seul) |
| **D-012** | Le **champ gouverne** ; l'artefact `PROMO` est une **trace de décision**, pas un second porteur du statut | **rendue, puis RETIRÉE (D-013)** | 🗑️ **RETIRÉE — ne pas appliquer, conservée au registre avec son motif** (premier cas d'usage : une décision retirée reste tracée). Contredisait Q3/Q5 (« le statut n'est **jamais écrit**, il est **calculé** ») ; D-013 a tranché **Q3 prévaut**, donc D-012 tombe. **Sous D-014**, la question « lequel gouverne » devient un **choix de gouvernance**, non un mandat P9 — D-012 **reste retirée** |
| **D-013** | **Q3 prévaut** : le statut est **dérivé des faits** par un **résolveur** ; la révocation est un **second fait**, jamais un changement d'état | **rendue, NON appliquée** | ⏸️ **rien appliqué — sous-question ouverte.** L'option retenue portait **deux issues** (champ `Status` projection OU retiré) — la mesure a montré qu'elles **présupposent toutes deux le résolveur inexistant** → **sous-question REPORTÉE** en aval du résolveur (ligne dédiée). Défaut de formulaire (2ᵉ du même type, cf. proposition (7)). Trace D-012 comme retirée. D-010 reste en aval. **⚠️ Motif Q3/P9 caduc sous D-014** : Q3 exigeait le résolveur *au nom de P9* ; P9 ne gouverne plus le statut documentaire. **La décision reste VALIDE** (résolveur, révocation = second fait) mais comme **choix de gouvernance**, **justification à réécrire** — précédent **D-001** (retenue sur une enveloppe non attestée) |
| **D-014** | **Les 10 principes d'OCR-006 visent le PROTOCOLE.** Les Records `.md` sont des **artefacts documentaires** ; **P2, P5, P7** (et par extension les autres) **ne les gouvernent pas** | **rendue + APPLIQUÉE** *(reclassement — pas de code)* | **`c447935`** (2026-07-24) — **généralise D-011** (fait pour P9 seul). Conséquences inscrites : motif de **D-013 à réécrire** ; **amendement d'OCR-006 obligatoire** (portée protocole à déclarer) ; **portée de P10 remontée → D-015** |

## Décisions EN ATTENTE chez l'Architecte

| Réf | Objet | Statut |
|---|---|---|
| **D-010** | **Grain de l'artefact de promotion** — un artefact par Record (fin) vs un artefact multi-événements (gros) | **SUSPENDUE** (en aval de la persistance du statut) — ne pas trancher par conception |
| **D-013 · sous-question** | **Le sort du champ `Status` — REPORTÉE en aval du résolveur.** La mesure a tranché la forme : les **deux** issues (projection *et* retrait) **présupposent le résolveur, qui n'existe pas**. La question n'est donc pas « projection ou retrait » mais « **à quel moment** » — et le moment est **après la conception du résolveur**. Motif mesuré : **4 lecteurs** du champ, **2 projections** (`api.ts:56`, `build-migration-manifest.mjs:74`), **résolveur inexistant** | **REPORTÉE** (en aval du résolveur) |
| **D-015** | **Portée de P10** — P10 s'auto-limite à « the expected behaviour **of the protocol** » (Canonical Statement), mais ses *Consequences* disent « expected behaviour » **sans qualifier** (tension interne). Si P10 vise le protocole, la **dette documentaire** (13 décisions + 11 RD + 17 candidates) serait **sans force normative P10**. Dette chiffrée dans le mémo ci-dessous | **remontée par D-014, non rendue** |
| *(amendement — **OBLIGATOIRE**, dans l'option D-013/Q3 cochée)* | **Déclarer dans OCR-006 que sa portée est le PROTOCOLE** (D-014). P9:250 « any published representation » est **général** → à restreindre. **Principes concernés :** **P2, P5, P7** (nommés par D-014), **P9** (« any published representation »), et **P8** (nomme « documentary versioning » comme couche — **tension** : un principe protocole qui cite le documentaire). OCR-006 en Phase 3, **jamais relu, cité par 0** | à instruire (obligatoire) |

**Dette de normalisation P10 (mémo D-015, chiffrée le 2026-07-24 — constat, pas plan de normalisation) :**

- **Trois gisements, comptés :**

  | Gisement | Nombre | Foyer (hors corpus OCR) |
  |---|---|---|
  | Décisions `D-001…D-013` | **13** (dont `D-003` *sans objet* + `D-012` *retirée* → **11 vivantes**) | `DECISIONS-LOG.md` |
  | Règles découvertes `RD-001…RD-011` | **11** (0 normalisée) | `REGLES-DECOUVERTES.md` |
  | Décisions candidates `[GRAVÉ]` | **17** (18 tokens − 1 exemple ; **pas 16** — antérieur à la reclassification de L230) | `docs/architecture/OPUS-X-ARCHITECTURE-V3.md` |

- **Total brut : 41 entrées** (13 + 11 + 17). **Recouvrement :** au niveau **identité**, aucun — trois
  espaces d'id disjoints (`D-xxx`, `RD-xxx`, tokens candidats). Au niveau **sémantique**, réel :
  `ARCHITECTURE-V3` porte un **bloc de correspondance** (L881–891) mappant **les 11 RD**, plus des échos
  « (synthèse — écho de RD-00n) » — une même règle peut exister comme **RD** (découverte) *et* comme
  **candidate** (à rendre). Le recouvrement exact **n'est pas mécaniquement énumérable** sans lire le sujet
  de chaque candidate ; il est structurel et certain, non chiffré par déduction. **39 obligations vivantes**
  (41 − 2 caduques), majorant du nombre d'objets **distincts**.
- **Sous D-014 / portée de P10 (à trancher, D-015) :** P10 s'auto-limite à « altering the expected
  behaviour **of the protocol** ». La quasi-totalité de ces 39 sont des décisions **documentaires / de
  procédure** (partition de promotion, régime `[GRAVÉ]`, structuration des dettes, résolveur de références
  du site) — **elles n'altèrent pas le comportement du protocole**. Si P10 vise le protocole (D-014), leur
  **force normative P10 tombe** : la clôture de Phase 1 ne serait pas conditionnée à leur normalisation en
  Record. **Constat, pas conclusion** — la portée de P10 est remontée en D-015.

**Matière pour le formulaire D-010 (mesurée, non traitée) :**

- **Grain, chiffré :** fin = 28 amendements de plage sur la Phase 1 (D-004, deux parties) ; gros = 1
  artefact, mais révocation par addition seule (P5), grain de révocation découplé du fichier.
- **Trois manques de la conception a.–e., à combler par l'arbitrage, pas par moi :**
  1. **Révocation** — quelle **série** désigne une promotion révoquée (PROMO ou une nouvelle), et par
     quel **champ** ? Le front-matter proposé **n'a pas de `revokes:`**.
  2. **Identifiant en double** — nom de fichier **et** champ `decision` portent l'id ; deux porteurs
     **peuvent diverger** (pas de source unique).
  3. **Ordre des faits** — tri par `timestamp` ; deux faits sur un même Record au **même timestamp**
     → l'ordre **n'est pas total**. *(Le timestamp est dans le fichier, donc couvert par le checksum
     et déterministe : ce n'est pas la mutabilité, c'est l'**ambiguïté** de l'ordre.)*
- **Préalable D-013 · sous-question** (PARTIE III du dossier de promotion, corrigée) : P9 ne vise
  **pas** le statut documentaire (D-011) ; D-013 a tranché **Q3 prévaut** (statut dérivé, résolveur,
  révocation = second fait) et **retiré D-012**. Reste ouvert le **sort du champ** (projection ou
  retrait). Toute conception du grain (D-010) est **en aval** de cette sous-question, non tranchée.

**Coût des deux issues de la sous-question D-013 (mesuré le 2026-07-24, constat — pas recommandation) :**

- **Porteurs du statut, recensés dans le code :**
  - *Champ documentaire* (`| Status | … |` du `.md`, lu par `loadRecord`/`buildRecordPage`) — **4**
    lecteurs : `recordPage.ts:115` (métadonnée dérivée), `recordPage.ts:143` (+ garde de lacune
    `:145`), `robotsFromStatus` (`:127`, appelé `:165`), **et `app/records/page.tsx:25`** (`p.status`
    via `buildRecordPage`) — *ce dernier ne figurait pas dans la liste de trois : quatrième lecteur*.
  - *Manifeste* `lifecycle_status` : écrit par `manifest.mjs:289`, exposé par **`api.ts:56`**
    (confirmé : **sous Q3, c'est une projection**), **et recopié par `build-migration-manifest.mjs:74`**
    dans un second manifeste — *donc pas une, mais **deux** projections dérivées du champ*.
  - *(Hors périmètre : `registryEntities.ts:142/164`, `registryEntityPage.ts:94/202`,
    `build-graph.mjs:203` lisent le `status` d'une **surface d'entité** — autre domaine, pas le statut
    documentaire du Record. `passport.status` = statut DB du Passport, autre domaine.)*
- **Concordance aujourd'hui : mesurée, 0 divergence** champ↔manifeste sur 33/33 (manifeste régénéré
  `1c9ffa3`). La divergence de 24h40 était transitoire, refermée.
- **Issue « champ RETIRÉ » :** 33 Records modifiés (retrait de la ligne `| Status | … |`), 33 checksums
  changés, manifeste régénéré. **Touche aussi :** les 4 lecteurs du champ perdent leur source → doivent
  consommer le **résolveur** (qui **n'existe pas encore**) ; `robotsFromStatus` perd son entrée ; la
  **garde de lacune** `recordPage.ts:145` (`if (!status) gaps.push('Status')`) s'inverse ; `manifest.mjs`
  n'extrait plus rien → `api.ts:56` renvoie `null` sans résolveur ; `recordPage.test.ts:141-143` et
  `manifest.attestation.test.ts` à ré-outiller. **Le retrait présuppose donc le résolveur**, il ne s'y
  substitue pas.
- **Issue « champ PROJECTION » :** le champ reste mais devient dérivé, **synchronisé à chaque
  promotion** depuis le résolveur. **Faisable ?** Oui — un test de concordance **à trois porteurs**
  (champ · manifeste · résolveur), même classe que `manifest.attestation.test.ts`, prouvé par mutation.
  **Limite honnête :** il atteste la **concordance**, pas la **correction** du résolveur ; et il ajoute
  un **troisième** porteur à tenir synchrone là où le couple à deux a déjà divergé 24h40 (la
  régénération du manifeste est une étape **séparée et manuelle**). Plus de porteurs = plus de surface
  de divergence — exactement le risque que Q3 nomme.

## Dispositif proposé (NON construit — constat de faisabilité)

**Cible :** qu'aucune décision rendue ne puisse rester non appliquée sans que ce soit **visible et
testable**.

- **Minimal (posé ici) :** ce registre, avec la colonne « Appliquée par ». Un lecteur voit d'un coup
  ce qui a atteint le dépôt et ce qui ne l'a pas.
- **Testable (proposé) :** un test qui lit ce registre et **échoue si une décision marquée
  « rendue + appliquée » cite un commit qui n'existe pas** (`git cat-file -e <commit>`), ou si une
  ligne « rendue » sans application dépasse un délai. Faisable : le statut est du texte structuré, le
  commit est vérifiable par git. **Limite honnête :** aucun test ne peut détecter une décision
  **rendue en chat mais jamais inscrite ici** — c'est le trou par lequel D-005 est passée. La seule
  parade est la discipline d'inscription, que le registre rend au moins visible.

Non construit à ce stade (hors mandat — proposition, pas conception).
