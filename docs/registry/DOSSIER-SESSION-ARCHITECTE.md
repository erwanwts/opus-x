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

**⚠️ Le doc n'est pas encore lu.** Le schéma est un Google Doc, hors de portée de Claude. Il sera
versé sous `docs/web/SCHEMA-GEO-2026-07-18.md`. **Les faits « côté schéma » ci-dessous viennent de
la DESCRIPTION de l'Architecte, non du document** — ils sont **provisoires**, à re-vérifier contre
le fichier versé (dette de provenance : *un document sans sa version n'est pas une source*). Seuls
les faits « côté implémentation » sont mesurés.

**Écarts — implémentation MESURÉE vs schéma DÉCRIT (à confirmer sur le doc versé) :**

- **URLs du Registry.** Schéma *(décrit)* : `/registry/…`. Implémentation *(mesurée)* : `/records/…`
  (décision 607, pour éviter la **collision** avec la page pilier `/en/registry`, slug `registry`
  = OCR-124). Écart de préfixe sur **91 URLs**. Arbitrage ouvert.
- **Les 15 sections.** Schéma *(décrit)* : diffère sur **six** sections. Implémentation *(mesurée)* :
  **la production suit la structure ARCHITECTE** (`GRAVEN_ORDER`). Le côté « six sections » reste à
  vérifier sur le doc.

**Deux points que le schéma tranche SANS autorité — à ne pas prendre pour des décisions :**

1. **`/p/[handle]`** — le schéma l'emploie ; c'est une **collision ouverte** (l'app utilise déjà
   `/p/[handle]` pour le Passport public). Non tranché ici.
2. **Traduction du contenu explicatif** — le schéma la recommande ; elle irait **contre la
   permanence anglaise** (elle-même **candidate non rendue**, D-006). Deux non-décisions qui
   s'opposent : le schéma n'a l'autorité de trancher ni l'une ni l'autre.
