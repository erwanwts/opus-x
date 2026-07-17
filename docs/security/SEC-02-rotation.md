# SEC-02 — Rotation des secrets staging : PROUVÉE

**Statut : SATISFAIT.** Vérifié le **2026-07-17**.

Ce document grave la preuve que la rotation des secrets staging (SEC-02, WEB-D4) a été
exécutée. Il lève la condition d'entrée verrouillée : le travail **staging** est désormais
autorisé. **Aucune clé en clair ici — seulement le constat.**

---

## Cible

- **Projet Supabase STAGING** : `bnzahwzuwoxjrxpqsjhp`
- Isolé de la prod (`lhqephwy…`), dont **aucun credential n'est présent** sur la machine de dev.

## Preuve d'invalidation (le point décisif)

- **Dashboard Supabase** (staging `bnzahwzuwoxjrxpqsjhp`) → *Project Settings → API Keys* →
  onglet **« Legacy anon, service_role API keys »** affiche le bouton **« Re-enable JWT-based
  API keys »**.
- La présence de ce bouton **« Re-enable »** prouve que les **clés JWT legacy sont
  actuellement DÉSACTIVÉES / révoquées**. Toute ancienne clé `anon` / `service_role` JWT
  éventuellement fuitée est donc **morte**.
- Capture datée conservée hors dépôt (preuve visuelle, non versionnée — ne contient aucun secret exploitable).

## Clés actives

- Format **nouveau schéma Supabase** : `sb_publishable_…` (ANON) et `sb_secret_…` (SERVICE_ROLE).
- Ce sont **les clés présentes dans `.env.test.local`** (gitignoré). Ce sont les **actives**.
- Les anciennes clés (fuitées) sont **révoquées** (voir preuve ci-dessus).

## Conséquences (gouvernance)

- **SEC-02 = SATISFAIT** → la condition d'entrée WEB-D4 est levée pour le **staging**.
- Le travail staging (activation RLS publique par la donnée, Passport de démo, `test:integration`)
  est **autorisé**, **staging uniquement** — la production reste hors périmètre et sans credentials
  locaux.
- La **garde anti-prod** (`tests/integration/_harness.ts`) reste en vigueur, inchangée :
  refus de démarrer si la cible de test = la base principale.

## Historique du check

- **2026-07-17** — SEC-02-CHECK initial : verdict **État 2 (non prouvée)** — clés au nouveau
  format (pas de `iat` décodable), aucune ancienne clé retrouvable pour un test 401, aucune trace
  documentaire. STOP.
- **2026-07-17** — Preuve fournie (dashboard : legacy JWT keys disabled, bouton « Re-enable »
  visible) → verdict révisé **État 1 (PROUVÉE)**. Ce document grave la trace.
