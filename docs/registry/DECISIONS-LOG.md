# Registre des décisions — rendue vs appliquée

**Motif.** Une décision **rendue** par l'Architecte n'est pas une décision **appliquée** au dépôt.
D-005 a été rendue, jamais propagée, et présentée six tours plus tard comme encore ouverte. Rien
n'attestait qu'elle avait atteint le code. Ce registre est le **chaînon** manquant : chaque décision
y porte le commit qui l'a appliquée, ou l'aveu qu'elle ne l'a pas été. (Proposition (6) du registre
des règles découvertes.)

| Décision | Objet | Statut | Appliquée par |
|---|---|---|---|
| **D-001** | Option 1a — artefact de promotion à côté du Record | rendue | *(conception, pas de code)* |
| **D-002 v2** | Modèle B″ — projections non gouvernées | rendue | *(conception ; lot B″ chiffré, non exécuté)* |
| **D-004** | Série `PROMO-xxx` hors plages | rendue | `expected_ranges` amendé (voir git — attestation de plage) |
| **D-005** | OCR-123 → Phase 2, partition **29·3·1** | **rendue + APPLIQUÉE** | **`733646f`** (2026-07-24) — *rendue bien avant ; jamais propagée pendant six tours* |
| **D-006** | Régime `[GRAVÉ]` — source externe + renvoi | rendue + appliquée | 2ᵉ réédition d'ARCHITECTURE-V3 (`528e303`, `ce7c8d0`) |
| **D-007** | Seau B suit le régime des orphelins | rendue + appliquée | idem 2ᵉ réédition |
| **D-008** | Q1 critère sur le contenu (→ retiré) · Q2 structurer les dettes | rendue + appliquée | `31cad76` (Q2) ; Q1 tranché retrait, cf. D-009 |
| **D-009** | Retirer « modification substantielle » de la grille | **rendue + APPLIQUÉE** | **`733646f`** (2026-07-24) |

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
