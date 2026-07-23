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
| **D-011** | P9 vise le statut **protocole**, pas le documentaire — le champ `Status` est hors P9, **pas de violation** | **rendue + APPLIQUÉE** | **`<ce commit>`** (2026-07-24, correction de la PARTIE III) — ⚠️ **conséquence NON tranchée : la seconde source reste ouverte → D-012.** Exige aussi une **précision de P9 dans OCR-006** (« any published representation » est général ; OCR-006 en Phase 3, jamais relu) |

## Décisions EN ATTENTE chez l'Architecte

| Réf | Objet | Statut |
|---|---|---|
| **D-010** | **Grain de l'artefact de promotion** — un artefact par Record (fin) vs un artefact multi-événements (gros) | **SUSPENDUE** (en aval de la persistance du statut) — ne pas trancher par conception |
| **D-012** | **Seconde source du statut documentaire** — un artefact `PROMO` dira « promu », le champ `Status` dira « Draft » : deux porteurs, même vérité. **Laquelle gouverne ?** Seconde source **déjà réalisée** : `recordPage.ts:115` (champ) vs `api.ts:56` (`lifecycle_status` du manifeste) | **remontée par D-011, non rendue** |
| *(amendement)* | **Précision de P9 dans OCR-006** — exclure explicitement le statut documentaire de « any published representation » | à instruire (OCR-006 Phase 3, jamais relu) |

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
- **Préalable P9/P5** (PARTIE III du dossier de promotion) : le statut est déjà **persisté** ; toute
  conception du grain est en aval d'une décision non rendue sur la persistance du statut.

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
