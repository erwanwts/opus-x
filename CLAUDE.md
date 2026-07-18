# CLAUDE.md — Opus X (application + site public opusx.world)

## Projet
Opus X est la plateforme de confiance du **World Skills Protocol (WSP)**. Ce dépôt
contient l'**application** (Next.js 15 / React 19 / TypeScript / Tailwind / Supabase SSR)
et — en construction — le **site public institutionnel `opusx.world`** dans le **même
dépôt**, via des **route groups** (décision verrouillée). Le Professional Passport est
**ÉMIS**, jamais « créé ».

## Règles non négociables (gouvernance)
- **Rien de prouvé ne doit être cassé** par ce qui suit. En cas de doute → **STOP**.
- **STOP** sur toute décision produit / juridique / normative / architecturale manquante :
  cite le point, demande l'arbitrage, **n'improvise jamais**.
- **Aucun code hors d'un mandat validé.** Le superviseur (chat Claude.ai) rédige les
  mandats `WEB-00x` ; ce dépôt les **exécute lot par lot**.
- **Preuve brute obligatoire** avant de déclarer un lot fini : sortie de `npm run build`,
  run des tests concernés, `git status` / `git diff`. Jamais « c'est fait » sur un récap.
- **SEC-02 = SATISFAIT** (rotation staging **prouvée le 2026-07-17** — legacy JWT keys
  révoquées ; réf. `docs/security/SEC-02-rotation.md`). Le travail **staging** est désormais
  **autorisé** (staging `bnzahwzuwoxjrxpqsjhp` uniquement). **La production reste interdite**
  (aucun credential prod local) ; **ne jamais déployer en prod** sans mandat dédié.
- **Ne jamais travailler sur `main`.** Une branche par sprint (`web/web-00x-...`),
  commits par lot = filet de rollback.
- Un document gelé (`docs/`) **ne se modifie pas** pour résoudre un besoin technique.
- **Un seul lot à la fois.** Pas de lot suivant sans validation du superviseur.

## Invariants techniques à préserver (audit WEB-001A)
- RLS **deny-by-default** ; **aucune** `service_role` côté client ; le client public du
  Passport est **anon**, la RLS est la seule barrière.
- Passport public : **404 non-énumérant** (privé indistinct d'inexistant) + réponse
  construite par **whitelist explicite** (jamais de spread d'une ligne DB).
- La **garde anti-prod** des tests d'intégration (`tests/integration/_harness.ts`) ne doit
  **jamais** être contournée (refuse de tourner si l'URL de test = l'URL principale).
- `tests/unit/w7-no-issuer-specific-code.test.ts` : **aucun code spécifique à un Issuer**.
- `lib/constants/passport.strings.ts` est **verbatim** (test d'égalité stricte) — ne pas
  traduire, reformuler ni « améliorer ».

## Lexique verrouillé (anglais canonique)
Passport **issued** (jamais « created »). Identity **established** (jamais « signed up »).
Jamais « account ». Termes officiels intacts : World Skills Protocol · Professional
Passport · Framework · Skill · Evidence · Issuer · Trust / Skills / Evidence **Status** ·
Opus ID · Identity Established. **Aucun synonyme marketing.**

## Décisions Web verrouillées (WEB-D1 → D5)
- **D1** — Passport HTML public → `/p/{handle}` ; API JSON `/passports/{handle}` inchangée ;
  racine libérée pour `[locale]`.
- **D2** — World Trader Framework (**nom inchangé**) · framework_id canonique **`framework:wtr`** · coordonnées préfixées **`wtr:`** · slug public **`world-trader`**. L'ancien `wtf` est obsolète, conservé à titre historique dans les notes de migration jusqu'à retrait.
- **D3** — Juridique : routes/composants/versioning préparés ; **textes humains requis** ;
  sinon `noindex`, non publié. Constantes `v1.0.0` / `2026-07-11` inchangées.
- **D4** — **SEC-02** = condition d'entrée avant tout câblage partagé / service externe /
  formulaire / analytics / déploiement. **✅ SATISFAIT le 2026-07-17** (rotation staging
  prouvée, réf. `docs/security/SEC-02-rotation.md`) — le verrou est levé pour le staging.
- **D5** — Racine `/` → **307** (cookie → Accept-Language → `en`) ; `x-default → /en` ;
  aucun contenu indexable concurrent à la racine.
- **i18n** — `en` / `fr` / `es`, canonique **en**, **fallback strict** : jamais d'anglais
  sous `/fr` ou `/es` ; une route non traduite n'est **pas générée**, absente du sitemap
  et des `hreflang`.

## Design (PRODUCT-001 — dans `docs/`)
Composition éditoriale **dérivée du registre OUTIL** (pas de nouveau registre). Navy
dominant. **Or = confiance méritée uniquement** — jamais décoratif, ni navigation, ni CTA,
ni en-tête ; le **logo** conserve son or (exception bornée). Aucune gamification, aucun
score de personne, aucun 0/100, aucun écart présenté comme un échec.

## Commandes
- `npm install`
- `npm run dev` — dev local (nécessite `.env.local`)
- `npm run build` — **doit passer** avant tout « lot fini »
- `npm test` — tests unitaires (Vitest)
- `npm run test:integration` — staging isolé (`.env.test.local`, **après SEC-02**)

## Où est la spec
Conception complète : **WEB-001B v0.2** (validé, WEB-001C). Mandats d'exécution :
**WEB-002 (Fondations)** puis suivants (fournis par le superviseur). Sources de vérité
normatives : dossier `docs/` (PRODUCT-001, ARCH-001, ENG-001/002, SPRINT-002,
opus-x-sprint-1).

## Boucle de travail
1. Le superviseur (chat) livre un mandat `WEB-00x`, découpé en lots (A → …).
2. Ici : exécuter **un lot à la fois**, en **Plan Mode** d'abord pour tout lot qui touche
   du code déjà prouvé (ex. refactor du root layout de l'application).
3. Fournir la **preuve brute** (sortie build, runs de tests, `git diff`).
4. Le superviseur valide → lot suivant.
