# Registre des décisions — rendue vs appliquée

**Motif.** Une décision **rendue** par l'Architecte n'est pas une décision **appliquée** au dépôt.
D-005 a été rendue, jamais propagée, et présentée six tours plus tard comme encore ouverte. Rien
n'attestait qu'elle avait atteint le code. Ce registre est le **chaînon** manquant : chaque décision
y porte le commit qui l'a appliquée, ou l'aveu qu'elle ne l'a pas été. (Proposition (6) du registre
des règles découvertes.)

**Deux colonnes distinctes (correction du 2026-07-25).** *« Inscrite par »* = le **rendu** est gravé dans un
document. *« Appliquée par (code existe) »* = un **artefact de code** (test/générateur) **enacte et garde**
la décision. Une décision peut être **inscrite sans être appliquée** — sans cette distinction, « appliquée
par » **ment par construction**. Classement établi par mesure (`git show --stat` : le commit a-t-il touché
`lib/`/`scripts/`/`*.test` ou seulement `docs/`).

| Décision | Objet | État | Inscrite par (rendu gravé) | **Appliquée par (code existe)** |
|---|---|---|---|---|
| **D-001** | Artefact PROMO à côté du Record | rendue (conception) | *(ce log)* | — · *appl. = étape 6* |
| **D-002 v2** | Modèle B″ — projections | **rendue, NON appliquée** | *(ce log)* | — · **PENDING par conception** (lot B″, jamais exécuté) |
| **D-003** | Fonction d'agrégation | **SANS OBJET** | — | — |
| **D-004** | Série `PROMO` hors plages + garde | **rendue + APPLIQUÉE** | `702c2d7` | **`702c2d7`** — garde de plage, `manifest.attestation.test.ts` |
| **D-005** | OCR-123 → Phase 2, partition **29·3·1** | **rendue + APPLIQUÉE** | `733646f` *(propagation docs)* | **`48be4cd`** — partition = `HORS_PHASE_1` dans `promotionDebt.test.ts` *(⚠️ `733646f` était docs-only)* |
| **D-006** | Régime `[GRAVÉ]` | **rendue + APPLIQUÉE** | `528e303` *(ARCHITECTURE-V3)* | **`ce7c8d0`** — garde de tokens, `candidateInventory.test.ts` |
| **D-007** | Seau B = régime des orphelins | **rendue + APPLIQUÉE** | `528e303` | `ce7c8d0` *(même garde, tokens candidats)* |
| **D-008** | Q2 structurer les dettes | **rendue + APPLIQUÉE** | `31cad76` *(table DETTES)* | **`48be4cd`** — `promotionDebt.test.ts` lit la table *(Q1 → retrait via D-009)* |
| **D-009** | Retirer « modification substantielle » | **rendue, INSCRITE — NON appliquée** | `733646f` *(retrait en docs)* | **—** · *aucun test ne garde le retrait ; il vit en docs* |
| **D-010** | Grain de l'artefact PROMO | **SUSPENDUE** | *(ce log)* | — · *rouvre à l'étape 6* |
| **D-011** | P9 vise le protocole, pas le documentaire | **rendue, INSCRITE — NON appliquée** | `8a8b61d` *(PARTIE III corrigée)* | **—** · *appl. normative = amendement OCR-006 (étape 1)* |
| **D-012** | « le champ gouverne » | **RETIRÉE (par D-013)** | `6f14824` *(inscrite puis retirée)* | **—** · *jamais — conservée au registre avec son motif* |
| **D-013** | Q3 : statut dérivé (résolveur), révocation = 2ᵉ fait | **rendue, NON appliquée** ; sous-question **REPORTÉE** | `77c9df0` | **—** · *résolveur inexistant ; appl. = étapes 4/6 ; motif Q3/P9 caduc sous D-014, décision valide (gouvernance)* |
| **D-014** | Les 10 principes visent le PROTOCOLE | **rendue, INSCRITE — NON appliquée** *(reclassement, pas de code)* | `c447935` | **—** · *appl. = amendement OCR-006 **v2.0.0** (étape 1)* |
| **D-015** | Régime documentaire (consolidation du GAP) | **rendue, INSCRITE — NON appliquée** | `357d924` | **—** · *le régime n'existe pas ; appl. = étapes 2/3/7* |
| **D-016** | PROMO **EST** l'approbation Opus X (`authority`) | **rendue, INSCRITE — NON appliquée** | **`abbdd03`** *(corrigé de `c678947`)* | **—** · *appl. = étapes 4/5/6* |
| **D-017** | Le Record porte son **verdict de grounding** avant promotion | **rendue, INSCRITE — NON appliquée** | **`abbdd03`** *(corrigé de `c678947`)* | **—** · *appl. = étapes 4/5* |
| **D-018** | **Un Record Draft s'édite en place** — l'amendement d'OCR-006 est une **édition**, pas une v2.0.0 (résout le point 4 de la conception 1a). Règle de **régime documentaire** (déficit D-015) | **rendue, INSCRITE — NON appliquée** |  **`4b11bd6`** | **—** · *gouverne l'édition de l'étape 1 (Version **inchangée**) ; règle tracée au régime (D-015)* |
| **D-019** | **Ratification fondatrice unique** — acte **daté, signé Opus X, hors processus ordinaire**, qui rend `{OCR-000, OCR-005}` Normative en premier (sortie de la circularité, `OCR-000:35`). 4ᵉ déficit du régime (D-015) : forme + **lieu** de l'acte | **rendue, INSCRITE — NON appliquée** |  **`b21d06c`** | **—** · *mesures ci-dessous ; ordre + voie = D-020 ; le **lieu** de l'acte n'existe pas (à créer par le régime)* |
| **D-020** | **Voie + ordre** — la ratification émet un artefact d'une **AUTRE NATURE** (pas un PROMO) ; **ordre = portail méta d'abord** (garde d'invariant, faisable). **Deux voies vers Normative** → le résolveur (D-013) lit les deux comme faits de statut | **rendue, INSCRITE — NON appliquée** |  **`d3cab5e`** | **—** · *ferme le cadrage ; séquence finale 0–8 gravée ; lieu conçu ci-dessous* |
| **D-021** | **Ordre de promotion à strates** (précise D-020 pour la place d'OCR-006) : **`{OCR-000, OCR-005}` → `OCR-006` → `{001, 002, 003, 004}` → `{007, 008, 009}` (régime, strate 2) → 23 concepts.** OCR-006 promu **2ᵉ** ; les 3 Records du régime rejoignent la **strate 2 (méta)** | **rendue, INSCRITE — NON appliquée** | **`bfc888a`** | **—** · *ordre d'exécution de l'**étape 8** ; **FAIT gravé (étape 3) : corpus 33→36, promotion 29→32** (`promotionDebt` dit 36/32) ; l'invariant d'ordre (D-020) à vérifier **à strates**. **⚠️ À vérifier avant étape 8** : OCR-009 décrit l'approbation qui gouverne la promotion — dépendance sur sa propre promotion ? (constat pour plus tard)* |

**Compte (mesuré par `git show --stat`) — 17 décisions :**
- **Réellement APPLIQUÉES (un test/code les garde) : 5** — D-004 (`702c2d7`), D-005 (`48be4cd`), D-006 (`ce7c8d0`), D-007 (`ce7c8d0`), D-008 (`48be4cd`).
- **Inscrites, NON appliquées (commit d'inscription, aucun code) : 7** — D-009, D-011, D-013, D-014, D-015, D-016, D-017.
- **Sans application (états) : 5** — D-001 (conception), D-002 (pending), D-003 (sans objet), D-010 (suspendue), D-012 (retirée).
- **Lignes qui affirmaient « appliquée » alors que c'était une inscription : 6** — D-009, D-011, D-014, D-015, D-016, D-017 *(corrigées ci-dessus)*. **+ 3 citations imprécises** (application réelle mais commit **docs** cité au lieu du commit **code**) : D-005, D-007, D-008 *(commit code rétabli : `48be4cd`/`ce7c8d0`)*.
- **Ironie tracée :** la **parade** de la proposition (6) — ce log — **enfreignait la proposition (6)** : sa ligne fondatrice disait « D-005 et D-009 portent leur commit d'application `733646f` », or `733646f` est **docs-only**. Occurrence inscrite au registre (proposition (6), 2ᵉ occurrence).

## Décisions EN ATTENTE chez l'Architecte

| Réf | Objet | Statut |
|---|---|---|
| **D-010** | **Grain de l'artefact de promotion** — un artefact par Record (fin) vs un artefact multi-événements (gros) | **SUSPENDUE** (en aval de la persistance du statut) — ne pas trancher par conception |
| **D-020** | *(RENDUE — voir table principale)* Voie = artefact d'une autre nature ; ordre = portail méta d'abord | **✅ RENDUE le 2026-07-25 — cadrage CLOS** |
| **D-013 · sous-question** | **Le sort du champ `Status` — REPORTÉE en aval du résolveur.** La mesure a tranché la forme : les **deux** issues (projection *et* retrait) **présupposent le résolveur, qui n'existe pas**. La question n'est donc pas « projection ou retrait » mais « **à quel moment** » — et le moment est **après la conception du résolveur**. Motif mesuré : **4 lecteurs** du champ, **2 projections** (`api.ts:56`, `build-migration-manifest.mjs:74`), **résolveur inexistant** | **REPORTÉE** (en aval du résolveur) |
| **Nouveau Record — régime documentaire** | **À écrire (D-015), avant clôture.** Gouverne le corpus documentaire : amendement, intégrité, versioning documentaire, cycle de vie, promotion/révocation, séries/plages, provenance, normalisation. Périmètre = inventaire du sans-règle (mémo ci-dessous). **Série non attribuable** : 0 id libre dans `expected_ranges` (mémo série) | **à instruire — RÉGIME COMPLET** |
| *(amendement — **OBLIGATOIRE**, dans l'option D-013/Q3 cochée)* | **Déclarer dans OCR-006 que sa portée est le PROTOCOLE** (D-014). P9:250 « any published representation » est **général** → à restreindre. **Principes concernés :** **P2, P5, P7** (nommés par D-014), **P9** (« any published representation »), **P8** (nomme « documentary versioning » — tension). **⚠️ Contradiction mesurée : `OCR-006:27`** dit *« Its scope is the set of architectural constraints to which the **entire corpus** is subject »* — le Record **s'auto-attribue le corpus entier**, ce que D-014 **retire**. L'amendement doit lever cette contradiction, pas seulement P9:250. OCR-006 en Phase 3, **jamais relu, cité par 0** | à instruire (obligatoire) |

**Dette de normalisation (mémo D-015, chiffrée le 2026-07-24 — objets DISTINCTS, recouvrements mesurés) :**

- **Trois gisements, comptés :**

  | Gisement | Nombre | Foyer (hors corpus OCR) |
  |---|---|---|
  | Décisions `D-001…D-015` | **15** (dont `D-003` *sans objet* + `D-012` *retirée* → **13 vivantes**) | `DECISIONS-LOG.md` |
  | Règles découvertes `RD-001…RD-011` | **11** (0 normalisée) | `REGLES-DECOUVERTES.md` |
  | Décisions candidates `[GRAVÉ]` | **17** (18 tokens − 1 exemple L40) | `docs/architecture/OPUS-X-ARCHITECTURE-V3.md` |

- **Brut : 43** (15 + 11 + 17). **Recouvrement candidate ↔ RD — MESURÉ, non plus estimé :** 5 candidates
  portent le marqueur explicite « (synthèse — **écho de RD-00n**) » — ce sont des RD sous forme de décision :
  `L326` (RD-009/RD-010), `L435` (RD-005), `L455` (RD-009), `L866` (RD-002), `L996` (RD-011). Soit **5
  tokens candidats = 5 RD distinctes** {002, 005, 009, 010, 011}, déjà comptées dans les 11 RD → **à
  dédupliquer**.
- **Objets DISTINCTS : 38** (43 − 5 échos), dont **36 vivants** (− `D-003`, − `D-012`). C'est **l'ampleur
  du Record à écrire** : ~36 règles/décisions à normaliser ou retirer.
- **Recouvrement décision ↔ candidate — signalé, NON déduit** (sémantique, pas mécanique) : `L899` (« une
  entrée n'est jamais supprimée du registre des dettes ») recoupe **D-008 Q2** ; `L306`/`L314` (phases de
  promotion) recoupent **D-005**/**D-010**. Non retranchés du compte — je ne déduis pas ce que je ne peux
  pas prouver mécaniquement ; le compte **36** est donc un **majorant** des objets vivants distincts.
- **Sous D-014 / portée de P10 :** P10 s'auto-limite à « the expected behaviour **of the protocol** ». La
  quasi-totalité des 36 sont **documentaires / de procédure** → n'altèrent pas le protocole → **force P10
  nulle** sur elles. Mais **D-015 les capte** : le nouveau régime documentaire est précisément leur Record
  d'accueil. **Constat.**

**Série du nouveau Record (mémo D-015 — question circulaire + trous de plage) :**

- **La circularité, résolue par le précédent OCR-006 :** un Record qui gouverne le corpus où il vit —
  `OCR-006:27` le traite explicitement : *« This Record establishes no authority above the protocol. It is
  governed by the same rules as every other Record: it is versioned, citable and amendable. Its scope is the
  set of architectural constraints to which the entire corpus is subject. »* Le nouveau Record suivrait le
  même patron : **un Record comme les autres, sans autorité supérieure, à portée déclarée**.
- **⚠️ Mais `OCR-006:27` dit « the entire corpus is subject » — CONTRADICTION avec D-014** (qui retire le
  documentaire de la portée des principes). OCR-006 s'attribue le corpus entier ; D-014 le lui retire.
  Reportée à l'amendement obligatoire (ligne dédiée) — **à lever, pas à improviser.**
- **Trous de plage — mesurés :** `expected_ranges` = `OCR-000..006` (7 ids) + `OCR-100..125` (26 ids) = **33
  slots**. Les 33 Records **remplissent exactement les 33 slots** → **0 id libre**. Le nouveau Record
  **n'a pas de place** dans les plages déclarées : il force soit une **extension de plage** (geste type
  D-004), soit une **nouvelle série** (geste type PROMO). Constat, pas choix.

**Périmètre du régime — inventaire du SANS-RÈGLE (mémo D-015, action 4 ; constat, aucune règle proposée) :**

| Domaine | Convention appliquée dans le dépôt ? | Écrite où ? |
|---|---|---|
| **Amendement d'un Record** (geste du 20 juil.) | Oui, *de fait* : éditer le `.md` + régénérer le manifeste. **Qui l'autorise : personne de déclaré** | **Nulle part** (pratique git seule) |
| **Intégrité** (manifeste, checksums) | Oui : `manifest.mjs` génère, `manifest.attestation.test.ts` atteste par mutation | **Code/test** — pas de source normative ; le **statut** du checksum (normatif ? indicatif ?) est non écrit |
| **Versioning documentaire** (`Version`, `Last Update`, `Version History`) | Champs présents dans les Records ; P8 **nomme** les couches | **Nulle part** — aucune règle sur qui incrémente, quand, comment |
| **Cycle de vie** (`Draft`/`Normative` — champ `Status`) | Oui, *lu* : `robotsFromStatus` en dérive `noindex`/`index` | **Code seul** — aucune règle écrite sur la **transition** (qui passe Draft→Normative, sur quel critère) |
| **Promotion & révocation** | Non — c'est l'objet même de la Phase 1, en cours | **Nulle part** (décisions D-001…D-013 éparses, aucun régime) |
| **Séries d'id & `expected_ranges`** | Oui : garde de plage (`manifest.attestation`), série PROMO déclarée (D-004) | **Code/test + D-004** — pas de Record |
| **Provenance & transmission** (chemin + hash en tête) | Oui, *de fait* : discipline appliquée aux documents transmis | **Nulle part dans le dépôt** (convention de session) |
| **Normalisation des décisions** | Non — `DECISIONS-LOG` **rend visible** la dette (prop. (6)) mais n'est **pas** un Record | **Document de travail**, pas un Record (P10) |

**Lecture :** sur 8 domaines, **aucun** n'a de source **normative écrite dans un Record**. Deux ne tiennent
que par un **test** (intégrité, plages), deux par du **code** (cycle de vie, versioning lu), quatre par une
**pratique non écrite** (amendement, promotion, provenance, normalisation). C'est **exactement** le vide que
D-015 confie au nouveau Record.

**Chaîne de dépendances — SÉQUENCE CORRIGÉE par §295 (état au 2026-07-25 ; a changé quatre fois) :**

`§295` d'OCR-006 : *« inconsistency … SHALL be resolved through the … normative amendment process rather
than by interpretative precedence. »* Donc **D-011/D-014/D-015 ne sont pas opposables tant qu'elles ne
sont pas normalisées** — on **ne peut pas** écrire le régime **en s'appuyant sur** D-014 avant que D-014
soit gravée. L'ordre n'est **pas** « amendement ∥ régime en parallèle » (faux) mais une **séquence
stricte** :

```
1. AMENDER OCR-006          → rend D-011 / D-014 opposables (via processus normatif §295, PAS précédence)
        ↓
2. ÉCRIRE le Record du régime documentaire   (dépend de l'opposabilité de D-014)
        ↓
3. NORMALISER les ~36        (dette distincte ; force P10 une fois le régime en place)
        ↓
4. D-010 (grain) puis PROMO-001              (l'objet documentaire ne précède ni sa règle ni son régime)
```

**Le déplacement :** `PROMO-001` et `D-010`, jadis en aval de D-013, sont désormais **en bout de chaîne** —
en aval de l'**opposabilité** de D-014, elle-même en aval de l'**amendement**. **Rien ne commence avant que
l'amendement soit gravé.**

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

---

## Précondition D-015 — matière de l'amendement OCR-006 (mesures du 2026-07-24)

> L'amendement d'OCR-006 est une **précondition** de D-015 : écrire le régime documentaire pendant
> qu'OCR-006 revendique « the entire corpus » produirait deux textes en conflit. Ces trois mémos
> **préparent la matière, sans écrire** ni l'amendement ni le régime.

### Mesure 1 — relevé exhaustif : passages d'OCR-006 revendiquant une portée que D-014 retire

Balayage des 10 principes **et** du texte de cadrage. *(D-014 : les principes visent le protocole ; les
Records `.md` sont documentaires, hors portée.)*

| # | Ligne | Verbatim (abrégé) | Ce que D-014 retire |
|---|---|---|---|
| **A** | `:27` (cadrage) | « Its scope is the set of architectural constraints to which the **entire corpus** is subject » | Le **corpus documentaire** n'est plus « subject » — portée à restreindre au protocole |
| **B** | `:293` (Conclusion) | « They state the constraints to which **the corpus, including this Record**, is subject » | **Plus fort que A** : auto-inclusion explicite du corpus documentaire. À restreindre |
| **C** | `:250` (P9) | « Status SHALL NOT be stored as a column, field or attribute of **any published representation** » | Le champ `Status` **documentaire** (D-011) sort — « any » est trop général |
| **D** | `:256` (P9 note) | « Persisting a status … modifying that representation, **which Principle 5 forbids** » | Étend P5 à « that representation » (documentaire) ; l'invocation de P5 tombe pour le documentaire |
| **E** | `:216` (P8) | « **Documentary versioning**, normative versioning and representation versioning are independent » | P8 **nomme** le versioning documentaire comme couche gouvernée — tension frontale avec D-014 |
| **F** | `:220` (P8 motiv.) | « **a Record carries a version**, the norm it describes carries a version… » | P8 atteint explicitement le **Record** (documentaire) |
| **G** | `:139` (P5) | « **A published representation is never modified** » | Énoncé général (angle mort déjà relevé) ; à borner au protocole |
| **H** | `:210` (P7) | « The criterion applies to **any property**, including properties introduced after this Record » | Portée « any property » à borner au protocole |
| **I** | `:3` (sous-titre) | « constraints governing identity, **representation, publication, versioning** and protocol evolution » | Le cadrage général englobe representation/publication/versioning documentaires |
| *(sec.)* | `:45`,`:47`,`:168` | « the corpus », « every publication », « as long as the corpus exists » | Références de **motivation** au corpus — à relire une fois A/B tranchés |

- **Total : 8 passages substantiels (A–H) + 1 cadrage (I) + 3 échos de motivation.** Les deux connus
  (§27, P9:250) n'étaient **pas** les seuls : **§293 (auto-inclusion), P8 (documentary versioning + « a
  Record carries a version »), P5:139, P7:210** revendiquent aussi le documentaire.
- **⚠️ La voie est prescrite par OCR-006 lui-même — `:295` :** « Where an inconsistency is identified
  between this Record and another normative Record, the inconsistency SHALL be resolved through the
  protocol's **normative amendment process** rather than by interpretative precedence. » Donc D-014 (une
  **décision**, pas un Record) **ne peut pas** primer OCR-006 par précédence : l'amendement **doit**
  passer par le processus normatif — ce qui **est** la précondition, et renvoie à **P10** (normaliser la
  décision dans un Record).

### Mesure 2 — le Record du régime : deux questions à instruire (pas à trancher)

- **Identifiant — extension de plage (geste D-004) *ou* série nouvelle :**
  - *Extension de plage* (`OCR-000..006` → `…007`) : le Record entre dans le **namespace OCR** (sémantique :
    un Record gouvernant le corpus, comme OCR-006). Implique **éditer `expected_ranges`** dans le générateur
    + la **garde de plage** (`manifest.attestation`) pour admettre le nouvel id. Coût : 1 id, 1 garde mise à
    jour. Signal : « c'est un pair d'OCR-006 ».
  - *Série nouvelle* (ex. `REG-001`, geste PROMO) : le Record vit **hors plages OCR** ; D-004 a déjà établi
    que la garde admet une **série déclarée hors plage**. Coût : déclarer la série. Signal : « c'est un objet
    d'une **autre nature** que les OCR » — ce qui **contredirait** l'idée qu'il est un Record comme les
    autres (cf. patron ci-dessous). **Constat, pas choix.**
- **Circularité — le patron d'OCR-006:27 survit-il à l'amendement ?**
  - Le patron : *un Record comme les autres, sans autorité supérieure, à **portée déclarée**.* Sa **forme**
    survit — le régime documentaire se déclarerait de portée « corpus documentaire », comme OCR-006 se
    déclare de portée « protocole ».
  - Mais l'amendement **touche la phrase même** qui porte le patron (§27/§293 : la déclaration de portée).
    Après amendement, OCR-006 déclare **protocole**, le régime déclare **documentaire** : les deux portées
    **partitionnent** le corpus. L'**auto-inclusion** (§293, « including this Record ») est ce que le régime
    reprend : gouvernant le corpus documentaire, il **se gouverne lui-même** — exactement le mécanisme
    d'OCR-006. **Le patron survit ; l'amendement en change le contenu (la portée), pas la forme.**

### Mesure 3 — les 8 domaines × matière existante (consolider vs écrire)

> **⚠️ CORRIGÉ le 2026-07-25 — voir « Correction majeure » en fin de document.** Ce tableau ne lisait que
> `docs/registry/` et le code ; il **ignorait la couche de gouvernance documentaire OCR-000…005** (que je
> n'avais pas lue). Les colonnes « sans formulation »/« nulle part » sont **fausses** pour ≥ 4 domaines :
> l'amendement, le versioning, le cycle de vie et les séries **sont déjà gouvernés** par OCR-000/001/005.
> Le tableau est **laissé tel quel** (mesure non retouchée) ; la correction vaut en bloc ci-dessous.

| Domaine | Déjà formulé (où) | Sans formulation | Verdict |
|---|---|---|---|
| **Amendement d'un Record** | Rien de documentaire ; P5/§295 sont **protocole** (retirés par D-014) | **L'autorisation du geste** (20 juil.) — qui, quand, comment | **ÉCRIRE** (fondation : gouverne le geste qui produit tous les autres) |
| **Intégrité** (manifeste, checksums) | **RD-004** (coordonnée scellée dans le condensat), candidate `L260` (empreinte = contenu canonique), `manifest.attestation` | Le **statut normatif** du checksum | **CONSOLIDER** |
| **Versioning documentaire** | P8 **nomme** les couches ; **RD-007** (cycle de publication) | Règles sur `Version`/`Last Update`/`Version History` (qui, quand) | **PARTIEL** |
| **Cycle de vie** (`Draft`/`Normative`) | **D-011**, **D-013** (+ sous-question), **RD-002**, candidate `L866` (« deux statuts distincts ») | La **transition** (critère de passage) | **CONSOLIDER** (riche) |
| **Promotion & révocation** | Promotion : **D-001/D-005/D-010**, dossier, candidates `L306`/`L314` ; **PROMO** (D-004) | **Révocation** : seulement P5 (protocole) + matière D-010 | **CONSOLIDER** promotion ; **ÉCRIRE** révocation |
| **Séries d'id & `expected_ranges`** | **D-004** + garde de plage ; candidate `L637` | Rien de majeur | **CONSOLIDER** |
| **Provenance & transmission** | **RD-006** (source plausible ≠ vérifiée), candidates `L326`/`L328` (métadonnée dérivée) | La discipline **chemin + hash** (non écrite au dépôt) | **PARTIEL** |
| **Normalisation des décisions** | **P10** (protocole), **prop. (6)** + **(7)**, **RD-002**, ce **DECISIONS-LOG**, candidate `L893` | Le **régime documentaire** de normalisation (Record d'accueil) | **CONSOLIDER** |

- **Ordre de rédaction que la matière dicte :** un seul domaine part **de rien** — **l'amendement d'un
  Record** — et c'est le **fondement** (il autorise le geste par lequel tous les autres s'écrivent). Deux
  sont **partiels** (versioning, provenance/transmission). Cinq sont **à consolider** (matière déjà dense).
  La révocation est le seul sous-domaine caché **à écrire**. **Consolider ≠ écrire** : ~5/8 domaines sont
  de la reprise, 1 est de la fondation neuve, 2 sont mixtes.

---

## Précondition D-015 — mesures du 2026-07-25

**Séquence corrigée (§295) inscrite en tête** (bloc « Chaîne de dépendances »). Deux mesures, plus une
correction majeure.

### Mesure 1 — les huit passages : UN acte ou HUIT ? → **DEUX**

A/B posent la portée générale ; on teste si une **clause de portée unique** (« la portée d'OCR-006 est le
protocole ; le corpus documentaire relève d'un régime distinct ») règle A et B et **absorbe** les six
autres.

| Passage | Une clause de portée le règle-t-elle ? |
|---|---|
| **A** `:27`, **B** `:293` | **C'est la clause elle-même** (portée générale) |
| **C** `:250` « any published representation » | ✅ **Absorbé** — devient « any published *protocol* representation » ; le champ documentaire sort par construction |
| **D** `:256` note (invoque P5) | ✅ **Absorbé** — l'invocation de P5 se borne au protocole |
| **G** `:139` « never modified » (P5) | ✅ **Absorbé** pour D-014 (borné au protocole). *(L'ambiguïté interne Statement↔Consequences de P5 reste, mais c'est un défaut distinct, pas de D-014.)* |
| **H** `:210` « any property » (P7) | ✅ **Absorbé** — « any property » d'une définition *protocole* |
| **E** `:216` « **Documentary versioning** … independent » (P8) | ❌ **NON absorbé** — P8 **nomme** le versioning documentaire comme couche gouvernée. Une clause « le documentaire est hors » **contredit** le texte de P8 et **gut** son propos (l'indépendance des trois couches *exige* que la couche documentaire existe dans P8). **Acte propre requis.** |
| **F** `:220` « **a Record carries a version** » (P8) | ❌ **NON absorbé** — même motif que E (P8 atteint le Record) |

**Constat : l'amendement est DEUX actes** — (1) **une clause de portée** absorbant A/B/C/D/G/H, et (2) **un
acte spécifique sur P8** (E/F), car P8 concerne *intrinsèquement* la relation documentaire↔normatif↔
représentation et ne peut être « exclu » sans être détruit. **P8 est l'exception irréductible.** *(Et son
sujet — le versioning documentaire — chevauche `OCR-005`, cf. correction ci-dessous : le geste sur P8 est
« déférer le versioning documentaire à OCR-005 ».)*

### Mesure 2 — le processus d'amendement normatif : **il EXISTE, il est DÉFINI**

`§291`/`§295` nomment « the protocol's normative amendment process ». **Il n'est pas seulement nommé — il
est défini**, dans la couche de gouvernance :

- **`OCR-000` (Canonical Knowledge Governance)** — autorité (Opus X), modèle de statut (Draft → Normative →
  Deprecated/Superseded), **promotion `Draft → Normative` = grounding + approbation Opus X**, « never silent
  edits », histoire préservée. *« sets the governance frame within which every OCR is written and
  maintained »* ; s'applique aux méta-documents **000–005**.
- **`OCR-005` (Versioning Rules)** — semver (MAJOR incompatible / MINOR / PATCH), transitions de statut,
  **« published normative meaning MUST NOT be edited in place; a change MUST be a new version »**, « recorded
  in Version History with its version and date », versions supersédées préservées.

**Donc amender OCR-006 = publier `OCR-006 v2.0.0`** (MAJOR : la portée change de façon incompatible), la v1.x
**préservée comme superseded**, consignée en Version History, avec approbation Opus X + grounding. **Le
« comment on amende » n'est PAS à inventer** — contrairement à ce que j'avais supposé au tour précédent. Le
processus est **défini** (OCR-000 + OCR-005) ; ce qui reste partiel est son **outillage** (les Records
portent bien les champs Version/Version History/Status via OCR-001, mais aucun test n'atteste le semver ni
le no-silent-edit).

### ⚠️ Correction majeure — le corpus documentaire N'EST PAS sans règle

En lisant enfin les méta-Records, la prémisse « D-014 laisse le corpus documentaire sans principe → écrire
un nouveau régime » s'avère **largement fausse**. Une **couche de gouvernance documentaire complète existe
déjà** :

| Record | Gouverne |
|---|---|
| **OCR-000** Canonical Knowledge Governance | autorité, modèle de statut, grounding, no-silent-edit, préservation de l'histoire — « la constitution » |
| **OCR-001** Canonical Registry Structure | **numérotation** (000–005 méta · 100s · 200s · 300s), un-concept-par-OCR, structure de document, **plages** (« numbers MUST be durable … MUST NOT be reassigned … extensible ») |
| **OCR-002** Editorial Rules | registre éditorial |
| **OCR-003** Terminology Governance | terminologie |
| **OCR-004** Entity Relationships | relations |
| **OCR-005** Versioning Rules | semver, transitions, change records, no-silent-edit, préservation |

**Reclassement des 8 domaines (corrigé) :** **amendement d'un Record** → OCR-005:46 + OCR-000 (**gouverné** ;
« nulle part » était faux) · **versioning documentaire** → OCR-005 + OCR-001:45 (**gouverné**) · **cycle de
vie** → OCR-000:47 + OCR-005 (**gouverné** ; la transition = grounding + approbation Opus X **est** écrite)
· **promotion/révocation** documentaires → OCR-000:45/47 (**gouverné**) · **séries & plages** → OCR-001:31-35
(**gouverné**). Restent réellement partiels : **intégrité** (le checksum est un outil de dépôt, pas dans un
Record ; OCR-001:62 exige seulement « derived artifacts match source »), **transmission** (chemin+hash =
convention de session, hors Record), et le **backlog** des 36 décisions non normalisées (le *déficit*, pas
l'absence de règle). **6 domaines sur 8 sont gouvernés**, pas zéro.

**Conséquences (constat, pas conception — je ne réoriente pas D-015 sans votre arbitrage) :**

1. Le « nouveau Record » de D-015 est **en grande partie déjà écrit** (OCR-000…005). La question n'est plus
   « écrire un régime » mais « **quel est le GAP** entre OCR-000…005 et ce que D-015 exige ? » — vraisembla-
   blement : intégrité/checksums, transmission, et l'accueil du backlog décisionnel.
2. La **série** du régime (mesure du tour précédent) se précise : OCR-001 réserve **000–005** aux méta-
   documents — or **OCR-006 est déjà hors de cette plage** (numéro 6 ∉ 000–005), anomalie à relever. Un
   régime documentaire serait un **méta-document** → il faudrait **étendre la plage méta** dans OCR-001 lui-
   même, pas seulement dans `expected_ranges`.
3. `§295` s'applique **aussi** à OCR-000…005 : si le régime les **amende/étend**, c'est le **même processus
   normatif** (nouvelle version), pas un Record neuf ex nihilo.

**Rien réorienté. La séquence corrigée tient. Je remonte le GAP à instruire — la décision de reframer D-015
(nouveau Record vs amendement d'OCR-000…005) vous revient.**

---

## Précondition D-015 — mesures du 2026-07-25 (après lecture INTÉGRALE des méta-Records)

### Mesure 1 — état de lecture (provenance : « lu » seulement ce que je tiens)

| Record | Lu intégralement CE chantier ? |
|---|---|
| **OCR-000** Governance · **001** Structure · **002** Editorial · **003** Terminology · **004** Relationships · **005** Versioning · **006** Principles | **OUI — le 2026-07-25 (ce tour).** Avant : **partiel** (fragments via `grep`) — c'est l'angle mort qui a produit les deux renversements (champ Status, puis OCR-000…005) |
| **OCR-100…125** (26 Records de concept) | **NON — jamais ouverts intégralement ce chantier.** Au mieux *partiel* : OCR-110 (Evidence, pilote GEO) manipulé par sections ; OCR-100/114/123 en fragments. **Les 26 restent non certifiés.** |

- **L'angle mort SUBSISTE : 26 Records de concept non lus.** Trois sont **potentiellement pertinents** pour
  le GAP ci-dessous — **OCR-112** (Evidence Lifecycle), **OCR-113** (Evidence Integrity), **OCR-124**
  (Canonical Registry) — donc mes verdicts « déficit » sur **intégrité** et **cycle de vie** sont
  **provisoires** tant que ces trois ne sont pas lus.

- **⚠️ Correction à la Mesure 1 du 2026-07-24 (un acte ou huit) — le header `OCR-006:13` la révise :** il
  déclare *« informative sections create no independent obligation and shall never be interpreted as
  extending, restricting or redefining their meaning; … the normative sections take precedence. »* Or, des
  8 passages relevés, **seuls C (`:250` P9), E (`:216` P8), G (`:139` P5) sont NORMATIFS** ; **A (`:27`),
  B (`:293`), D (`:256`), F (`:220`), H (`:210`) sont INFORMATIFS** (Introduction/Motivation/Notes/
  Conclusion). Donc les passages « entire corpus » (§27) et « including this Record » (§293) **ne créent
  aucune obligation** — la « contradiction » avec D-014 est **moins forte que je ne l'ai dite** : c'est du
  cadrage informatif, à **aligner éditorialement** (PATCH), pas un conflit normatif. **Les vraies cibles
  normatives de l'amendement sont trois : C, E, G** — une clause de portée couvre **C** et **G**, **E (P8)
  reste l'exception**. *(Défaut relevé : `§295` emploie « SHALL » dans une section informative — misuse au
  sens `OCR-002:38`.)*

### Mesure 2 — le GAP réel, domaine par domaine (citations verbatim des méta-Records)

| Domaine | Gouverné par — verbatim | Verdict |
|---|---|---|
| **Amendement d'un Record** | `OCR-005:46` « Published normative meaning MUST NOT be edited in place; a change MUST be a new version » + `OCR-000:59` « Canonical meaning MUST NOT be changed silently; changes MUST be versioned » ; autorité `OCR-000:35` (Opus X, sole write authority) | **GOUVERNÉ** *(un correctif purement éditorial reste un PATCH, `OCR-005:34/54`)* |
| **Versioning documentaire** | `OCR-005:31` semver, `:35` « Version field MUST reflect… Version History MUST record each release » ; `OCR-001:45` (Version History = section requise) | **GOUVERNÉ** |
| **Cycle de vie** (`Draft`/`Normative`) | `OCR-000:42-47` (modèle de statut) + `OCR-005:39` « Draft → Normative MUST require grounding… and Opus X approval » | **GOUVERNÉ** — la transition **est** écrite |
| **Promotion & révocation** | Promotion = `OCR-000:47` + `OCR-005:39` ; révocation = `OCR-000:44-45` (Deprecated/Superseded) + `OCR-005:40-41` | **GOUVERNÉ** — *et la promotion Phase 1 des 33 Draft EST cette promotion `Draft→Normative` : elle exige grounding + approbation Opus X* |
| **Séries & `expected_ranges`** | `OCR-001:31-35` (plages, durable, non réassigné) + `:56` (extensible) | **GOUVERNÉ** (+ anomalie OCR-006, mesure 3) |
| **Normalisation des décisions** | `OCR-006` P10 `:280` « Where an existing Record is conceptually appropriate… otherwise a new Record SHALL be created » + `OCR-000` (dérive sans autorité) | **GOUVERNÉ** (la règle) — le **backlog** des 36 est un déficit d'**exécution**, pas de règle |
| **Intégrité** (checksums, manifeste) | Cherché « checksum / hash / integrity / digest / manifest / derived artifact » dans OCR-000…005 : **rien**, sauf `OCR-001:55` « derived artifacts MUST match [source] » (exigence de concordance, pas de sceau) | **DÉFICIT** au niveau méta *(provisoire : `OCR-113` Evidence Integrity non lu)* |
| **Provenance & transmission** | Provenance : `OCR-002:51` « Unattributed or invented facts, quotes, or citations — prohibited ». Transmission (chemin+hash) : cherché « transmission / path / hash / provenance » dans OCR-000…005 : **rien** | Provenance **PARTIELLE** ; transmission **DÉFICIT** (convention de session, hors Record) |

- **Bilan corrigé : 6/8 domaines GOUVERNÉS** par OCR-000/001/002/005/006-P10. **Déficits réels et
  mesurés (recherche citée) : intégrité** (mécanisme de sceau — aucun terme checksum/hash dans OCR-000…005 ;
  provisoire vs OCR-113), **transmission** (chemin+hash absent des méta-Records), et le **backlog** des 36
  (exécution). **Un déficit affirmé est ici un déficit cherché.**

### Mesure 3 — l'anomalie OCR-006 hors plage méta (000–005)

- `OCR-001:31` : « **OCR-000–005** — meta/governance documents. » OCR-006 est le **n°6**, **hors** de la plage.
- **Depuis quand :** `OCR-006` Version History = « 1.0.0 (**2026-07-20**) » ; `OCR-001` = « 1.0.0
  (**2026-07-16**) ». **OCR-006 a été créé 4 jours APRÈS** qu'OCR-001 a fixé la plage 000–005 — **sans
  amender OCR-001**. Anomalie **d'origine**, datée du **2026-07-20**.
- **Clause d'admission ?** Lu OCR-001 en entier : **aucune**. `:56` « extensible without disturbing existing
  addresses » autorise l'extension mais **ne déclare pas** 006 comme méta ; `:35` (durable/non réassigné) ne
  l'admet pas. **Donc :** ajouter un Record méta au-delà de 005 **aurait dû** être une **version MINOR
  d'OCR-001** (`OCR-005:33` : ajout compatible) — non faite pour OCR-006. **Précédent pour le régime :** un
  nouveau Record méta **exige d'amender la plage dans OCR-001**, pas seulement `expected_ranges` du dépôt —
  et OCR-006 est la preuve que ce geste a **déjà été omis une fois**.

---

## Précondition D-015 — mesures du 2026-07-25 (2ᵉ lot ; OCR-112/113/124 lus intégralement)

### Action 1 — lecture d'OCR-112/113/124, puis tranche du GAP

**OCR-112/113/124 : lus INTÉGRALEMENT le 2026-07-25.** Ils sont tous trois **de couche 100 (concepts
protocole)**, pas des méta-Records — ce qui décide la tranche :

- **Intégrité documentaire → RESTE EN DÉFICIT.** `OCR-113` (Evidence Integrity) gouverne l'intégrité des
  **payloads Evidence** : `:91` « Integrity MUST be computed over the JCS (RFC 8785) canonical form », HMAC,
  recomputation constant-time. **Objet protocole, pas le corpus documentaire.** Le sceau des `.md` (sha256
  du manifeste) n'est **couvert par aucun Record** ; le plus proche reste `OCR-001:55` (« derived artifacts
  MUST match source » — concordance, pas sceau). **Déficit confirmé, non plus provisoire.**
- **Cycle de vie documentaire → GOUVERNÉ (confirmé, renforcé).** `OCR-112` (Evidence Lifecycle) est le cycle
  des **faits Evidence** (observation→acceptance→supersession), **autre objet**. Mais **`OCR-124`
  (Canonical Registry) gouverne le cycle des OCR eux-mêmes** : `:72` State Machine « States of an OCR:
  Draft → Normative → (Deprecated | Superseded) », `:63-68` Lifecycle (Drafting→Grounding→Promotion→…),
  `:91` « An OCR MUST NOT be promoted to Normative while contradicting the implementation ». **Cycle de vie
  documentaire = gouverné par OCR-000 + OCR-005 + OCR-124.** Non-déficit.

### Action 2 — PRISE MAJEURE : la grille de promotion ignore les deux vraies portes

La grille attestée (empreinte, citations, invariants, dette) mesure la **cohérence documentaire**. Or la
promotion `Draft → Normative` exige **deux portes normatives qu'elle ne touche pas** :

- **GROUNDING — défini, verbatim.** `OCR-000:49-53` « The Grounding Rule (Normative) » : « Any OCR whose
  normative machine-facing sections (definitions, JSON-LD, examples, wire formats) describe protocol
  behavior **MUST be diffed against the current implementation before promotion to Normative** » · « An OCR
  that contradicts the implementation **MUST NOT** be Normative » · « the disagreement **MUST** be resolved
  … before promotion ». Repris par `OCR-005:39`, `OCR-124:64/91`. **Concrètement : un diff doc↔code des
  sections machine.** La preuve vit déjà dans les en-têtes : `OCR-113`/`OCR-112` portent **`Review Status:
  Pending machine-section diff against production code`** et une **Grounding note** nommant l'émetteur de
  prod à differ. **La grille ne mesure PAS cela** — empreinte/citations/invariants/dette sont
  **orthogonaux** au grounding.
- **OPUS X APPROVAL — requis, tracé, mais sous-spécifié.** `OCR-000:47/57` + `OCR-005:39` l'exigent. Sa
  **trace** : `OCR-005:55` « Promoting Draft → Normative — recorded as a release with the grounding note
  resolved » (Version History) + le champ **`Review Status`**. **Mais la FORME de l'approbation** (qui signe,
  quel artefact) **n'est définie nulle part** — ni signature, ni format d'acte. Requis + traçable, non
  formalisé.
- **Conséquence (constat) :** promouvoir les 33 Draft sur la **seule grille** violerait `OCR-000:47` /
  `OCR-005:39` / `OCR-124:91`. **Il manque à la grille les deux portes normatives — grounding (doc↔code) et
  approbation Opus X — et personne ne l'avait vu.** *(Note : les 33 Records portent tous `Status: Draft` ;
  la « promotion Phase 1 » EST la promotion `Draft→Normative` d'OCR-000/124, pas une opération distincte.)*

### Action 3 — force de §295 : INFORMATIF (mais sa substance est normativement ancrée ailleurs)

- **Section :** `§295` (et `§293`, `§291`) vivent dans **`## Conclusion`** (`OCR-006:289`). Le header `:13`
  liste l'informatif = « Introduction, Motivation, Notes, **Conclusion** ». **Donc §295 est INFORMATIF** —
  et son « SHALL » est un **misuse** au sens `OCR-002:38` (« informative passages MUST NOT imply
  normativity »).
- **Portée corrigée :** la voie « incohérence → amendement, pas précédence » qu'énonce §295 est donc
  **recommandée, pas imposée** *par §295*. **MAIS sa substance est normativement garantie ailleurs :**
  `OCR-005:46` (« a change MUST be a new version ») + `OCR-000:59` (« changes MUST be versioned ») imposent
  qu'un changement de sens d'OCR-006 passe par une **nouvelle version** ; et surtout **`OCR-006` P10 `:279`
  (NORMATIF)** : « A conversation, working report, design exchange or implementation **SHALL NOT** be cited
  as the normative source of a rule. » **C'est P10, pas §295, qui rend D-011/D-014 (décisions de chat)
  non-opposables tant qu'elles ne sont pas dans un Record.**
- **La séquence corrigée TIENT** — mais son autorité est **P10:279 + OCR-005** (normatifs), **pas §295**
  (informatif). L'amendement d'OCR-006 reste **utile et requis** (C/E/G sont normatifs et contredisent
  D-014), et il prend la **forme d'une version MAJOR** (OCR-005), avec grounding + approbation (OCR-000).

### Action 4 — le précédent OCR-006 : une COUVERTURE, pas deux dettes

Ajouter un Record méta exige d'amender la plage d'`OCR-001` (**MINOR**, `OCR-005:33`). OCR-006 a **omis** ce
geste le 2026-07-20 (mesure 3, 1er lot). **Si un Record de régime est ajouté**, le **même** MINOR d'OCR-001
qui déclare sa plage **répare aussi l'omission d'OCR-006** — étendre `OCR-000–005` à `OCR-000–00X` couvre
006 **et** le nouveau. **Une occasion, une version d'OCR-001, deux dettes réglées.** *(À défaut, l'anomalie
OCR-006 subsiste comme violation dormante de `OCR-001:31`.)*

---

## Précondition D-015 — mesures du 2026-07-25 (3ᵉ lot : grounding, 3 déficits, priorisation)

### Mesure 1 — état réel du grounding : le dispositif EXISTE, la boucle est OUVERTE

- **Review Status des 33 Records — mesuré :** **aucun n'est passé « groundé »**. 17 portent « Pending
  **machine-section diff** against production code », 16 « Pending **editorial** review ». Sur les **29 de
  Phase 1** : **15** en « machine-section diff » (grounding doc↔code requis), **14** en « editorial ». **Et
  les 33 sont `Status: Draft`** — 0 promu.
- **⚠️ Le dispositif de grounding est DÉJÀ ÉCRIT — `OCR-GROUND-001`** (`docs/web/OCR-GROUND-001-*` : mandat,
  addendum, **rapports F1 evidence / F2 framework / F3 issuer**). **MANUEL** (diff doc↔**code et migrations
  VERSIONNÉS** du dépôt, jamais la base live ; addendum §B), pilotes OCR-110/101. **A tourné** — verdicts
  « **Conforme** » dominants.
- **Périmètre couvert (mesuré) :** F1 = {110,111,112,113,114}, F2 = {105,113,115,116,117,118,119}, F3 =
  {120,121} → **13 Records de concept groundés**. Des **15 machine-facing de Phase 1**, **~9 ont un rapport**
  (105,110,111,112,113,115,119,120,121) ; **6 non** (101,104,106,107,108,109).
- **La boucle est OUVERTE :** le grounding a été **produit en rapports** mais **(a)** non réécrit dans le
  `Review Status` des Records (tous encore « Pending »), **(b)** aucune promotion `Draft→Normative` n'a
  suivi, **(c)** la **grille de promotion attestée ne consomme pas** ces rapports. **Constat : grounding ≠
  0 % — il est fait à ~60 % des machine-facing de Phase 1, mais déconnecté des Records et de la promotion.**

### Mesure 2 — TROIS déficits, confirmé (pas deux)

Le déficit de **forme de l'approbation Opus X** est de **même nature** que les deux du gap documentaire
(règle absente d'un Record). **La liste des déficits du régime documentaire est donc :**

1. **Intégrité documentaire** — le sceau sha256 des `.md` (manifeste) n'a pas de Record (OCR-113 = payloads Evidence).
2. **Transmission** — la discipline chemin + hash n'a pas de Record (convention de session).
3. **Forme de l'approbation Opus X** — requise (`OCR-000:47`) et tracée (`OCR-005:55`), mais l'**acte** (qui signe, quel artefact) n'est **défini nulle part**.

### Mesure 3 — les 23 concepts non lus : priorisés par métadonnée, non lus

- **Kind/Layer :** les 23 sont **tous** couche 100 (concepts de protocole), **aucun n'est `Kind: Meta —
  Governance`** (seuls 000–005 le sont). Le seul concept ayant gouverné du documentaire était **OCR-124**
  (Canonical Registry) — **déjà lu**.
- **Shortlist « risque de renverser une prémisse », vérifiée par la Canonical Definition (1 ligne, non lus) :**
  - **OCR-119** Framework Registry → « the **resolution layer** … skill-mapping table » = mécanisme
    protocole, **pas** un registre documentaire. Grounded (F2). **Risque BAS.**
  - **OCR-111** Evidence Source → « the **provenance model** … every Immutable Fact carries verifiable
    attribution » = provenance **protocole** (comme OCR-113 pour l'intégrité), **autre objet** que la
    transmission documentaire. **BAS**, mais adjacent au déficit « provenance » — lecture de confirmation utile.
  - **OCR-106** Trust Status → « Trust Status is the current **computed output** » = statut **protocole**
    calculé (P9-adjacent), pas le `Status` documentaire. **BAS**, adjacent à P9.
- **Conclusion :** **le risque de renversement de prémisse est largement CLOS.** La gouvernance documentaire
  est concentrée dans **OCR-000…005 + OCR-124** — tous lus. Aucun des 23 n'est un concept de gouvernance
  documentaire. **Les deux seuls valant une lecture de confirmation** (car adjacents à des déficits nommés) :
  **OCR-111** (provenance) et **OCR-106** (statut/P9) — vraisemblablement objets protocole distincts. Les 21
  autres : protocole pur (identité, trust, vérification, passeport, skills, issuers), **risque nul** pour le
  régime. *(Classement par métadonnée, non certifié par lecture intégrale.)*

---

## Précondition D-015 — mesures du 2026-07-25 (4ᵉ lot : OCR-111/106 lus, boucle chiffrée, raccord)

### Mesure 1 — OCR-111 & OCR-106 lus intégralement → objets protocole, confirmé

- **OCR-111 (Evidence Source) = provenance PROTOCOLE.** `:42` « the verifiable provenance of an Evidence —
  the Certified Issuer that produced it and the source records it derives from », intégrité référentielle
  `ON DELETE RESTRICT`. C'est la provenance des **faits Evidence**, **pas** la transmission documentaire
  (chemin+hash). **Déficit transmission : intact.**
- **OCR-106 (Trust Status) = statut PROTOCOLE dérivé.** `:42` « the current value produced by the Trust
  computation … a derived, reproducible, recomputable state that is **never authored** ». C'est l'exemplaire
  même de **P9** (dérivé, jamais persisté), au niveau **protocole** — **pas** le `Status` documentaire
  (Draft/Normative, champ persisté gouverné par OCR-000/005). **Confirme D-011/D-014**, ne les touche pas.
- **Bilan : les 12 Records lus intégralement ne contiennent aucun concept de gouvernance documentaire hors
  OCR-000…005 + OCR-124. Renversement de prémisse CLOS.** Les 21 restants = protocole pur (majorant accepté).

### Mesure 2 — fermeture de boucle du grounding, chiffrée (29 de Phase 1)

**Le texte d'abord — `OCR-000:51` est CONDITIONNEL :** « **Any OCR whose normative machine-facing sections
(definitions, JSON-LD, examples, wire formats) describe protocol behavior** MUST be diffed against the
current implementation before promotion to Normative. » ⇒ **un Record purement éditorial / de gouvernance
n'est PAS soumis au diff doc↔code** ; il lui faut la **revue éditoriale + l'approbation Opus X**, pas le
grounding machine. La charge de grounding ne porte donc **pas sur 29**, mais sur les **machine-facing**.

| Sous-ensemble de Phase 1 (29) | Compte | Détail |
|---|---|---|
| **Machine-facing** (« Pending machine-section diff », porte une *grounding note*) | **15** | 101,104,105,106,107,108,109,110,111,112,113,115,119,120,121 |
| — dont **grounding FAIT** (rapport OCR-GROUND-001, verdict « Conforme ») | **9** | 105,110,111,112,113,115,119,120,121 *(F1/F2/F3)* |
| — dont **grounding À FAIRE** (aucun rapport) | **6** | **101,104,106,107,108,109** *(liste confirmée)* |
| **Éditorial** (« Pending editorial review ») | **14** | 6 méta (000–005) + 102,103,116,117,118,122,124,125 |
| — **hors** diff doc↔code (`OCR-000:51`) ; requiert revue + approbation | **14** | *(dont 116/117/118 ont un rapport F2 en prime)* |

- **En clair :** grounding requis sur **15** (pas 29) ; **9 déjà faits (Conforme)**, **6 à faire**. Les **14
  éditoriaux** ne relèvent pas du diff doc↔code — seulement revue + approbation. **La boucle à fermer côté
  grounding est donc étroite : 6 diffs à produire, 9 à réconcilier, 14 hors périmètre machine.**

### Mesure 3 — le raccord manquant entre rapport « Conforme » et grille (constat)

**Cherché, mesuré :**

- **Aucun Record ne cite son rapport ni son verdict** (`grep OCR-GROUND|Conforme|groundé` sur les 33 `.md` →
  **vide**). La seule trace du grounding dans les Records est la *« Grounding note (removed at publication) »*
  — un **TODO** (« Diff X before promotion »), **pas un résultat**.
- **Aucun test de la grille ne lit les rapports** (`grep` sur `lib/registry/*.test.ts`, `scripts/registry/*`
  → le seul code « grounding » est `recordPage.test.ts` qui **compte/retire les 17 grounding notes**, et
  `generate.mjs` **spécifié par** OCR-GROUND-001 §9 — aucun ne **consomme** F1/F2/F3).
- **`Review Status` n'est lu ni écrit par aucun code** (`grep` → vide) : champ documentaire **inerte**.

**Ce qui existe :** les rapports (`docs/web/OCR-GROUND-001-rapport-F*.md`), le champ `Review Status`, la
grille (tests lisant corpus + manifeste). **Ce qui manque — le raccord, l'un de :** (a) un **champ dans le
Record** citant `rapport · verdict · commit` ; (b) un **test** qui lit le rapport et **échoue si non
« Conforme »** avant promotion ; (c) le **`Review Status` réécrit** d'un état « Pending » vers « grounded
(réf. rapport) ». **Aucun des trois n'existe.** Rapport et Record sont deux artefacts **disjoints** ; la
grille consomme le corpus, **jamais** les rapports. **C'est exactement « la boucle ouverte ».**

---

## Cadrage CLOS — compatibilités + SÉQUENCE D'EXÉCUTION gravée (2026-07-25)

### Mesure 1 — D-016 × D-013 × D-017 : l'ordre est unique

**Ordre confirmé — grounder → écrire le verdict (D-017) → émettre PROMO (D-016) → statut dérivé (D-013) :**

```
1. GROUNDING       diff doc↔code (OCR-000:51) → verdict « Conforme »   [rapport OCR-GROUND-001]
2. VERDICT (D-017)  le champ verdict est écrit DANS le Record          [avant promotion]
3. PROMO (D-016)    l'artefact PROMO = l'approbation Opus X (authority) [le fait d'approbation]
4. STATUT (D-013)   « Normative » est DÉRIVÉ du fait PROMO             [jamais persisté, résolveur]
```

- **PROMO ne porte PAS le grounding — il le présuppose.** Le grounding est tracé **dans le Record**
  (D-017) ; PROMO ne porte que l'**approbation** (D-016). Séparés : grounding = propriété Record↔code (par
  Record) ; approbation = acte Opus X.
- **Aucun autre ordre n'est compatible :**
  - *PROMO avant grounding* → viole `OCR-000:47` / `OCR-005:39` (promotion exige grounding). **Interdit.**
  - *Verdict après PROMO* → l'approbation existerait sans que le Record trace son grounding ; D-017 l'exige
    **avant**. **Interdit.**
  - *Grounding porté par PROMO* → seconde source du grounding (PROMO **et** Record), divergeable — le motif
    **P9** que D-013 applique. **Interdit** → le grounding vit dans le Record, source unique.
- **Réserve tracée :** le **sort du champ `Status`** à la promotion (projection dérivée *ou* retrait) reste
  la **sous-question D-013, REPORTÉE** en aval du résolveur — elle ne bloque pas l'ordre ci-dessus, elle en
  est l'aval (étape 4, forme du statut dérivé).

### SÉQUENCE D'EXÉCUTION — FINALE, gravée, NEUF étapes (0–8) — cadrage CLOS, AUCUNE lancée

*Cadrage entièrement clos (D-020 rendue) : plus aucune décision ouverte. Feu vert étape par étape.*

| # | Étape | Décision(s) source | État |
|---|---|---|---|
| **0a** | **CRÉER LE LIEU** de l'acte fondateur *(construction)* — registre `content/registry/founding/`, série `RATIF` hors plages + garde (comme D-004). RATIF garde `declares_normative:` (forme native) ; l'interface commune vit **au résolveur** (voie 2, étape 6 ; **D-016 intact, pas de D-021**). Fragment d'étape 3 **tiré en tête** (0b en dépend) ; pas un OCR → pas de circularité | **D-019 · D-020 · D-015** | ✅ **LANCÉE + APPLIQUÉE** (`6e230ef`) — lieu créé, garde `RATIF` prouvée par mutation (`foundingLieu.test.ts`, 4/4) ; `records: []` (pas de `RATIF-001`) ; non-circularité vérifiée (pas de Status, hors manifeste OCR) |
| **0b** | **RATIFICATION FONDATRICE** — Opus X signe/date/émet `RATIF-001` dans le lieu, déclarant `{OCR-000, OCR-005}` **Normative** (`OCR-000:35`) | **D-019 · D-020** · `OCR-000:35` | ✅ **ÉMISE + APPLIQUÉE** (`a372138`) — **acte fondateur `RATIF-001` émis, signé `Opus X — Erwan Signe`, `2026-07-25`** ; gardes contenu + plage + invariant vertes ; **immuable** ; sera lu au résolveur (étape 6). *Seule entrée du log référençant une signature.* |
| **1** | **Amender OCR-006** (édition en place, D-018 : Version **reste 1.0.0**) — portée protocole (**C/E/G**), aligner A/B, corriger §295/§291 — **puis PROMOUVOIR** (Draft non opposable) | D-014 · D-011 · D-018 · D-021 · `OCR-000:47` | ✅ **1a FAIT** (`<ce commit>`) — OCR-006 amendé (portée corrigée), diff périmètre exact, Version inchangée, manifeste régénéré (checksum OCR-006), `citations` re-mesuré (000/005→7). **Place dans l'ordre fixée (D-021, 2ᵉ).** 1b : **éditorial** (pas de grounding), **promotion effective → étape 6/8** |
| **2** | **Édition OCR-001** (D-018, en place, Version **1.0.0** inchangée) — plage méta **`000–005 → 000–009`** (répare l'anomalie OCR-006 **+** réserve `007`/`008`/`009`) ; `expected_ranges` du manifeste étendu (artefact **distinct**) ; **2 gardes** (`metaRange.test`) : OCR-006 ∈ plage · cohérence plage↔manifeste (**OCR-001 fait foi**) | D-015 · **D-018** · `OCR-005:33` | ✅ **FAITE** (`34a3813`) — 3 mentions alignées (:31 normatif + :77/:99 informatifs), `Last Update` **laissé intact par décision** (son sort → OCR-005, étape 3), manifeste régénéré (checksum OCR-001), gardes prouvées par mutation. **374/374** |
| **3** | **Loger les règles du régime documentaire (D-015)** — **3 nouveaux Records méta** : **`OCR-007` intégrité** (checksum), **`OCR-008` transmission** (chemin+hash), **`OCR-009` approbation** (D-016 ; décrit aussi le **lieu** `founding/`+RATIF, qui **n'est PAS un OCR** — autorité par signature, non ratifiable). Le 4ᵉ déficit (lieu) est **décrit, pas créé comme Record** | D-015 · D-016 · D-018 · D-019 | ✅ **FAITE** (`<ce commit>`) — 3 Records écrits (Draft/1.0.0/Meta) ; frontières dures (007↔OCR-113, 008↔OCR-002:51) ; garde de **non-circularité OCR-009** (section fondatrice descriptive, prouvée par mutation) ; **9 comptes de corpus → invariants dérivés** (partition = **FAIT 36/32**) ; manifeste régénéré. **`OCR-009` orphelin ATTENDU** *(Voie 3 : « cité ≥ 1 » est une porte de promotion, pas d'écriture ; le lien OCR-000/005→009 s'inscrit à l'**étape 8**, dans le même mouvement que leur promotion — pour ne pas éditer un Record ratifié hors régime ; distinct d'OCR-123, Phase-2)*. **385/385** |
| **4** | **Fermer la boucle grounding** — champ verdict dans le Record + test « non-Conforme → échec ». ⚠️ **Le champ D-017 doit admettre TROIS états**, pas deux : `grounding non requis — éditorial` (OCR-000:51 non applicable, ex. OCR-006 + les 14 éditoriaux) · `grounding requis, non fait` · `fait — Conforme (réf. rapport)`. Sinon le champ exige une preuve **impossible** pour les éditoriaux | **D-017** | ⛔ non lancée |
| **5** | **Grounder les 6** concepts machine-facing : `101,104,106,107,108,109` | D-017 · `OCR-000:49-53` | ⛔ non lancée |
| **6** | **Concevoir l'artefact PROMO** — champ `authority` ; présuppose le grounding ; **rouvre D-010** ; **+ interface de projection au résolveur** (voie 2, `declaredRecords`) **+ forme de révocation COMMUNE** PROMO⁄RATIF (décidée **une fois**, D-013) | D-001 · **D-010** · D-016 · D-013 | ⛔ non lancée |
| **7** | **Normaliser les 36** — par **amendements** (OCR-000…005, `P10:280`), **pas** un Record neuf | D-015 · `P10:280` | ⛔ non lancée |
| **8** | **Promouvoir les 29** `Draft → Normative` **dans l'ordre D-021 à strates** : `{OCR-000, OCR-005}` (déjà ratifiés, 0b) → `OCR-006` → `{001, 002, 003, 004}` → 23 concepts. Garde d'invariant d'ordre (D-020, faisable `4ede7f7`) à **étendre aux strates** (pas deux) | **D-021** · D-020 · D-016 · `OCR-000:47` | ⛔ non lancée |

**Nœud de dépendance :** l'**étape 0** (ratification) a besoin du **lieu** de l'acte, **conçu à l'étape 3**
— donc **la conception du lieu précède l'étape 0**. **D-010** reste SUSPENDUE jusqu'à l'étape 6. La
ratification elle-même (étape 0) **attend une décision hors de ce chantier** (Opus X, autorité fondatrice).

**⚠️ Porte ouverte relevée sur 0a (contenu de `RATIF-001`) — garde à armer AVANT 0b :** la garde de plage
(0a) contrôle l'**identifiant** (`RATIF-001` in range) mais **PAS le contenu** — `foundingLieu.test.ts` ne
référence **jamais** `declares_normative` (grep = 0). **Rien n'empêche aujourd'hui un `RATIF-001` de déclarer
trois Records, un seul, ou deux autres qu'`OCR-000`/`OCR-005`.** Or D-019 a tranché : `RATIF-001` déclare
**EXACTEMENT `{OCR-000, OCR-005}`**, ni plus ni moins.

- **Option A — FAISABLE (mécanique) :** un test spécifique à `RATIF-001` : `declares_normative` **doit être
  exactement `[OCR-000, OCR-005]`** (l'ensemble minimal mesuré, M3). **Armé maintenant** (à vide tant que
  `records: []` / aucun fichier), il **mord à l'instant où 0b émet `RATIF-001`**. Prouvé par mutation : 3
  Records → échec · 1 → échec · 2 autres → échec. **Même classe que la garde de plage.** Comme `RATIF` est
  **unique** (`RATIF-001..001`, D-019), un test spécifique à `RATIF-001` couvre **tout** le domaine.
- **Option B — N'EST PAS une contrainte :** le **résolveur** est un **consommateur** (il lit
  `declares_normative` et dérive le statut — il rendrait Normative *ce que l'acte déclare*, sur-déclaration
  comprise) ; la **revue humaine de 0b** est précisément le chemin **accidentel** que l'Architecte veut
  éliminer. Ni l'un ni l'autre ne **contraint** le contenu.
- **Constat : seule l'option A empêche 0b de sur-déclarer par accident.**
- **✅ ARMÉE (option A) :** `foundingLieu.test.ts` — garde de contenu, `declares_normative` = **ensemble**
  `{OCR-000, OCR-005}` (pas d'ordre, pas de doublon), **prouvée par mutation** (3 → échec · 1 → échec · 2
  autres → échec · doublon → échec · l'exact / l'ordre inverse → passe). **Armée à vide** (aucun `RATIF-001`)
  ; **mord à l'émission 0b**. Le lieu est désormais **complet ET verrouillé**.

---

## D-018 & point d'opposabilité — mesures du 2026-07-25 (avant 1b ; rien préparé)

### Point 1 (le plus important) — une édition de Draft rend-elle D-014 opposable ? **NON.**

**Constat verbatim (OCR-000, OCR-124) — un Draft n'a AUCUNE autorité tant qu'il n'est pas promu :**

- `OCR-000:42` — « **Draft** — authored but not yet grounded/approved; **not authoritative**. »
- `OCR-000:43` — « **Normative** — grounded … and approved; **authoritative**. »
- `OCR-000:63` — « Draft knowledge **MUST NOT** be presented as authoritative. »
- `OCR-000:67` — « it treats only **Normative, versioned OCRs as authoritative**; it **never relies on
  Draft** definitions as settled. »
- `OCR-000:86` — « **When is an OCR authoritative? Only when Normative and grounded.** »
- `OCR-124:171` — « It is assumed Draft equals authoritative; **only Normative, implementation-grounded OCRs
  are.** »

**Conséquence (la 1ʳᵉ branche de l'arbitrage) :** éditer OCR-006 en place (D-018) **corrige** le Draft, mais
le Draft corrigé **reste non autoritatif**. **L'édition seule ne rend donc PAS D-014 opposable** — OCR-006
doit être **PROMU à Normative** (revue + approbation Opus X ; pas de grounding machine, point 5 de 1a).
**La séquence change : l'amendement seul ne suffit pas — il faut amender PUIS promouvoir OCR-006.**

**⚠️ Découverte de portée (constat, non résolu — vous revient) :** **les 33 Records sont `Draft`**, donc
**OCR-000…005 eux-mêmes ne sont pas encore autoritatifs.** Les règles de promotion que nous citons sont
elles aussi en Draft. Il y a donc un **amorçage** : par quelle autorité la **première** promotion a-t-elle
lieu, alors que les règles qui la gouvernent ne sont pas encore Normative ? (Opus X comme autorité
fondatrice, `OCR-000:35` ?) — **question de séquence, à rendre.** Elle décide si l'étape 1 doit promouvoir
OCR-000…005 **avant** OCR-006.

### Point 2 — confirmé : la Version d'OCR-006 NE BOUGE PAS

D-018 = édition en place. **`Version` reste `1.0.0`**, **aucune** entrée Version History nouvelle, **aucun**
superseded. Fondé : `OCR-005:46` ne vise que « **Published normative meaning** MUST NOT be edited in place »
— un **Draft** n'est pas *published normative* → l'édition en place est permise, sans incrément. *(Un Draft
édité n'est pas un « release » ; `OCR-005:35` « the OCR's current version » = 1.0.0, toujours exact.)* **Non
incrémenté par réflexe.**

### Point 3 — règle du régime documentaire (matière D-015), posée par D-018

> **Règle (D-018) :** « Un Record **Draft** s'édite **en place**. La promotion `Draft → Normative` **retire
> ce privilège** : après promotion, tout changement passe par **MAJOR/superseded** (`OCR-005:40/46`). »

**Borne** : le privilège d'édition-en-place est **strictement** l'état Draft. Il **cesse** à la promotion.
Cette règle **complète le domaine « amendement d'un Record »** du régime — `OCR-005:46` couvrait le cas
**Normative** (nouvelle version), **pas** le cas **Draft** (édition permise) ; D-018 comble ce demi-vide.
**Troisième règle de régime cristallisée par la pratique** (après D-016 = forme de l'approbation, et le
raccord grounding = D-017).

---

## D-019 — amorçage de l'autorité : mesures du 2026-07-25 (constat, aucune conception)

### Point 1 — l'autorité d'Opus X : affirmée PAR un Record (Draft), amorçage SILENCIEUX

**`OCR-000:35` verbatim :** « **Opus X (governing body)** — owns the Registry; **authors, reviews, promotes,
versions, and retires OCRs**; **holds sole write authority** over canonical meaning. » Contexte (`:33-38`) :
« Contributors … subject to Opus X review » ; « No consumer or contributor MUST be able to unilaterally
alter canonical meaning. »

- **Tient-il son autorité d'un Record, ou est-il posé comme antérieur au corpus ?** Opus X est **décrit
  comme propriétaire/gouverneur** du Registry **par OCR-000** (`:19` « sets the governance frame within which
  every OCR is written »). **Aucun texte ne le pose comme externe/antérieur** — son autorité est **asseriée
  à l'intérieur d'OCR-000**, lui-même **Draft**. **C'est la circularité exacte** : le Record qui fonde
  l'autorité de promotion n'est pas encore autoritatif.
- **Texte d'amorçage / de ratification initiale ?** Recherche sur **tout le corpus** (bootstrap, ratif,
  founding, first/initial normative, « becomes normative », autorité antérieure) : **les seuls « founding »
  visent les deux principes du PROTOCOLE** (« Evidence Is Produced / Issuer owns the learning journey »),
  **jamais l'acte par lequel les premiers OCR deviennent Normative.** **Le corpus est SILENCIEUX sur
  l'amorçage.**
- **⇒ QUATRIÈME DÉFICIT du régime documentaire (D-015)** — après (1) intégrité, (2) transmission, (3) forme
  de l'approbation : **(4) l'amorçage** — aucun Record ne décrit comment le corpus passe de « tout Draft » à
  « auto-autoritatif ». La sortie est **hors corpus** (`OCR-000:35`, Opus X fondatrice), mais **non écrite**.

### Point 2 — ensemble minimal à rendre Normative pour promouvoir un OCR

Ce qu'invoque **l'acte de promotion** `Draft → Normative` (constat des textes) :

| Record | Rôle dans la promotion | Requis Normative ? |
|---|---|---|
| **OCR-000** | autorité (Opus X), modèle de statut, règle de promotion `:47`, grounding | **OUI — cœur** |
| **OCR-005** | transition `Draft → Normative` (`:39` grounding + approbation), versioning | **OUI — cœur** |
| **OCR-002** | registre éditorial — la revue d'un Record éditorial (dont OCR-006) se fait **contre** OCR-002 | **OUI si** la revue doit s'appuyer sur un standard autoritatif |
| OCR-124 | concept Registry + State Machine (redit le cycle) | non — **redondant** avec OCR-000/005 |
| OCR-001 / 003 / 004 | structure / terminologie / relations | non invoqués par l'**acte** de promotion |

- **Ensemble minimal : {OCR-000, OCR-005}** (+ **OCR-002** pour une revue éditoriale autoritative).
- **⚠️ La circularité se referme ici :** `{OCR-000, OCR-005}` sont **eux-mêmes Draft**. Pour les promouvoir,
  il faudrait leurs propres règles — déjà en Draft. **Ils doivent donc se promouvoir eux-mêmes**, ce
  qu'aucune règle de Draft n'autorise → **c'est l'acte d'amorçage (Opus X, hors corpus) qui doit rendre
  `{OCR-000, OCR-005(, OCR-002)}` Normative EN PREMIER**, avant tout le reste.

### Point 3 — CORRECTION : la Phase 1 **inclut** les méta-Records (votre prémisse est infirmée)

**Mesuré :** Phase 1 = 29 ; **méta dans Phase 1 : `OCR-000 OCR-001 OCR-002 OCR-003 OCR-004 OCR-005` ; méta
hors Phase 1 : aucun.** Seul **OCR-006** est hors Phase 1 (Phase 3). **Donc la Phase 1 n'exclut PAS les
méta — elle les contient (6 des 29).**

- **Mais la partition n'impose AUCUN ORDRE :** les 29 sont un seul sac. **Rien ne garantit qu'OCR-000…005
  (le portail) soient promus AVANT les 23 concepts qu'ils gouvernent.** Or promouvoir un concept **exige** le
  portail Normative (point 2). **Le portail est dans le sac, pas à l'entrée.**
- **Matière de D-019 :** l'amorçage doit rendre `{OCR-000, OCR-005(, OCR-002)}` Normative **d'abord** (hors
  corpus), **puis** un **ordre intra-Phase-1** promeut le reste des méta, **puis** les concepts. C'est
  peut-être **l'étape 0** que vous pressentiez. *(Constat — je ne conçois pas la séquence.)*

---

## D-019 rendue (ratification fondatrice) & D-020 — mesures du 2026-07-25 (constat, aucune conception)

### Mesure 3 (tranchée d'abord — elle dimensionne la ratification) — OCR-002 est HORS de l'ensemble minimal

**Verbatim :** `OCR-000:47` « Promotion `Draft → Normative` **MUST** require **agreement with the
implementation and Opus X approval**. » · `OCR-005:39` « `Draft → Normative` — **MUST** require **grounding
… and Opus X approval**. » **Ni l'un ni l'autre n'invoque une revue éditoriale ni OCR-002** (`grep
editorial|OCR-002|register|review` sur `OCR-000:47` = **0**). Le « Pending **editorial** review » est un
**libellé de `Review Status`** (workflow), **pas** une porte de promotion.

⇒ **Ensemble minimal EXACT = `{OCR-000, OCR-005}`.** *(Correction : la parenthèse « (, OCR-002) » du lot
précédent est **levée** — OCR-002 n'est pas requis. On ne surdimensionne pas ce qu'Opus X rend Normative en
premier.)*

### Mesure 1 — le LIEU de la ratification : **rien n'existe** (4ᵉ déficit, forme aiguë)

Un acte qui déclare `{OCR-000, OCR-005}` Normative **ne peut pas vivre dans OCR-000/005** (re-circularité).
Cherché un lieu qui porterait un acte fondateur **sans être ratifié par lui** :

- **Un OCR déjà Normative ?** **Non** — les **33 sont Draft** (mesuré). Aucun Record ne peut le porter.
- **Un registre de releases / ratification ?** **Non.** `content/registry/MANIFEST-OCR.json` existe mais
  c'est un **PLAN de migration Drive** (`"applied": false`), pas un registre d'actes fondateurs.
- **DECISIONS-LOG ?** C'est un **document de travail** (`docs/registry/`), **ni Record ni ratifié** — il peut
  *tracer* l'acte, mais il n'est pas un **lieu autoritatif** de l'acte fondateur.

⇒ **Aucun lieu n'existe.** C'est **le 4ᵉ déficit de D-015 dans sa forme aiguë** : le régime doit **créer le
lieu de l'acte fondateur** — un registre qui porte la ratification **sans** en dépendre. **Constat, je ne le
crée pas.**

### Mesure 2 — le mécanisme PROMO peut-il ratifier DEUX Records à la fois ? **Non, tel que conçu.**

- **D-016** : la promotion **EST** l'artefact PROMO (un fait d'approbation). Le **grain** de cet artefact est
  **D-010 — SUSPENDU** : « un artefact **par Record** (fin) vs un artefact **multi-événements** (gros) ». La
  conception a.–e. (D-001) portait un front-matter **`record:` singulier** → **un Record par artefact**.
- **Donc, tel que conçu (grain fin), un PROMO ne peut PAS déclarer deux Records Normative simultanément.**
  Ratifier `{OCR-000, OCR-005}` en un acte exige soit **deux PROMO fondateurs**, soit le **grain « gros »**
  (D-010), soit un **objet d'une autre nature** (la 2ᵉ voie de D-020).
- **Conséquence tracée :** la ratification **rouvre D-010** (le grain) **par un angle neuf** — non plus la
  promotion ordinaire, mais l'acte fondateur à deux Records. **Et elle arme la contradiction D-016 ↔ D-019 :**
  si la ratification émet un PROMO, elle **n'est pas** hors processus ; si elle émet autre chose, **il y a
  deux voies vers Normative** et le résolveur (D-013) **doit lire les deux**. **C'est D-020, non tranché.**

### Faisabilité de l'invariant d'ordre (préparation D-020 — constat, PAS de construction)

**Question :** si D-020 grave « portail méta d'abord », un garde peut-il assérer **dès maintenant** qu'aucun
Record de couche 100 n'est Normative tant que `{OCR-000, OCR-005}` sont Draft — **sans** le résolveur (D-013)
qui n'existe pas encore ?

**Oui — faisable aujourd'hui.** Mesuré :

- **Le statut est lisible sans résolveur** : champ `Status` de l'en-tête `.md` (`buildRecordPage`) **et**
  `lifecycle_status` du manifeste — les deux porteurs, concordants (0 divergence). Le test lit le statut
  **persisté** (source de vérité actuelle sous D-011/D-013, tant que le résolveur n'est pas là).
- **La couche est dérivable mécaniquement** de l'id : `000-005` = méta, `100+` = concept.
- **Prédicat :** `∀ R (couche 100+) : statut(R) ∈ {Normative, Deprecated, Superseded} ⇒
  statut(OCR-000)=statut(OCR-005)=Normative`. *(Inclure Deprecated/Superseded : un concept qui les porte a
  **été** promu → viole aussi « portail d'abord ».)*
- **Vert aujourd'hui, à vide** : portail = `OCR-000=Draft OCR-005=Draft`, concepts non-Draft = **0** →
  implication trivialement tenue.
- **Prouvable par mutation** : basculer un concept (p. ex. OCR-110) à `Normative` pendant que le portail est
  Draft → le test **échoue**. Même classe que `manifest.attestation` / le garde du DECISIONS-LOG.

**Limites honnêtes (pour D-020) :** (1) le test lit le statut **persisté** ; quand le résolveur (D-013)
existera, sa source devra basculer sur le résolveur. (2) L'**ensemble portail** est paramétrable : `{000,005}`
(minimal, D-020/M3) **ou** les 6 méta `000-005` — la faisabilité est identique, seul le prédicat change. **Le
garde attend que D-020 grave l'ensemble et l'ordre ; je ne le construis pas.**
