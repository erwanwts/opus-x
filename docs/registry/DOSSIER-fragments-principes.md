# Dossier de fragments — matière brute pour la rédaction des principes

> **Ce document n'assemble rien.** Aucune synthèse, aucune proposition d'énoncé, aucun
> aphorisme. Il rassemble, pour chacun des **8 principes sans énoncé canonique** (les
> principes 9 et 10 sont déjà formulés et ne sont pas traités ici) :
> **A.** les formulations verbatim et leur contexte · **B.** l'incident d'origine ·
> **C.** les conséquences effectivement tirées.
>
> **Rappel de la règle gravée** : ces fragments proviennent **d'échanges de conception**.
> Ils ne constituent **pas** une source normative. Ce dossier existe précisément pour que
> l'architecte puisse écrire l'artefact qui, lui, fera autorité.

## Convention de citation

- **[GRAVÉ]** — fragment transmis explicitement comme verbatim de l'architecte.
- **[RAPPORTÉ]** — fragment transmis en style indirect ou reformulé par le relais ; le
  libellé exact de l'architecte n'est pas garanti.
- **[EXÉCUTANT]** — formulation produite par l'exécutant, **sans valeur normative** ;
  signalée pour qu'elle ne soit jamais prise pour une parole d'architecte.

---

# Principe 1 — Distinction définition logique / représentation canonique

## A. Formulations

**[GRAVÉ]** — *contexte : complément apporté après la décision de réidentification, pour
fixer le vocabulaire du dossier (v3). L'architecte impose son emploi.*
> « Trois niveaux distincts :
> — la **définition logique** (ce que signifie le Framework) — unique ;
> — la **représentation canonique** (les lignes publiées sous un identifiant donné) — deux
> coexistent, wtf et wtr ;
> — l'**identifiant canonique** lui-même.
> Les 7 lignes ne sont PAS une seconde définition : ce sont une seconde REPRÉSENTATION
> CANONIQUE de la même définition logique. Duplication de représentation imposée par
> l'append-only, pas duplication de sens. Emploie ce vocabulaire. »

**[GRAVÉ]** — *contexte : autorisation de publication en production, décision 1, sur l'état
de la prod. Distinction voisine mais distincte (patrimoines, non représentations).*
> « Il distingue **patrimoine normatif** (définitions, relations, règles) et **patrimoine
> factuel** (Evidence, faits, Trust). La prod possède le premier, pas encore le second. »

## B. L'incident d'origine

Le renommage `wtf → wtr` ne pouvait pas se faire par mutation (voir principe 4). `wtr` a
donc dû être **publié à côté de** `wtf`, les deux coexistant dans la base. Cette coexistence
a produit une lecture erronée, présente dans les versions v1 et v2 du dossier de conception
rédigées par l'exécutant : `wtr` y était décrit comme une « **nouvelle publication** », ce
qui laissait entendre qu'une **seconde définition** entrait au corpus.

Le fait aggravant : la note de migration `MIG-wtf-to-wtr-2026-07-18.md` avait gravé
« **aucune coexistence permanente** ». La réidentification rendait cette gravure caduque
sans que le vocabulaire disponible permette d'expliquer pourquoi la coexistence n'était pas
une duplication de sens.

**Verbatim de la correction [GRAVÉ]** : « Les 7 lignes ne sont PAS une seconde définition. »

## C. Les conséquences tirées

- **Titre du dossier de conception réécrit** : « Publication d'une **seconde représentation
  canonique** (`framework:wtr`) par réidentification » (auparavant : « publication /
  succession »).
- **§2 recadré** : « ces 7 lignes ne créent **aucune nouvelle définition logique** — c'est la
  **représentation canonique** de la définition existante sous un **nouvel identifiant**.
  Duplication **de représentation** (append-only), jamais de sens. »
- Vocabulaire propagé aux §2, §5, §9, §10 du dossier.
- Fonde le principe 5 : puisque la définition logique est la même, **tout ce qui exprime son
  contenu normatif doit être conservé à l'identique**.
- La disposition « aucune coexistence permanente » de la note de migration a été marquée
  **caduque**.

---

# Principe 2 — Distinction fait immuable / mécanisme de lecture

## A. Formulations

**[GRAVÉ]** — *contexte : règle portée en tête de l'inventaire des passages à réécrire ;
fait autorité pour toute évolution future du corpus.*
> « Tout passage décrivant un **fait publié** ou une **donnée immuable** emploie les
> coordonnées **réellement portées par ce fait**. Tout passage décrivant une **définition**,
> une **règle**, une **capacité**, un **mécanisme** ou un **comportement** du protocole
> emploie les **coordonnées canoniques en vigueur au moment de la lecture**. »

**[GRAVÉ]** — *contexte : principe général accompagnant la règle ci-dessus.*
> « Le protocole ne choisit jamais une coordonnée en fonction de la date du document ou de
> la version du corpus. Il choisit toujours la coordonnée de l'objet dont il parle. »

**[GRAVÉ]** — *contexte : corollaire d'application, énoncé lors du déclassement du passage
OCR-105:133.*
> « exemple réel → historique ; schéma de structure → canonique »

**[GRAVÉ]** — *contexte : confirmation de la ligne mixte B12/A9 (OCR-109 l.155), avant le
Lot 2. L'architecte lève l'apparence de contradiction.*
> « Une même phrase peut légitimement contenir simultanément une coordonnée historique et
> une identité canonique **dès lors qu'elles ne désignent pas le même objet**. Dans cette
> ligne : `wtf:212` désigne la coordonnée effectivement portée par les faits sur lesquels
> repose le calcul ; `wtr` et sa version désignent le Framework interprétatif utilisé pour
> produire le Trust. Il n'y a donc pas contradiction. Au contraire, cette phrase devient un
> bon exemple de la séparation entre : **l'identité des faits, immuable** ; **l'identité de
> la définition utilisée pour les interpréter, canonique**. »

**[GRAVÉ]** — *contexte : arbitrage du cas ambigu C(c), OCR-108 (scope de requête).*
> « Si la requête vérifie une **définition** → coordonnée canonique. Si elle vérifie un
> **fait publié** → coordonnée réellement portée par ce fait. »

**[GRAVÉ]** — *contexte : reclassement de C(a) (OCR-100 l.117) vers l'inventaire A.*
> « Le sujet grammatical est **les faits** ; on décrit ce qu'ils portent réellement.
> Coordonnée historique attendue. »

## B. L'incident d'origine

**Deux incidents distincts, convergents.**

**(i) Le corpus renommé en bloc.** La migration du 2026-07-18 (commit `ddfda6f`) avait
substitué `wtf → wtr` dans tout le corpus. Résultat : des passages décrivant des **faits
réels** affirmaient `wtr:212`, alors que les faits journalisés portent `wtf:212`. 24
passages étaient à trancher, sans critère.

**(ii) La coordonnée est scellée dans le condensat d'intégrité.** Mesure faite sur
`lib/wsp/evidenceCovered.ts` : `framework.id` et `demonstrates.skill_id` sont **copiés
littéralement** dans l'objet haché (préimage §6.1). Conséquence constatée : **réécrire
`wtf:212 → wtr:212` dans un fait existant changerait son `canonical_hash`** — donc romprait
l'intégrité et l'idempotence. Un fait ne peut pas changer de coordonnée, jamais.

**La ligne qui paraissait contradictoire.** OCR-109 l.155 portait les **deux défauts**
(coordonnée *et* version) et, corrigée, devient volontairement mixte :
`wtf:212` sous `wtr` v0.1. Elle semblait incohérente ; l'architecte a établi qu'elle ne
l'était pas, et en a fait l'exemple de doctrine.

## C. Les conséquences tirées

- **Inventaire scindé en deux** : A (coordonnées, 10 passages) et B (versions normatives,
  14 passages) — deux défauts de nature différente sur les mêmes Records.
- **Reclassements** : OCR-105:133 **déclassé** (schéma de structure, déjà canonique, rien à
  corriger) ; OCR-100:117 **promu** en A ; OCR-119 (mapping) et OCR-108 (scope) **vérifiés
  conformes**.
- **Corpus corrigé** : 10 passages passés en `wtf:212` (commit `62027b4`), la ligne mixte
  B12 conservée mixte **volontairement**.
- **Contrôle ajouté** : après correction, inventaire des `wtr:212` restants — **70
  légitimes**, **0 décrivant un fait réalisé**.
- **En code** : la route de découverte **dérive** le statut et ne réécrit jamais un fait.

---

# Principe 3 — Résolution d'identité exclusivement en couche de lecture

## A. Formulations

**[GRAVÉ]** — *contexte : principe porté au dossier après la mesure du Trust (§10).*
> « La résolution canonique d'identité appartient **exclusivement à la couche de lecture**.
> Aucun mécanisme du WSP n'est autorisé à modifier un fait publié, directement ou
> indirectement, **y compris lors d'un changement d'identifiant canonique**. »

**[RAPPORTÉ]** — *contexte : demande de mesure de l'écart entre l'existant et le
comportement visé.*
> « L'architecte écrit que `wtf:212` et `wtr:212` désignent la **même définition logique** et
> que le Trust ne fait qu'une **résolution d'identité**. »

## B. L'incident d'origine

**La mesure du code réel a montré qu'aucune autre voie n'était possible.**

- **La coordonnée est hash-portante** (`lib/wsp/evidenceCovered.ts`) : la résolution ne peut
  **pas** procéder en réécrivant les faits — le condensat changerait.
- **L'append-only interdit l'UPDATE** de toute façon (`wsp_reject_mutation`, `service_role`
  inclus).
- **Le Trust n'existe pas encore** : mesure faite sur `lib/api/readPublicPassport.ts`
  (`trust_status: 'establishing'` en **valeur par défaut**, `evidence: []`) et
  `lib/dashboard/DashboardService.ts` (`readTrustStatus` lit une table d'affichage Sprint-1
  `trust_index` par `passport_id`, **jamais dérivée d'une coordonnée**).
- **Là où la coordonnée agit, elle agit littéralement** : ingestion étape 8
  (`wsp_skill_levels where skill_id = v_skill and framework_version = v_fwver`, match exact)
  et FK des faits.

**Constat verbatim de la mesure** : « résolution d'identité = **0 % construite** » — il n'y
avait donc rien à corriger, seulement un emplacement à graver **avant** que quoi que ce soit
soit construit.

## C. Les conséquences tirées

- **§10 du dossier borne le contrat** : la résolution vivra **en lecture seule**, au-dessus
  de faits immuables et hash-scellés ; le Lot B publie la représentation et les relations,
  **il ne construit pas la résolution**.
- **En code** : `deriveIdentity()` est une **fonction pure** ; la route lit
  `wsp_reidentifications` et dérive — **aucune écriture**.
- **À la publication** : rien n'a touché le magasin de faits (contrôle PROD-6.4 :
  `0/0/0/0` inchangé).
- **Retrait de la redirection** : `/frameworks/wtf` reste **consultable** avec son statut —
  une résolution côté lecture, et non une réécriture ni une redirection.

---

# Principe 4 — Réidentification par ajout pur

## A. Formulations

**[GRAVÉ]** — *contexte : raison normative donnée lors de l'autorisation de publication en
production (décision 2), valable « avec 0 fait comme avec des millions ».*
> « Une **définition publiée est immuable**. Si son **identité canonique** doit évoluer
> **sans modification de sa définition**, la **seule opération autorisée est une
> réidentification**. »

**[RAPPORTÉ]** — *contexte : bascule initiale, immédiatement après l'échec de la migration.*
> « L'architecte a tranché : **PAS de migration**. Succession de versions, append-only.
> `framework:wtf` reste publié […] ; `framework:wtr` est une **nouvelle publication** […]
> les 79 Evidence conservent `wtf:212`. »

**[RAPPORTÉ]** — *contexte : correction ultérieure de la nature du prédicat.*
> « L'architecte a **écarté `supersedes`**. Il grave un prédicat **NOUVEAU de
> réidentification canonique** : les deux définitions sont **substantiellement identiques**,
> seule **l'identité canonique** change. »

## B. L'incident d'origine

**C'est l'incident fondateur du chantier.** La migration `20260718000001_wtf_to_wtr.sql`,
qui mutait `framework:wtf` en `framework:wtr` par `UPDATE`, a été **rejetée par la base** dès
son application en préproduction.

**Verbatim de l'incident** :
> « **STOP — STAGING-1 a échoué. Rien n'a bougé.** […] Erreur : `WSP_APPEND_ONLY: UPDATE
> interdit sur wsp_frameworks` »

L'investigation en lecture seule a établi que la garde `wsp_reject_mutation` est
**structurelle** : trigger `BEFORE UPDATE OR DELETE` par ligne + `BEFORE TRUNCATE` par
instruction, sur **8 tables**, opposable **même au `service_role`**. Les 5 tables que la
migration voulait muter en font partie. **Le renommage par mutation était structurellement
impossible**, non par convention mais par construction.

## C. Les conséquences tirées

- **Les deux migrations de mutation archivées** hors de `supabase/migrations/`, avec en-tête
  « **⛔ NE JAMAIS EXÉCUTER** » — forward *et* rollback, ce dernier étant lui-même bloqué.
- **Conception entièrement refondée** : table de réidentification append-only, prédicat
  dédié, publication par **INSERT** seulement.
- **Publication exécutée** : 7 lignes de représentation + 3 relations, **zéro UPDATE, zéro
  DELETE**, en staging puis en production.
- **Irréversibilité assumée et documentée** (§8 du dossier) : aucun rollback DB ; la sûreté
  est reportée **en amont**, dans les blocs de relecture avant chaque insertion.
- **Preuve produite** : `recorded_at` des 7 lignes `wtf` **figé** (contrôle PROD-6.6,
  `recorded_at_altere = 0`).

---

# Principe 5 — Conservation des propriétés normatives lors d'une réidentification

## A. Formulations

**[GRAVÉ]** — *contexte : principe général énoncé après l'arbitrage sur `effective_date`,
présenté comme applicable à TOUTE réidentification future.*
> « **CONSERVÉ à l'identique** : tout ce qui exprime le **contenu normatif**, le
> **comportement**, la **portée** ou la **validité** — date d'entrée en vigueur, définition,
> comportements, contraintes, garanties, effets, exigences de conformité. *« Que dit cette
> définition ? »*
> **RENOUVELÉ** : ce qui est propre à **l'acte de réidentification** — identifiant
> canonique, métadonnées de publication de la nouvelle représentation, liens
> `reidentified_as`, informations de continuité. *« Sous quelle identité est-elle
> publiée ? »*
> **CRITÈRE** : si modifier une valeur **change le sens, les effets ou les obligations** de
> la définition, elle **ne peut pas** être modifiée lors d'une réidentification. »

**[GRAVÉ]** — *contexte : arbitrage ponctuel qui a précédé et déclenché le principe général.*
> « `effective_date` GRAVÉE : la représentation réidentifiée **conserve la date d'entrée en
> vigueur de la représentation d'origine** — 2026-07-13. Aucune modification au plan. »

## B. L'incident d'origine

**Un champ isolé a révélé l'absence de règle générale.**

Au bloc de relecture précédant l'insertion définitive, l'exécutant a signalé que
`effective_date` était **copié** depuis `wtf` (valeur `2026-07-13`) et a explicitement
qualifié ce traitement de **choix de conception non gravé**. La question posée :

> « Est-ce un **CHOIX** ou une **conséquence de la copie** ? »

Le raisonnement transmis en retour : mettre la **date du jour** aurait signifié « nouvelle
version entrée en vigueur aujourd'hui » — donc un **changement de comportement normatif**,
contradictoire avec « aucun changement sémantique ». L'architecte a alors gravé la valeur
**et généralisé** la règle à toutes les propriétés.

**Le fait aggravant** : l'insertion était **définitive**. Un champ mal classé serait resté
faux à jamais, sans recours.

## C. Les conséquences tirées

- **`effective_date = 2026-07-13` conservé** dans la publication staging **et** production.
- **Revue exhaustive des 7 lignes** contre le critère, colonne par colonne, avant
  l'insertion : chacune classée CONSERVÉ ou RENOUVELÉ, conclusion « aucune valeur mal
  classée ».
- **§2·bis ajouté au dossier**, marqué normatif pour tout le WSP.
- **Distinction la plus tranchée du chantier** : `effective_date` (date **domaine**, quand
  les règles s'appliquent) **conservée** ; `published_at`/`recorded_at` (métadonnées
  **système**, quand *cette* représentation est publiée) **renouvelées** à `now()`.

---

# Principe 6 — Séparation des trois niveaux de versionnement

## A. Formulations

**[RAPPORTÉ]** — *contexte : note de l'architecte sur les 2 occurrences `1.0.0` hors
périmètre, à porter au corps du message de commit. Style indirect : le libellé exact de
l'architecte n'est pas garanti.*
> « ce sont des versions du **PROTOCOLE**, pas du Framework. Il **refuse de déduire une règle
> par analogie** — **trois cycles de vie indépendants (documentaire, Framework, protocole)**.
> Elles restent intactes jusqu'à une décision sur le versionnement du WSP, **chantier
> distinct**. »

**[GRAVÉ]** — *contexte : arbitrage sur la version du Framework, lors du reclassement de
l'inventaire.*
> « la **distinction gravée entre version d'implémentation et version normative** — `1.0.0`
> est **réservé à la première publication normative complète du protocole** »

## B. L'incident d'origine

**Trois objets différents portaient le même numéro.**

À l'inventaire des passages inexacts, le corpus écrivait `wtr@1.0.0` alors que la base et le
seed portent `0.1`. Le balayage a trouvé **66 occurrences de `1.0.0`**, de trois natures :

1. la **version du document OCR lui-même** (`| **Version** | 1.0.0 |` + changelog) — **64
   occurrences, parfaitement correctes** ;
2. la **version du Framework** (`wtr@1.0.0`) — **14 occurrences, inexactes** ;
3. la **version du protocole** (`{"protocol":"wsp","version":"1.0.0"}` en OCR-100 l.122 ;
   `"protocol_version"` en OCR-110 l.140) — **2 occurrences, hors périmètre**.

**Le quasi-incident** : corriger « toutes les `1.0.0` » aurait **cassé le versionnement
documentaire** des 32 Records. L'inventaire porte pour cette raison un bloc d'exclusion
explicite, marqué « **vérifié deux fois** ».

Le troisième niveau (protocole) a été découvert **en fin de chantier**, en vérifiant le
contexte d'OCR-100 l.122 — il ne figurait pas dans l'analyse initiale.

## C. Les conséquences tirées

- **Inventaire B** limité aux **14** occurrences de version **du Framework**, avec bloc
  d'exclusion nommant les formes documentaires à ne **jamais** toucher.
- **Corpus corrigé** : 14 passages `1.0.0 → 0.1` ; **0 version de Framework en `1.0.0`**
  après contrôle ; les **64 documentaires intactes** ; les **2 protocole non touchées**.
- **Refus explicite de l'analogie** : le versionnement du protocole devient un **chantier
  distinct**, non déductible de la règle appliquée au Framework.
- Publication de `framework:wtr@0.1` — et non `1.0.0`.

---

# Principe 7 — Publication des seules relations référençables par un fait

## A. Formulations

**[GRAVÉ]** — *contexte : arbitrage de la granularité, énoncé comme règle en tranchant le
scénario.*
> « granularité **TRANCHÉE** : **3 relations directes** (framework, version, skill). Les
> niveaux ne reçoivent **aucune** relation — règle gravée : « **une relation n'est publiée
> que pour un identifiant susceptible d'être référencé directement par un fait immuable** ».
> »

**[GRAVÉ]** — *contexte : principe de transitivité, transmis comme complément.*
> « **TRANSITIVITÉ confirmée** : seules les relations **DIRECTES** sont publiées. Une
> relation **déductible** n'est **jamais stockée**. La base ne contient que les **faits
> élémentaires**. »

**[GRAVÉ]** — *contexte : consigne accompagnant la demande d'analyse, avant l'arbitrage.*
> « Ne tranche pas — **c'est normatif**. »

## B. L'incident d'origine

**Un décompte plausible démenti par la mesure du code.**

Sept objets étaient publiés en double (définition, version, skill, **4 niveaux**). La
question posée : faut-il **1** relation (framework seul) ou **7** (une par objet) ?
L'exécutant a d'abord présenté les deux scénarios sans trancher.

**La mesure a départagé.** Relevé sur `lib/wsp/evidenceCovered.ts` et la préimage du fait :
un fait porte `framework.id`, `framework.version`, `demonstrates.skill_id` / `reference` —
**mais le niveau y est stocké en SLUG** (`claimed_level: "applied"`), **jamais** l'identifiant
de niveau `wtf:212#applied`. Les 4 identifiants de niveau sont **internes** ; aucun fait ne
les déréférence.

**Conséquence du constat** : dans le scénario à 7, **4 maillons sur 7** auraient été des
relations **définitives sans valeur consommateur** — irrévocables, et pointant des
identifiants que rien n'interroge. Le décompte est passé de **7 à 3**.

## C. Les conséquences tirées

- **3 relations publiées** : framework, version, skill. **Aucune relation de niveau**, en
  staging comme en production.
- **Contrôle de relecture ajouté** (PROD-4) : vérification explicite qu'**aucune relation de
  niveau** ne figure dans le lot à insérer, en plus de la vérification de direction.
- **§9 du dossier réécrit** autour de la question « quels identifiants les consommateurs
  déréférencent-ils ? » — et non « est-ce approprié ? ».
- Combiné à la transitivité : la correspondance `wtf:212#niveau → wtr:212#niveau` reste
  **déductible**, jamais stockée.

---

# Principe 8 — Statut dérivé, jamais stocké

## A. Formulations

**[GRAVÉ]** — *contexte : décision 1 des quatre décisions fondatrices, énoncée avant même la
conception de la table.*
> « table de succession **APPEND-ONLY** ; le statut « superseded » **n'est JAMAIS stocké sur
> la définition**, il se **DÉRIVE de l'existence d'une relation** de succession »

**[GRAVÉ]** — *contexte : statuts arrêtés après l'abandon de `supersedes`, lors de
l'amendement du dossier.*
> « statuts dérivés gravés : représentation **historique** → status « **reidentified** » +
> `canonical_identifier` ; représentation **courante** → status « **canonical** » +
> `previous_identifier`. **Jamais persistés**. »

## B. L'incident d'origine

**Deux constats de terrain, l'un rendant le stockage impossible, l'autre le rendant inutile.**

**(i) La base ne peut pas porter le statut.** Vérification sur
`supabase/migrations/20260713000001_wsp_framework.sql` : la colonne
`wsp_framework_versions.status` est contrainte par
`check (status in ('published', 'deprecated'))` — **la valeur `superseded` n'existe pas** au
schéma. L'y ajouter aurait exigé une migration de schéma ; et **l'écrire sur une ligne
existante aurait de toute façon été bloqué** par la garde append-only (principe 4). Le statut
**ne pouvait pas** être stocké, même si on l'avait voulu.

**(ii) Le protocole grave déjà cette discipline ailleurs.** Le corpus porte, pour le Trust :
« computed views over facts and are **never authored directly** » (OCR-100 l.117) ; « **never
typed in**, never set by an Issuer, and **never stored as an authored opinion** » (OCR-106
l.22). La même discipline appliquée à l'identité — mais **jamais énoncée** pour elle.

> ⚠️ **Incident d'origine partiellement identifiable.** Contrairement aux principes 4, 5, 6
> et 7, il n'y a **pas d'incident déclencheur unique** : la décision 1 est arrivée **d'emblée**,
> dès les quatre décisions fondatrices, avant toute mesure. Les deux constats ci-dessus sont
> des **vérifications a posteriori** qui l'ont confirmée, non des problèmes rencontrés qui
> l'auraient provoquée. L'architecte écrit ici sur une **conviction antérieure**, pas sur une
> correction.

## C. Les conséquences tirées

- **Aucune colonne de statut ajoutée**, nulle part — ni à `wsp_frameworks`, ni à
  `wsp_framework_versions`, ni à la table de réidentification.
- **En code** : `deriveIdentity()` — fonction **pure** ; la route dérive par `EXISTS` sur
  `wsp_reidentifications`, dans les deux sens ; le contrat expose `identity_status`,
  `canonical_identifier`, `previous_identifier` **calculés**.
- **Tests ajoutés** : 4 tests de dérivation (prédécesseur / successeur / aucune relation /
  liste vide) + 3 tests du contrat + 3 tests de route.
- **Contrôle post-publication** (PROD-6.3) : vérification que le statut **se calcule
  correctement dans les deux sens** — `wtf → reidentified` + `canonical_identifier` ;
  `wtr → canonical` + `previous_identifier`.

---

# Récapitulatif de l'état de la matière

| # | Principe | Fragments | Incident d'origine |
|---|---|---|---|
| 1 | définition logique / représentation canonique | **directs** (1 gravé + 1 voisin) | identifié |
| 2 | fait immuable / mécanisme de lecture | **directs** (6 gravés) | identifié (deux incidents convergents) |
| 3 | résolution d'identité en couche de lecture | **directs** (1 gravé + 1 rapporté) | identifié (mesure du code) |
| 4 | réidentification par ajout pur | **directs** (1 gravé + 2 rapportés) | identifié — **incident fondateur** |
| 5 | conservation des propriétés normatives | **directs** (2 gravés) | identifié |
| 6 | trois niveaux de versionnement | **1 rapporté + 1 gravé** — le principal est en style indirect | identifié |
| 7 | relations référençables par un fait | **directs** (3 gravés) | identifié |
| 8 | statut dérivé, jamais stocké | **directs** (2 gravés) | ⚠️ **partiellement identifiable** — décision antérieure à toute mesure |

**Aucun des 8 principes n'a que des fragments indirects.** Le seul dont la formulation
principale est en **style rapporté** est le **6** : l'architecte voudra sans doute vérifier
que « trois cycles de vie indépendants » est bien son libellé.

**Le seul dont l'incident d'origine n'est pas pleinement identifiable est le 8** : il procède
d'une conviction posée d'emblée, non d'un problème rencontré. Si la motivation doit décrire
« le problème que le principe prévient », elle devra être écrite **de zéro** — la matière
disponible ne fournit qu'une justification a posteriori.
