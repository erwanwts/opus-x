# DOSSIER DE SESSION — pour l'Architecte

**Ouvert le** 2026-07-22. **Objet** : consigner les décisions rendues, les mesures qui les
fondent, les verrous restants, et l'instrument des nombres. Ce dossier **ne fait pas
autorité** : il rassemble. Les décisions gravées vivent dans le corpus et les décisions
verrouillées ; les règles non normalisées, dans `REGLES-DECOUVERTES.md`.

---

## 1 · Décisions rendues

| Réf | Décision | Motif retenu par l'Architecte |
|---|---|---|
| **D-001** | **Option 1a** — l'artefact de promotion est un **artefact documentaire à côté du Record** | il entre dans l'enveloppe d'intégrité (le manifeste) |
| **D-002 v2** | **Modèle B″** — les projections **ne sont pas gouvernées** : leur `robots` reste hors chaîne, à sa valeur actuelle ; elles **affichent les statuts des Records projetés** et rendent visible l'hétérogénéité, **sans statut propre** | option de la main de l'Architecte (voir §4) |
| **D-003** | **SANS OBJET** — la fonction d'agrégation disparaît ; retirée des décisions attendues | rendue caduque |
| **D-004** | **Série dédiée `PROMO-xxx`**, hors des plages OCR actuelles | l'artefact de promotion a sa propre série ; `expected_ranges` amendé, garde de plage prouvé sur PROMO-001 (§6) |

**Chemin critique de D-001** : l'enveloppe d'intégrité (le manifeste) n'était **attestée par
aucun test** et avait divergé **≈ 24 h 40 min** sans être vue (§3). L'attestation est
désormais conçue et posée (§6, Voie B).

---

## 2 · Les verrous restants chez l'Architecte

**Deux** décisions **non rendues**. Tant qu'elles ne le sont pas, elles ne sont pas invocables
(RD-006 : *une source plausible n'est pas une source vérifiée*).

1. **Permanence anglaise des artefacts canoniques.** Aucune source normative ne la rend. Le
   seul énoncé (§16.1 du document d'architecture) **se déclare non normatif** ; le spec gelé
   **WEB-001B** planifie l'inverse (WEB-007 multilingue, type `translation`). La lacune
   `localized-to-canonical-link` reste **ouverte** pour cette raison ; son motif a été ramené
   au tracé (« non localisée **aujourd'hui**, par fallback strict, `CLAUDE.md:55` »).
2. **Plan d'indexation des 59 pages dérivées.** Contradiction **décidée** par D-002 v2 côté
   `robots` (fixé), **ouverte** côté plan : les 59 doivent-elles y entrer, ou leur `robots`
   revenir à `noindex` ? (§4.)

*Ne sont plus des verrous : le **substrat** du fait de promotion (rendu par D-001 = Option 1a),
la **série d'identifiants** (rendue par D-004 = `PROMO-xxx`), et **D-003** (sans objet).
Aucun item décidé ne figure ci-dessus.*

### Décision candidate (à l'Architecte) — le régime des `[GRAVÉ]`

**Remarque de l'Architecte, retenue :** *« `[GRAVÉ]` dans un document non normatif ne peut
signifier que gravé dans une source normative EXTERNE ; tout `[GRAVÉ]` devrait renvoyer à sa
source. »* Elle porte sur le **régime** du document, pas sur un chiffre — la remarque sur le
double Lot 2 était, elle, sans objet (extrait périmé).

**Mesuré (HEAD `61ba23a`) :** le document se déclare non normatif **depuis le versement**
(`88a464c`, STATUT « Il n'est pas normatif » — stable). Il porte **47 `[GRAVÉ]`**, dont
**3 seulement** renvoient à une source identifiable dans leur bloc ; **44 sont des assertions
nues**. La remarque **tient** donc, et quantifie un écart réel : 44 marques « gravé » sans
renvoi. *(La section dédiée « RÉGIME DE CE DOCUMENT » est postérieure au versement — ajoutée à
`28f5846` — mais le régime qu'elle formalise, la non-normativité, est stable depuis `88a464c`.)*
Décision candidate à valider, à son nom ; aucune modification du document sans arbitrage.

---

## 3 · Mesures de la session

Toutes rejouées depuis leur source ; les nombres structurants sont réunis en §5.

**Fuite du portail — ce que chaque page dérivée rend des Records en Draft** (composant) :

| Type (n) | Ce qui sort | Source |
|---|---|---|
| Prédicat (37) | identifiant + section seuls (`sourceRef`, ex. `OCR-007 §4`) | `registryEntityPage.ts:97` |
| Famille (15) | **rien des Records** — prédicats seulement | `registryEntityPage.ts:116-149` |
| Type (6) | `type/record` : jusqu'à **6 titres** de Records (échantillon) ; 5 autres : aucun | `registryEntityPage.ts:166` |
| Index (1) | identifiant + titre + **statut** des 33 Records | `registryEntityPage.ts:200-202` |

Le maximum qui sort d'un Record : **identifiant, titre, statut**. Jamais résumé, extrait ni
corps.

**Divergence des deux projections** — 59 pages dérivées déclarent `robots: index,follow`
(`registryEntityPage.ts:59`) et sont absentes de `indexPlan()` (`sitemapPlans.ts:87`).
Inscrite en dette ; **arbitrée par D-002 v2** (§4).

**Fan-in.** Prédicat 1–26 Records · famille 3–26 (transitif) · type `record` 26 · index 33.
**22 des 59** pages référencent ≥ 1 des 3 Records restant en Draft (**11 prédicats + 9
familles + 1 type + 1 index**).

**Les 7 Records absents du graphe** = **OCR-000 à 006** (ils se citent en prose mais n'ont
pas de section machine → aucun nœud). Critère « cité ≥ 1 » appliqué (mesuré par
`lib/registry/citations.test.ts`) :

| Record | Phase (30·2·1) | Cité par | « cité ≥ 1 » |
|---|---|---:|---|
| OCR-000…005 | **Phase 1** | 6 chacun | **PASSE** |
| OCR-006 | Phase 3 | 0 | échoue (Phase 3) |

**CORRECTION (2026-07-22) — ma première conclusion était incomplète.** J'avais écrit « aucun
Record de Phase 1 n'échoue le critère » en ne mesurant que les **7 Records absents du graphe**.
Le test rejouable, appliqué à **tout** le corpus, donne l'inventaire complet des non-cités :
**{OCR-006, OCR-123}**. Or **OCR-123 est en Phase 1** sous 30·2·1 — donc **un Record de Phase 1
échoue bien « cité ≥ 1 »**. Nuance décisive : la partition **30·2·1 n'emploie PAS ce critère**
(elle discrimine sur *stabilité + dette*, `MESURES:94` ; OCR-123 y entre en Phase 1
explicitement, sa non-citation n'étant « plus discriminante »). Donc **la Phase 1 n'est pas
bloquée par ses propres critères** — mais **elle le serait si le critère « cité ≥ 1 » de la
grille était appliqué**. À l'Architecte de trancher lequel gouverne.

*Cause exacte du bug de la 1ʳᵉ mesure, corrigée : ce n'était PAS le trait d'union. Un `\b`
construit à travers une couche shell (`node -e`) voit ses backslashes réduits et devient le
caractère BACKSPACE — jamais une frontière. Dans un fichier avec `\\b`, la frontière compte
6. Le test vit dans un fichier et le prouve par mutation.*

**Anomalie de plage (M2)** — artefact hors `expected_ranges` (OCR-000..006 / OCR-100..125) :
**SILENCE**. `missing_in_sequence` reste vide ; l'artefact est **silencieusement absorbé**
(file_count 33→35, entrée + checksum créés). Le générateur ne signale ni erreur ni
avertissement sur un id hors plage — il ne vérifie que les trous *dans* chaque plage.

> **Mesuré le 2026-07-22, sur la version du générateur ANTÉRIEURE à la garde.** À l'époque,
> `manifest.mjs` écrivait en dur dans `content/registry/_manifest.json` — le rejeu a écrasé le
> manifeste réel (restauré depuis sauvegarde, vérifié identique à HEAD). La garde d'essai à
> blanc (`--out`, §6) a supprimé ce défaut. **La PROCÉDURE décrite n'est donc plus rejouable
> en l'état** ; le **RÉSULTAT reste valide**, confirmé indépendamment par la garde de plage de
> `manifest.attestation.test.ts` (4ᵉ test). Mesure non refaite.

**Substrat du build.** Le build **ne lit rien hors du dépôt** (aucun `fetch`/`supabase`/`http`
dans le chemin statique). **34 pages** consomment le statut au build (33 Records + l'index) ;
les 58 dérivées ne le consomment pas.

**Option 1a — effet d'un ajout au corpus (mesuré, non déduit)** : **aucun des 33 checksums ne
change** (sha256 par fichier). Le manifeste change **si l'artefact est un `.md`** (file_count
+1, entrée, anomalie de métadonnées) ; un artefact **non-`.md`** est **invisible** au
manifeste (il ne lit que les `.md`). Conséquence pour D-001 : un artefact `.md` **entre** dans
l'enveloppe d'intégrité — ce que l'Architecte a retenu.

---

## 4 · D-002 v2 — Modèle B″ (rendue par l'Architecte)

> **Modèle B″.** Les projections ne sont pas gouvernées ; leur `robots` reste hors chaîne à
> sa valeur actuelle. Elles affichent les statuts des Records projetés et rendent visible
> l'hétérogénéité, sans statut propre.

**La dette d'incohérence passe d'incohérence CONSTATÉE à CONTRADICTION DÉCIDÉE.** Les 59 pages
en `index,follow` absentes d'`indexPlan()` ne sont plus un accident entre deux sorties : B″
**fixe le `robots`** (il reste `index,follow`, hors chaîne) et **ne dit rien du plan
d'indexation**. La contradiction est donc **assumée par décision** d'un côté (robots) et
**laissée à l'arbitrage** de l'autre (plan). **Arbitrage restant** : le plan d'indexation
doit-il inclure ces 59 pages, ou leur `robots` doit-il être ramené à `noindex` ? B″ ne le
trance pas.

**Chiffrage du lot B″ (périmètre + faisabilité, sans conception d'affichage).** Les 58 pages
n'affichant aujourd'hui aucun statut :

| Type (n) | Projette des Records ? | Source du statut | B″ demande |
|---|---|---|---|
| Prédicat (37) | oui — 1–26 Records (graphe, `provenance.record`) **comptés, non listés** aujourd'hui | `buildRecordPage().status` par Record projeté | **applicable** — implique de surfacer les Records projetés (aujourd'hui seul le compte est rendu) |
| Famille (15) | **non** — le rendu est **prédicats seulement** ; les Records sont à deux sauts (famille→prédicat→Records) | — | **rien** : aucune page famille n'affiche de Record |
| Type (6) | `record` : oui (26, dont 6 affichés) ; **5 autres : non** | `buildRecordPage().status` | applicable à **1** (record) ; 5 hors périmètre |
| Index (1) | oui (33) | déjà affiché | **déjà satisfait** |

**Périmètre réel de B″ : 38 pages** (37 prédicats + le type `record`). **20 pages** (15
familles + 5 types) ne projettent aucun Record affiché — B″ ne leur demande rien, comme
anticipé. Faisabilité : les Records projetés sont dérivables (graphe), la fonction de statut
existe (`buildRecordPage`) ; le seul ajout est de **lister** les Records projetés là où
aujourd'hui seul leur compte apparaît.

---

## 5 · L'instrument — nombres rejoués depuis les fonctions

**Ces nombres ne sont pas recopiés du relevé.** Ils sont produits à l'instant par un script
qui **appelle chaque fonction source** ; la colonne de droite nomme l'appel. Réexécuter le
script reproduit la table. Un nombre faux dans un relevé serait ici **redérivé** et démenti —
c'est arrivé cette session (citations OCR-000..005 : relevé bogué 0 → rejeu 6).

| Nombre | Valeur | Fonction source (rejouée) |
|---|---|---|
| Records du corpus | **33** | `readdirSync(corpus)` |
| Records qualifiés (status !== Draft) | **0** | `buildRecordPage().status` |
| Nœuds record du graphe | **26** | `wsp-graph.json node_type==record` |
| Records absents du graphe | **7** | `33 − 26` |
| Nœuds / arêtes du graphe | **80 / 222** | `wsp-graph.json` |
| Prédicats | **37** | `allPredicates()` |
| Familles | **15** | `allFamilies()` |
| Types | **6** | `allTypes()` |
| Pages canoniques (registre) | **92** | `registryPaths()` |
| Pages dérivées (92 − 33) | **59** | `registryPaths() − Records` |
| Records indexables (robots) | **0** | `recordPlanEntries().indexable` |
| Plan d'indexation | **11** | `indexPlan()` |
| Plan de découverte | **103** | `discoveryPlan()` |
| Manifeste : file_count | **33** | `_manifest.json` |
| Manifeste : checksums en dérive | **0** | `sha256(disque) vs stocké` |

La dernière ligne est l'attestation en action : **0 dérive** aujourd'hui. Le jour où elle
cesse d'être 0, le build casse (§6).

### La grille de promotion — état des attestations (mise à jour 2026-07-22)

Colonne DÉRIVABLE, après pose de l'attestation :

| Critère | Avant | Après | Instrument |
|---|---|---|---|
| **Empreinte** (checksum) | ❌ aucune attestation | ✅ **attesté** | `manifest.attestation.test.ts` (sha256 par Record) |
| **Manifeste** (cohérence) | ❌ aucune attestation | ✅ **attesté** | idem (file_count + population + checksums) |
| **Invariants** (projection) | ✅ | ✅ | `markdown.invariant.test.ts` |
| **Références** (« cité ≥ 1 ») | ⚠️ substrat sans attestation | ✅ **DÉRIVABLE** | `citations.test.ts` — rejoue les citations dans un fichier, prouvé par mutation ; inventaire des non-cités = {OCR-006, OCR-123} |
| **Modification substantielle** (commits) | ⚠️ substrat sans test | ⚠️ **inchangé** | git ; aucun test |
| **Dette** (« aucune dette ouverte ») | ⚠️ fichier humain | ⚠️ **inchangé** | `DETTES-ouvertes.md` ; liste curée, aucun test |

**Constat demandé.** L'attestation ferme **les DEUX lacunes nettes** — empreinte **et**
manifeste — par le même instrument : toutes deux étaient « aucun test », toutes deux le sont
désormais. Réserve : la **signification** de l'empreinte (contenu canonique vs artefact de
fichier) reste **une lacune distincte, non fermée** — le test atteste que le checksum
correspond au contenu, pas ce que le checksum *représente*.

**« Cité ≥ 1 » est promu : il a désormais un test rejouable** (`citations.test.ts`), qui
mesure les citations dans un fichier et attrape par mutation le défaut qui avait rendu 0 (un
`\b` réduit au caractère backspace par la couche shell — **pas** le trait d'union). Le critère
**devient dérivable**. Il révèle du même coup son inventaire : **{OCR-006, OCR-123}** cités par
0, dont **OCR-123 en Phase 1** (§3) — un fait qui restait invisible tant qu'il n'y avait qu'un
script.

**Restent deux ⚠️ : commits et dette.** « Modification substantielle » (commits) a un substrat
git mais aucun test ; « aucune dette ouverte » repose sur une liste curée à la main
(`DETTES-ouvertes.md`), non mesurée.

---

## 6 · Chantiers ouverts

- **Voie B — attestation du manifeste : POSÉE** (D-001). `lib/registry/manifest.attestation.test.ts`
  (**5 tests**) rejoue le sha256 de chaque Record vs le checksum stocké, à chaque `npm test`
  (donc chaque build). Prouvée par mutation : elle attrape une dérive d'un octet et **nomme** le
  Record. La divergence de 24 h 40 min ne peut plus dormir. *(Intégrité du manifeste uniquement
  — aucun statut, aucune promotion.)*
- **Garde de plage + D-004 : POSÉES.** Tout id présent tombe dans une plage déclarée, sinon
  échec nommé. `expected_ranges` **amendé** pour déclarer la série `PROMO` (D-004) :
  `OCR-000..006,OCR-100..125,PROMO-001..001`. **Prouvé sur cas réel** — un manifeste généré avec
  un `PROMO-001` présent : le garde **nomme PROMO-001 et échoue AVANT** l'amendement, **passe
  APRÈS**. Un test scelle l'avant/après par mutation. *Conséquence à signaler : déclarer PROMO
  dans `expected_ranges` (qui vaut « valide ET requis ») fait apparaître une anomalie advisory
  `missing_in_sequence: PROMO-001` tant que l'artefact n'est pas créé — tripwire honnête « série
  armée, premier artefact attendu », qui se lève à la création. La borne haute `..001` devra
  s'étendre à chaque nouvel artefact minté.*
- **Garde du générateur : POSÉE.** `scripts/registry/manifest.mjs` est désormais en **essai à
  blanc par défaut** ; le chemin réel est une cible explicite (`--out`). Motif : l'incident
  daté du 2026-07-22 (le rejeu a écrasé le manifeste réel parce que l'écriture était le défaut).
- **« Cité ≥ 1 » : PROMU EN TEST** (`lib/registry/citations.test.ts`, §5). Rejoue les citations
  dans un fichier, attrape par mutation le défaut du script (`\b` → backspace). Dernier obstacle
  dérivable levé.
- **Lot B″ (D-002 v2) : chiffré, non exécuté** (§4). 38 pages dans le périmètre.
- **Cycle 1 de promotion** : la Phase 1 (30 Records) est **exécutable au regard de ses propres
  critères** (30·2·1 : stabilité + dette). Réserve inscrite (§3) : le critère « cité ≥ 1 » de la
  **grille** flaguerait **OCR-123** (Phase 1, cité par 0) — c'est un arbitrage Architecte : quel
  jeu de critères gouverne. *(Substrat et série ne sont plus des verrous : D-001, D-004.)*
- **Dette d'incohérence** : devenue contradiction décidée (§4) ; arbitrage du plan restant (§2.2).
- **Deux `alias_self_loop`**, énumération hétérogène d'OCR-100, permanence anglaise : inchangés.

*Vérification §6 ↔ §4/§1/§2 : aucun item décidé (Option 1a, B″, D-004, attestation) ne figure
comme verrou ouvert. Les seuls verrous sont la permanence anglaise et le plan des 59 (§2).*

---

## 7 · Sources de travail — NON normatives (RD-006)

### « Schéma GEO du site Opus X » — Google Doc, 18 juillet 2026

**Statut : source de TRAVAIL, non opposable.** Antérieur aux Lots GEO 1 et 2 ; il décrit une
cible *avant* implémentation. **RD-006** : *une source plausible n'est pas une source vérifiée*.
Ses recommandations **ressemblent à des décisions** — c'est exactement le piège `[GRAVÉ]` : rien
n'y renvoie à une source normative externe. Aucune de ses prescriptions n'est opposable.

**Versé et lu : `docs/web/SCHEMA-GEO-2026-07-18.md @ cd159b3` (blob `011c951`).** Les deux côtés
sont désormais mesurés.

**Le doc est une source HISTORIQUE datée** (18 juillet). On ne le réécrit pas : le prescriptif
meurt, l'historique reste (même règle que le miroir LF). « Aligner sur l'implémentation » = **rendre
une décision qui déclare le schéma SUPERSEDED sur ce point** — le document n'est pas touché.

**Écarts — schéma LU vs implémentation MESURÉE :**

- **URLs du Registry — préfixe (arbitraire).** Schéma : `/registry/…` ; impl : `/records/…` (607, pour
  éviter la collision avec le pilier `/en/registry`). **91 URLs.** Le schéma se **contredit lui-même** :
  §4 `/registry/predicates/…`, §9 `/predicates/…`. Aligner vers `/registry` = superseder le schéma sur
  le préfixe **+ rouvrir la collision `/en/registry`** + 2 sitemaps + maillage 94 liens + 92 canonicals.
  Aligner vers `/records` = une décision qui **supersede le schéma**, sans toucher au doc.
- **URLs du Registry — nom vs id (PAS arbitraire, sort du lot — voir décision propre ci-dessous).**
  Schéma : prédicats par **nom** (`/predicates/is-a`) ; impl : par **id** (`/records/predicates/prd-001`).
  Mesuré : les 37 noms canoniques donnent **36 slugs** — **collision `governed-by` ← PRD-203, PRD-204**
  (même canonique partagé que le double-compte d'arêtes). Les slugs de nom ne sont donc **ni uniques**
  (1 collision) **ni stables** (un renommage casse l'URL) ; l'id est unique et stable. C'est le seul
  point où le schéma peut avoir raison **pour des raisons GEO** (lisibilité), mais au prix d'une
  collision réelle à lever d'abord. **Mérite sa propre décision** — pas le même arbitrage que le préfixe.
- **Familles absentes du schéma.** L'impl a **15 pages `/records/families/{id}`** ; le schéma n'a pas
  la notion.
- **Modèle de page — le schéma en porte QUATRE, non concordants.** §6 (« Modèle GEO ») = 15 items ;
  §3 (structure d'entité) = 11 items ; §2 = **cinq** listes par pilier, toutes différentes (Passport 15,
  WSP 18, Verified Skills 11, Verifiable Evidence 13, Knowledge Graph 14). **Sept listes distinctes en
  tout, aucune identique.** La production suit `GRAVEN_ORDER` (architecte). Schéma-seul (non rendu) :
  Résumé, Composants, Limites, Gouvernance, Dernière mise à jour. Architecte-seul (absent du schéma) :
  Actors, Lifecycle, Counter Examples, Distinctions, Related Entities, CTA. **Non adoptable sur la
  structure : le schéma n'a pas UN modèle.**
- **Ontologie — 6 registres au schéma, 3 surfaces à l'impl.** Schéma §5 : Type, Predicate, Attribute,
  Constraint, Inference, Cardinality Registries. Impl : Predicate + Type (2 des 6) **+ Family**
  (impl-seul, hors schéma). **Quatre manquants : Attribute, Constraint, Inference, Cardinality** — leur
  substrat serait des Records **OCR-008/…/012, tous absents** du corpus (gap 007-099). *(L'Architecte
  a dit « 3 manquants » ; mesuré = 4, car Family de l'impl ne correspond à aucun des 6.)*
- **Framework slug.** Schéma §4 : `/frameworks/world-trader-pass`. **En vigueur : `world-trader`**
  (D2, `CLAUDE.md:47`, décision verrouillée). Le schéma diverge ; D2 prime.
- **Lot GEO 3 — sans substrat, motif corrigé.** La dépendance `/concepts/…` → définitions de concepts
  est **réelle** (documentée ailleurs dans le projet). Ce qui manque, c'est la **source** : les
  29 définitions (OCR-014) sont **en attente chez l'Architecte**, absentes du corpus. *(Correction :
  OCR-014 n'est PAS dans le schéma — mon attribution était une fabrication ; la dépendance, elle,
  n'en est pas une. C'est la source qui n'existe pas, pas la dépendance.)*

**QUATRE éléments du schéma poussent CONTRE la permanence anglaise** (candidate non rendue) : §12
(« le contenu explicatif peut être traduit »), §9/§12 préfixes `/en/ /fr/ /es/`, §15 **Lot GEO 7 =
localisation FR/ES comme lot entier**, et l'exemple §12 `/fr/professional-passport`. Un doc de
travail qui accumule quatre appuis pro-traduction, alors que la permanence n'est rendue nulle part.

**§14 se contredit lui-même sur « une URL stable ».** Il énonce le principe *« une entité, une
définition canonique, une URL stable »* (ligne 1006) puis, pour l'entité Evidence, liste **six URLs** :
`/evidence`, `/registry/ocr-110`, `/api/registry/ocr-110`, `/professional-passport/evidence`,
`/trust/evidence`, `/verification/evidence`. Les trois dernières (« pages contextuelles ») mettent la
**même entité sur plusieurs URLs éditoriales** — compatible avec « une URL stable » seulement si l'on
lit « une URL **canonique** », les contextuelles portant un `canonical` vers `/evidence`. Le schéma ne
le dit pas ; c'est une tension non résolue dans le doc.

**Confirmé DANS le doc — les deux non-décisions :** `/p/[handle]` (§9, §17 — **collision** avec le
Passport public de l'app) ; **traduction du contenu explicatif** (§12).

**Deux points que le schéma tranche SANS autorité — à ne pas prendre pour des décisions :**

1. **`/p/[handle]`** — le schéma l'emploie ; c'est une **collision ouverte** (l'app utilise déjà
   `/p/[handle]` pour le Passport public). Non tranché ici.
2. **Traduction du contenu explicatif** — le schéma la recommande ; elle irait **contre la
   permanence anglaise** (elle-même **candidate non rendue**, D-006). Deux non-décisions qui
   s'opposent : le schéma n'a l'autorité de trancher ni l'une ni l'autre.
