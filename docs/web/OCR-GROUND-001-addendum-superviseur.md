# Addendum superviseur — OCR-GROUND-001

À coller sous le mandat de l'architecte, sans en modifier une ligne. Le mandat original fait foi ; cet addendum ne fait que préciser son insertion dans la séquence WEB-003 et lever trois ambiguïtés opérationnelles. En cas de contradiction apparente, on STOP et on arbitre.

## A. Insertion dans la séquence (ordre)

OCR-GROUND-001 s'exécute après l'import contrôlé (manifeste B.0 à 32/32, committé) et avant tout rendu de page (B.1+). Raison : rendre une page depuis un OCR non-groundé publierait une affirmation non vérifiée. Le grounding a besoin des 32 `.md` présents dans le repo (`docs/web/registry-import/OCR-100/`), ce que B.0 garantit.

Ordre gravé : `B.0 import (32/32, manifeste committé) → OCR-GROUND-001 (grounding + spéc générateur, pilotes 110/101) → B.1 pipeline de rendu`.

## B. Source du grounding (couche 3 « code réel »)

Le diff se fait exclusivement contre le code et les migrations VERSIONNÉS du dépôt (`opus-x`, avec commit hash), jamais contre la base Supabase live.

- Les contraintes SQL citées au §2 (S5/S7 : `UNIQUE(passport_update_id)`, `ON DELETE RESTRICT` vers `mission_order_evidence`/`mission_results`, `schema_migrations`, gardes append-only) se vérifient dans les fichiers de migration du repo (`supabase/…`), pas par une requête à la base.
- Interdiction d'interroger une base de production ou staging pour grounder. Si un fait n'est pas vérifiable depuis le code/migrations versionnés → `Ungroundable — source manquante` (STOP §7.3 du mandat), on ne devine pas et on n'ouvre aucune connexion DB.
- Rappel dette : `schema_migrations` vide → `db push` interdit en prod (DETTE-PROMOTION-01, déjà tracée). Le grounding la constate, ne la corrige pas.

## C. Doublon `OCR-00x` (manifeste Drive, §10)

La série gouvernance `OCR-000..005` existe en deux versions dans le Drive : la longue (~8–9 Ko, dossier `OCR-100`) et la courte (~2 Ko, dossier `OCR`, squelettes initiaux). La longue fait foi.

Le plan de migration/rollback Drive du §10 doit explicitement :

- désigner les 6 versions longues comme les Records gouvernance retenus ;
- lister les 6 versions courtes comme à retirer (obsolètes) dans le plan de migration ;
- ne jamais faire tourner le générateur d'artefacts (§9) sur une version courte.

Le manifeste B.0 courant a été produit sur le dossier `OCR-100` (versions longues) ; les courtes ne sont pas dans le périmètre d'import. Cohérence à maintenir dans `MANIFEST-OCR.json`.

## Inchangé

Tout le reste du mandat OCR-GROUND-001 s'applique tel quel : règle des trois couches, lecture seule (aucune modif code/OCR/Drive), format d'écart à 9 champs, criticité BLOCKER/MAJOR/MINOR/INFO, ordre §5 (Evidence d'abord), pilotes 110 puis 101, spéc générateur §9, DoD §11, STOP §7. Les 7 artefacts dérivés d'OCR-110 fournis par l'architecte (checksum source `sha256:384b6dec…`) servent de golden test au générateur : régénérés depuis `OCR-110_Evidence.md`, ils doivent retomber octet pour octet (hors PDF, égalité de contenu) sur ces références.
