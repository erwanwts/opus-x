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
| **D-015** | **Un régime documentaire distinct est à écrire** — nouveau Record gouvernant le corpus documentaire (que D-014 laisse sans principe), **à instruire avant clôture du chantier**. Régime **COMPLET** (pas de version minimale) | **rendue** *(trajectoire ; pas de rédaction)* | **`357d924`** (2026-07-24) — mesures inscrites ci-dessous : **dette distincte chiffrée**, **série du Record** (⚠️ 0 id libre ; OCR-006:27 contredit D-014), **périmètre du sans-règle**, **chaîne de dépendances**. `PROMO-001` et **D-010** passent **en aval de D-015** |

## Décisions EN ATTENTE chez l'Architecte

| Réf | Objet | Statut |
|---|---|---|
| **D-010** | **Grain de l'artefact de promotion** — un artefact par Record (fin) vs un artefact multi-événements (gros) | **SUSPENDUE** (en aval de la persistance du statut) — ne pas trancher par conception |
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
