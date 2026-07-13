# Opus X — Sprint 1 · Package de transmission à Claude Code
## Plan d'implémentation exécutable, ordonné par lots

---

## 0. Cadre de mission (à lire avant tout)

### 0.1 Source d'autorité

La **spécification figée du Sprint 1** (`opus-x-sprint-1.md`, Révision Finale) est la **seule source d'autorité**. Ce package l'exécute, il ne la réinterprète pas. En cas d'écart entre ce package et le dossier figé, **le dossier figé prime**.

### 0.2 Interdictions absolues

Claude Code **ne doit jamais** :

1. **Modifier une décision produit** (les 6 décisions verrouillées + le principe fondateur « L'émotion d'abord »).
2. **Ajouter une fonctionnalité** hors périmètre (pas de Marketplace, Billing, Developer Console, Organizations, Frameworks UI, admin, ni aucune feature « utile » non demandée).
3. **Changer le vocabulaire verrouillé.** On dit **émettre / établir / forger**, jamais « créer un compte / créer un Passport ». Le Passport est **émis**. La 1ʳᵉ étape du cycle de vie est **« Identity Established »** (jamais « Identity Created »).
4. **Altérer les chaînes institutionnelles anglaises** (séquence d'émission, phrase de vision, libellés de statuts, étapes de cycle de vie). Elles sont **verbatim**.
5. **Rendre le Passport comme une card SaaS.** LOI D'OBJET : Passport = objet ; Dashboard = outil.

### 0.3 Protocole d'arrêt (STOP & REPORT)

Si Claude Code rencontre **une ambiguïté, une contradiction avec la spec, ou une décision produit manquante** : il **s'arrête**, **signale précisément** le point (lot, fichier, nature du conflit) et **attend une décision humaine**. Il **n'improvise jamais** une décision produit, ni ne « comble » un trou par une hypothèse. Improviser sur le produit est une violation.

### 0.4 Les 3 vigilances critiques (non négociables)

- **V1 — Aucune émission avant vérification réelle de l'email.** Le Passport n'est émis **qu'après** confirmation effective de l'adresse (`email_confirmed_at` renseigné). *(Câblée au Lot 4 & Lot 5.)*
- **V2 — Transport fiable des consentements pré-profil.** Les consentements recueillis **avant** l'existence du profil doivent être **transportés puis journalisés** de façon fiable et idempotente. *(Câblée au Lot 4, Lot 5, Lot 6.)*
- **V3 — `Identity Successfully Established` uniquement après confirmation serveur.** La ligne finale de la cérémonie n'apparaît **qu'après** confirmation serveur d'une émission **atomique et complète** (profil + passport + trust_index + consentements). *(Câblée au Lot 4 & Lot 7.)*

### 0.5 Conventions transverses (toujours actives)

- **Idempotence** partout où une émission/écriture peut être rejouée (double-clic, retry, reprise).
- **RLS-first** : aucune donnée lisible sans policy explicite ; le client n'a jamais le `service_role`.
- **Règle de localisation** : objet Passport en **anglais** (verbatim), UI fonctionnelle **localisée**.
- **Chaînes verrouillées centralisées** dans un module unique (voir Lot 1), importées partout, testées verbatim.
- **Migrations versionnées** et réversibles ; **types TS générés** depuis la base.

---

## LOT 1 — Initialisation du projet & conventions

**Objectif.** Poser le socle : Next.js (App Router) + TypeScript + Tailwind, client Supabase, structure en route groups, i18n, design tokens « Gravité & Clarté », et un module unique de **chaînes verrouillées**.

**Fichiers / zones.**
- Racine repo (`package.json`, `tsconfig`, `tailwind.config`, `.env.example`, `README.md`, `CONTRIBUTING.md`).
- `app/` avec route groups : `(marketing)`, `(auth)`, `(ceremony)`, `(app)`, `(public-passport)`.
- `lib/supabase/` (clients server & browser), `lib/i18n/`, `lib/constants/passport.strings.ts`.
- `styles/tokens.css` (ou config Tailwind) pour les tokens.

**Dépendances.** Aucune (lot fondateur).

**Tâches techniques.**
- Init Next.js App Router + TS + Tailwind ; ESLint + Prettier + hooks de commit.
- Clients Supabase (server/browser) ; variables d'env documentées.
- Squelette des 5 route groups (pages vides routables).
- i18n : mécanisme localisé (UI) + constantes **EN institutionnelles** séparées.
- `passport.strings.ts` : **verbatim** la séquence d'émission, la phrase de vision, les libellés `Trust/Skills/Evidence Status`, les 7 étapes de cycle de vie, le titre `Establish Your Professional Identity`.
- `CONTRIBUTING.md` : rappeler le lexique verrouillé, la LOI D'OBJET, le protocole STOP & REPORT.

**Critères d'acceptation.**
- `build` et `dev` OK ; les 5 route groups résolvent.
- Toutes les chaînes institutionnelles EN vivent dans **un seul** module et correspondent **au mot près** à la spec.
- Séparation claire chaînes EN (objet) vs UI localisée.

**Tests obligatoires.**
- Build vert + lint vert.
- Test unitaire/snapshot asserant l'**égalité verbatim** des chaînes verrouillées avec la spec.

**Risques.** Dérive de vocabulaire ; mélange EN/localisé dispersé dans le code.
**Mitigation.** Centralisation + test verbatim.

**Conditions de sortie.** Build vert, structure conforme, chaînes verrouillées centralisées et testées.

---

## LOT 2 — Schéma Supabase

**Objectif.** Créer **toutes** les tables (dont les stubs), avec colonnes, enums et checks exactement conformes à la spec. **Aucun seed** (notamment Frameworks).

**Fichiers / zones.** `supabase/migrations/*_schema.sql` ; génération des types TS.

**Dépendances.** Lot 1.

**Tâches techniques.**
- Tables actives : `profiles`, `passports`, `trust_index`, `skills`, `evidence`, `consents`.
- Tables **stub** (créées, non seedées, non surfacées) : `frameworks`, `passport_frameworks`, `partners`.
- Colonnes **exactes** (voir §3.3 de la spec). En particulier :
  - `profiles.opus_id` UNIQUE NOT NULL ; `full_name`, `headline` NULL, `avatar_url` NULL, `locale` DEFAULT `'fr'`.
  - `passports.profile_id` UNIQUE NOT NULL → `profiles(id)` ; `handle` UNIQUE NOT NULL ; `visibility` DEFAULT `'private'` CHECK ∈ (`private`,`unlisted`,`public`) ; `lifecycle_stage` DEFAULT `'identity_established'` CHECK ∈ **les 7 valeurs** ; `status` DEFAULT `'active'` ; `issued_at` DEFAULT `now()`.
  - `trust_index.passport_id` PK → `passports(id)` ; `score` numeric NULL ; `state` DEFAULT `'establishing'`.
- Générer les types TS (`supabase gen types`).

**Critères d'acceptation.**
- Migration s'applique proprement (up) et se défait (down).
- Le CHECK `lifecycle_stage` contient **exactement** : `identity_established`, `receiving_evidence`, `skills_emerging`, `trust_established`, `passport_verified`, `trusted_professional`, `authority`.
- Unicités en place (`opus_id`, `handle`, `passports.profile_id`).
- Aucun seed Frameworks.

**Tests obligatoires.**
- Migration up/down.
- Introspection : présence/type des colonnes, valeurs d'enum/CHECK, contraintes d'unicité conformes à la spec.

**Risques.** Divergence de noms/colonnes vs spec.
**Mitigation.** Test d'introspection comparant au dossier figé.

**Conditions de sortie.** Schéma conforme appliqué en local + types TS générés.

---

## LOT 3 — Contraintes, RLS & triggers (fonctions & policies)

**Objectif.** Activer **RLS deny-by-default**, poser les policies propriétaire, préparer (inactive) la policy publique, et créer les fonctions utilitaires `generate_opus_id()` et `generate_unique_handle()`.

**Fichiers / zones.** `supabase/migrations/*_rls.sql`, `supabase/migrations/*_functions.sql`.

**Dépendances.** Lot 2.

**Tâches techniques.**
- `ENABLE ROW LEVEL SECURITY` sur **toutes** les tables applicatives.
- Policies **propriétaire** (`auth.uid()`) : `profiles` (select/update self), `passports` (select/update via `profile_id`), `trust_index`/`skills`/`evidence` (select via appartenance du `passport_id`), `consents` (select/insert self).
- Policy **publique préparée mais inactive** : `passports` select pour `anon` **si** `visibility='public'` (aucune ligne publique en Sprint 1).
- Stubs (`frameworks`, `passport_frameworks`, `partners`) : RLS activé, **aucune** policy client en Sprint 1.
- `generate_opus_id()` → `opx_` + ULID (base32 Crockford).
- `generate_unique_handle(full_name)` → slug + suffixe aléatoire court, **boucle de ré-essai** sur collision.
- `security definer` + `search_path` fixé sur les fonctions ; grants minimaux.

**Critères d'acceptation.**
- RLS actif partout ; un `anon` ou un autre utilisateur ne lit **rien** qui ne lui appartient.
- `generate_opus_id()` respecte le format `opx_…` ; `generate_unique_handle()` garantit l'unicité même sous collision forcée.

**Tests obligatoires.**
- Matrice RLS de base : `anon` bloqué ; propriétaire OK ; utilisateur B ne lit pas les données de A.
- Regex de format sur `opus_id` ; test de collision de handle (forçage) → unicité maintenue.

**Risques.** Policy trop permissive ; `search_path` non fixé (faille security definer).
**Mitigation.** Revue RLS explicite + tests d'accès croisé.

**Conditions de sortie.** RLS verrouillé, policies conformes, fonctions testées.

---

## LOT 4 — Émission idempotente du Passport *(V1 + V2 + V3 câblées)*

**Objectif.** Émettre le Passport de façon **atomique, idempotente et conditionnée à la vérification email**, journaliser les consentements pré-profil, et exposer une **confirmation serveur d'émission complète**.

**Fichiers / zones.** `supabase/migrations/*_emission.sql` (trigger + fonction) ; optionnel `supabase/functions/finalize-emission/` (Edge Function).

**Dépendances.** Lots 2, 3.

**Tâches techniques.**
- **Trigger conditionné à la vérification (V1).** Se déclenche uniquement quand `email_confirmed_at` passe de NULL à non-NULL (p.ex. `AFTER INSERT OR UPDATE ON auth.users` avec garde `NEW.email_confirmed_at IS NOT NULL`). **Aucune émission** si l'email n'est pas confirmé.
- **Fonction `handle_verified_user()` `security definer`, transaction unique, idempotente :**
  1. `INSERT` `profiles` (avec `generate_opus_id()`), garde d'existence.
  2. `INSERT` `passports` (`generate_unique_handle()`, `lifecycle_stage='identity_established'`, `issued_at=now()`).
  3. `INSERT` `trust_index` baseline (`score=NULL`, `state='establishing'`).
  4. **Journalisation des consentements (V2)** depuis `raw_user_meta_data` (transportés au signup) → lignes `consents` (type, version, granted, horodatage), **idempotent**.
  - Toutes les insertions en `ON CONFLICT DO NOTHING` / gardes → **rejouable sans doublon**.
- **Confirmation serveur d'émission complète (V3).** L'émission n'est « complète » que si **les 4 écritures existent**. Exposer un signal fiable : soit une Edge Function `finalize-emission` qui vérifie et renvoie `{ complete: true }`, soit un `GET /me/passport` qui ne renvoie l'objet **que** lorsque tout est cohérent. Le Lot 7 (cérémonie) **attend** ce signal avant `Identity Successfully Established`.

**Critères d'acceptation.**
- **Exactement un** Passport par utilisateur, même sous double déclenchement / concurrence.
- **Zéro** Passport si l'email n'est pas confirmé.
- Consentements **toujours** journalisés depuis les métadonnées, sans perte, de façon idempotente.
- Un signal de **confirmation d'émission complète** est disponible et fiable.

**Tests obligatoires.**
- Double déclenchement / réexécution → 1 seul Passport.
- Deux insertions concurrentes → 1 seul Passport (contrainte + `on conflict`).
- Utilisateur non vérifié → aucun Passport, aucun profil.
- Consentements présents dans les métadonnées → journalisés exactement une fois.
- Signal de complétude : faux tant qu'une écriture manque, vrai seulement quand tout existe.

**Risques.** Trigger qui part avant vérification ; écriture partielle ; consentements perdus ; « succès » signalé avant complétude.
**Mitigation.** Garde `email_confirmed_at`, transaction unique + gardes idempotentes, source des consentements = métadonnées, signal basé sur l'existence des 4 lignes.

**Conditions de sortie.** Émission atomique + idempotente + conditionnée à la vérification ; consentements journalisés ; signal de confirmation opérationnel.

---

## LOT 5 — Authentification & vérification email *(V1 + V2)*

**Objectif.** Magic link par défaut (mot de passe en option), **vérification email active**, reprise multi-appareils, et **transport des consentements** dans les métadonnées de signup.

**Fichiers / zones.** `(auth)/authentication`, `(auth)/verify-email` ; `lib/auth/AuthService.ts` ; config Supabase Auth (redirects, templates email).

**Dépendances.** Lots 1, 4.

**Tâches techniques.**
- Config Supabase Auth : confirmations **ON**, magic link (OTP email), mot de passe optionnel, redirect URLs (`app.` ; `passport.` réservé).
- `AuthService` : `signInWithOtp`, `signInWithPassword`, `verifyOtp`, `getSession`, `signOut`.
- **Transport consentements (V2)** : passer les consentements via `options.data` (métadonnées) au signup, pour qu'ils voyagent avec l'enregistrement auth et soient lus par le trigger (Lot 4).
- Écran vérification : **attente active** (realtime/polling), *renvoyer le lien* (cooldown anti-spam), gestion **lien expiré**.
- **Reprise multi-appareils** : si le lien est cliqué sur un autre appareil, l'onglet d'origine détecte la confirmation (auth state / realtime) et **avance automatiquement** vers la cérémonie.

**Critères d'acceptation.**
- Magic link fonctionnel ; **la session/l'émission ne se débloquent qu'après vérification réelle** (V1).
- Lien expiré → renvoi gracieux ; cooldown effectif.
- Flux deux appareils : l'onglet d'origine avance seul.
- Consentements présents dans les métadonnées au signup (V2).

**Tests obligatoires.** Lien magique expiré ; deux appareils ; cooldown de renvoi ; mot de passe erroné **sans** énumération d'email.

**Risques.** Mauvaise config de redirect ; contournement de vérification.
**Mitigation.** Vérifier `email_confirmed_at` côté serveur (le trigger en dépend) ; tester le contournement.

**Conditions de sortie.** Auth + vérification robustes ; consentements transportés ; émission déclenchée **uniquement post-vérification**.

---

## LOT 6 — Écran « Establish Your Professional Identity » *(V2)*

**Objectif.** L'écran d'entrée : **titre EN institutionnel**, champs & CTA **localisés**, **consentements explicites** (cases non pré-cochées, versionnées), validation inline.

**Fichiers / zones.** `(auth)/establish` (page + composants) ; composants de consentement ; helpers de validation.

**Dépendances.** Lots 1, 5.

**Tâches techniques.**
- Titre **verbatim** `Establish Your Professional Identity` (depuis `passport.strings.ts`) ; sous-titre localisé si besoin.
- Champs **localisés** : Nom complet, Email ; validation inline douce, focus auto, Entrée = soumission.
- **Consentements** : cases Conditions + Confidentialité, **non pré-cochées**, **versionnées** ; CTA désactivé tant que champs requis + consentements invalides.
- Soumission → `AuthService.signInWithOtp` avec **consentements en métadonnées** (V2).
- États : loading sur le CTA ; erreurs (*email déjà utilisé* → « Se connecter ? », *email invalide* inline, *réseau* → réessai sans perte de saisie).

**Critères d'acceptation.**
- Titre EN au mot près ; CTA bloqué tant que non valide/consenti ; consentements versionnés et transportés ; copie conforme au lexique.
- **Aucune** case de consentement pré-cochée.

**Tests obligatoires.** Validation inline ; CTA désactivé ; capture & versioning des consentements ; chemin *email déjà utilisé*.

**Risques.** Consentement pré-coché (non conforme RGPD) ; dérive de vocabulaire.
**Mitigation.** Cases décochées par défaut testées ; import des chaînes verrouillées.

**Conditions de sortie.** Écran conforme à la spec ; consentements capturés & transportés.

---

## LOT 7 — Séquence d'émission du Passport (cérémonie) *(V3)*

**Objectif.** La **forge progressive** : séquence EN verbatim, **ligne finale conditionnée à la confirmation serveur (V3)**, phrase de vision, registre **OBJET**, un seul CTA après.

**Fichiers / zones.** `(ceremony)/issue` (page + composants d'animation) ; chaînes depuis `passport.strings.ts`.

**Dépendances.** Lots 4, 5, 6.

**Tâches techniques.**
- Jouer la séquence **dans l'ordre**, verbatim : `Establishing Professional Identity…` → `Generating Opus ID…` → `Issuing Professional Passport…`.
- **N'afficher `Identity Successfully Established` qu'après** réception du **signal de confirmation d'émission complète** (Lot 4, V3). Si le serveur est lent, l'animation **tient** jusqu'à confirmation.
- **Graver** l'Opus ID (monospace) ; **forger** l'objet Passport (matière/profondeur/sceau — registre OBJET, jamais une card).
- Afficher la **phrase de vision** (verbatim) après le scellement.
- **Un seul CTA** (après la vision) : *Découvrir mon Passport* → Dashboard.
- Erreur d'émission → message digne, **retry automatique**, **jamais** de Passport « à moitié émis ».
- Idempotence : double CTA / refresh en cours de cérémonie → **aucun doublon**, reprise propre.

**Critères d'acceptation.**
- La ligne finale **n'apparaît jamais** avant la confirmation serveur (V3).
- Le Passport n'apparaît **jamais** brutalement (forge progressive) ; registre OBJET respecté.
- Chaînes EN verbatim ; CTA révélé **uniquement** après la vision.

**Tests obligatoires.** Serveur lent (l'animation tient) ; échec → retry digne ; refresh en pleine cérémonie (reprise, zéro doublon) ; double déclenchement (zéro doublon).

**Risques.** Afficher le succès avant complétude ; doublon sur retry ; apparition brutale.
**Mitigation.** Gate strict sur le signal serveur ; idempotence héritée du Lot 4.

**Conditions de sortie.** Cérémonie conditionnée (V3), idempotente, registre OBJET, chaînes verbatim.

---

## LOT 8 — Endpoints `/me`, `/me/passport`, `/me/dashboard`

**Objectif.** Exposer le contrat d'API du Sprint 1, **sous RLS/JWT**, avec les formes **exactes** de la spec ; `PATCH /me/passport` désactivé (403) ; page publique 404.

**Fichiers / zones.** Route handlers (ou RPC) ; `IdentityService`, `PassportService`, `DashboardService`, `ConsentService`.

**Dépendances.** Lots 2, 3, 4.

**Tâches techniques.**
- `GET /me` / `PATCH /me` (`full_name`, `headline`, `avatar_url`, `locale`).
- `GET /me/passport` → inclut `lifecycle_stage` + `issued_at`.
- `PATCH /me/passport` → **403 `feature_disabled`** (préparé, désactivé).
- `GET /passports/{handle}` → **404 systématique** en Sprint 1 (aucun Passport public).
- `GET /me/dashboard` → **forme exacte** : `passport` (`opus_id`, `handle`, `visibility`, `lifecycle_stage`, `issued_at`), `trust_status` (`state`, `score:null`), `skills_status` (`state`,`count`,`verified_count`), `evidence_status` (`state`,`count`). **Aucun Frameworks.**
- `POST /me/consents` / `GET /me/consents`.
- Enveloppe d'erreur standard ; JWT requis sur `/me/*`.

**Critères d'acceptation.**
- Formes **identiques** à la spec ; état vide **véridique** (valeurs nulles réelles) ; 403/404 comme spécifié ; auth requise.
- **Aucun** champ non whitelisté exposé.

**Tests obligatoires.** Assertions de forme ; `401` non authentifié ; accès croisé refusé ; public `404` ; `PATCH /me/passport` `403`.

**Risques.** Fuite de champs non whitelistés ; forme divergente.
**Mitigation.** Sélection explicite de colonnes ; tests de forme comparés à la spec.

**Conditions de sortie.** Endpoints conformes, RLS appliquée.

---

## LOT 9 — Dashboard V1

**Objectif.** **4 modules**, minimalisme qui **respire**, Passport-**objet** avec **cycle de vie visible**, registre **OUTIL**, statuts EN, **aucun Frameworks**, états zéro « prêts ».

**Fichiers / zones.** `(app)/dashboard` (page + modules) ; thèmes de composants **OBJET** (PassportCard) vs **OUTIL** (Dashboard).

**Dépendances.** Lots 7, 8.

**Tâches techniques.**
- Consommer `GET /me/dashboard`.
- Module **Professional Passport** (proéminent) : aperçu de l'objet + **timeline de cycle de vie** (étape courante `Identity Established` + trajectoire future suggérée) + Opus ID discret + *Voir mon Passport*.
- Modules **Trust Status / Skills Status / Evidence Status** : états zéro **pédagogiques** (« prêt », jamais « raté »).
- Chrome **localisé** + libellés objet **EN** ; skeletons par module ; erreurs **isolées** par module ; **espacement généreux** (respiration).

**Critères d'acceptation.**
- **Exactement 4 modules**, **aucun Frameworks**.
- Cycle de vie **visible** (étape 1 + trajectoire).
- Registre OUTIL **distinct** du Passport-OBJET.
- États zéro « prêts », jamais décourageants.

**Tests obligatoires.** Rendu de l'état vide véridique ; isolation d'erreur par module ; cycle de vie affiché ; **checklist de revue visuelle** de la séparation OBJET/OUTIL.

**Risques.** Ressembler à une card SaaS ; ajouter des modules ; état vide décourageant.
**Mitigation.** Thèmes séparés ; revue visuelle ; 4 modules verrouillés.

**Conditions de sortie.** Dashboard conforme, minimal, qui respire, 4 modules.

---

## LOT 10 — Landing Page

**Objectif.** Marketing **SSR**, **un seul CTA** (localisé) → écran d'établissement, **visuel de l'objet Passport**, signaux de confiance, lien *Se connecter*.

**Fichiers / zones.** `(marketing)/page`.

**Dépendances.** Lots 1, 6.

**Tâches techniques.**
- Hero (promesse localisée) + **CTA unique** *Établir mon identité professionnelle* → `(auth)/establish`.
- **Visuel de l'objet Passport** (désirable) ; 2–3 signaux de confiance (propriété, permanence, sécurité) ; *Se connecter* discret ; footer légal.
- SSR ; bandeau discret si backend indisponible.

**Critères d'acceptation.** Un CTA dominant ; visuel objet présent ; chargement SSR rapide.

**Tests obligatoires.** Le CTA route bien ; rendu SSR ; bandeau backend indisponible.

**Risques.** Feature creep / multiples CTA sur la landing.
**Mitigation.** Un seul CTA verrouillé.

**Conditions de sortie.** Landing conforme.

---

## LOT 11 — QA complet

**Objectif.** Exécuter le **protocole QA** en entier, auditer **toutes** les policies RLS, prouver l'**absence de doublon** et la **cohérence des champs**, et **revérifier les 3 vigilances**.

**Fichiers / zones.** `tests/e2e/` (Playwright), `tests/integration/`, `tests/rls/` (SQL) ; `QA-CHECKLIST.md`.

**Dépendances.** Lots 1–10.

**Tâches techniques.** Implémenter et exécuter la **matrice QA** ci-dessous. Chaque scénario a un résultat attendu **binaire** (PASS/FAIL). Aucun FAIL toléré.

### Matrice QA obligatoire

| # | Scénario | Résultat attendu |
|---|---|---|
| 1 | **Double-clic** sur l'émission / le CTA | 1 seul Passport, aucune double écriture |
| 2 | **Retry réseau** pendant l'émission | Idempotent : reprise sans doublon ni état corrompu |
| 3 | **Reprise après interruption** (refresh/kill en pleine cérémonie) | Émission complétée/reprise proprement, 1 seul Passport |
| 4 | **Lien magique expiré** | Message clair + renvoi immédiat, aucune session accordée |
| 5 | **Session ouverte sur un autre appareil** | L'onglet d'origine détecte la vérification et avance seul |
| 6 | **Création concurrente** (deux requêtes simultanées) | 1 seul Passport (contrainte + on conflict) |
| 7 | **Accès aux données d'un autre utilisateur** | Refusé par RLS (aucune ligne renvoyée) |
| 8 | **Audit de toutes les policies RLS** | Chaque table : lecture/écriture conformes ; deny-by-default vérifié |
| 9 | **Passport privé inaccessible publiquement** | `GET /passports/{handle}` → 404 ; aucune fuite via anon |
| 10 | **Absence de doublon de Passport** | Contrainte `profile_id` UNIQUE tenue en toutes circonstances |
| 11 | **Cohérence Opus ID / handle / lifecycle_stage / issued_at** | `opus_id` format `opx_…` unique ; `handle` unique ; `lifecycle_stage='identity_established'` ; `issued_at` renseigné & cohérent avec la vérification |
| V1 | **Aucune émission avant vérification email** | Utilisateur non vérifié → 0 profil, 0 Passport |
| V2 | **Consentements pré-profil journalisés** | Consentements transportés → lignes `consents` présentes, versionnées, sans perte, idempotentes |
| V3 | **`Identity Successfully Established` post-confirmation** | La ligne finale n'apparaît jamais avant confirmation serveur d'émission complète |

**Critères d'acceptation.** **100 %** de la matrice en PASS ; audit RLS vert ; zéro doublon ; champs cohérents ; **3 vigilances** revérifiées.

**Tests obligatoires.** La matrice elle-même (automatisée autant que possible : e2e + intégration + SQL RLS).

**Risques.** Tests asynchrones instables ; angles morts (concurrence, RLS).
**Mitigation.** Attentes déterministes ; tests de concurrence répétés ; couverture RLS table par table.

**Conditions de sortie.** Matrice QA 100 % PASS + `QA-CHECKLIST.md` renseigné.

---

## LOT 12 — Déploiement & validation finale

**Objectif.** Déployer (Supabase prod + hébergeur front), configurer domaines & emails de vérification, exécuter le **smoke test du parcours complet**, et **signer la Definition of Done**.

**Fichiers / zones.** Config de déploiement, env prod, migrations appliquées en prod, config DNS/domaines, templates email.

**Dépendances.** Lot 11.

**Tâches techniques.**
- Appliquer les migrations en prod ; vérifier RLS identique prod/local.
- Config Auth prod : confirmations ON, templates email de vérification (chaînes verrouillées respectées), redirect URLs (`app.` ; `passport.` réservé).
- Routage domaines : `opusx.com` (landing), `app.opusx.com` (dashboard), `passport.opusx.com` (public, non ouvert). Sous-domaines `api.`/`docs.`/`developers.`/`verify.` **réservés, non déployés**.
- Smoke du parcours complet en prod : Landing → Establish → Auth → **vérification réelle** → Émission → Dashboard, en **< 2 min**.
- Vérifier : Passport privé → 404 public ; aucun Frameworks UI ; les 3 vigilances tiennent en prod.

**Critères d'acceptation.** Parcours complet fonctionnel en prod ; vérification email réelle ; DoD globale satisfaite ; vigilances OK en prod.

**Tests obligatoires.** Smoke prod du parcours ; email de vérification reçu & fonctionnel ; public 404 ; `time-to-passport < 90 s`.

**Risques.** Mauvaise config email/redirect en prod ; divergence RLS prod.
**Mitigation.** Vérifier délivrabilité email ; comparer policies prod/local.

**Conditions de sortie.** DoD globale signée ; Sprint 1 livrable.

---

## Definition of Done — globale (Sprint 1)

Le Sprint 1 est **livrable** quand **tout** est vrai :

1. Parcours **Landing → Establish → Auth → (Vérification réelle) → Émission → Dashboard** sans configuration, en < 2 min.
2. Passport **émis automatiquement**, **idempotent**, **uniquement post-vérification** (V1), avec `opus_id` (`opx_…`), `handle` unique, `lifecycle_stage='identity_established'`, `issued_at`.
3. Consentements pré-profil **transportés et journalisés** de façon fiable (V2).
4. Cérémonie de **forge** : séquence EN verbatim, `Identity Successfully Established` **uniquement après confirmation serveur** (V3), phrase de vision, **registre OBJET**.
5. Passport **privé par défaut** ; page publique = **404** ; RLS deny-by-default auditée.
6. **Dashboard V1** : **4 modules** (Passport + Trust/Skills/Evidence Status), **cycle de vie visible**, **aucun Frameworks**, états zéro « prêts », qui **respire**, registre OUTIL.
7. **Vocabulaire verrouillé** respecté partout (aucun « créer un compte / créer un Passport »); chaînes EN verbatim.
8. **Matrice QA 100 % PASS** + 3 vigilances revérifiées.
9. Aucune fonctionnalité hors périmètre ajoutée.

---

## Prompt final — prêt à coller dans Claude Code

> Copier-coller intégralement le bloc ci-dessous dans Claude Code pour démarrer.

```text
CONTEXTE
Tu implémentes le Sprint 1 d'Opus X, une infrastructure d'identité professionnelle dont l'artefact central est le Professional Passport (un actif officiel ÉMIS par Opus X, détenu par le professionnel, hébergé par Opus X, privé par défaut). La spécification figée « opus-x-sprint-1.md » (Révision Finale) est la SEULE source d'autorité. Le présent package d'implémentation (« opus-x-package-claude-code.md ») l'exécute par lots ; en cas d'écart, la spec figée prime.

PÉRIMÈTRE
Uniquement : établir l'identité, émettre le Passport, afficher un Dashboard minimaliste à 4 modules (Professional Passport + Trust Status + Skills Status + Evidence Status). Stack : Next.js (App Router) + TypeScript + Tailwind ; Supabase (Auth + Postgres + RLS + Edge Functions).

ORDRE D'EXÉCUTION (strict, un lot à la fois)
1) Initialisation du projet & conventions
2) Schéma Supabase
3) Contraintes, RLS & triggers
4) Émission idempotente du Passport
5) Authentification & vérification email
6) Écran « Establish Your Professional Identity »
7) Séquence d'émission du Passport
8) Endpoints /me, /me/passport, /me/dashboard
9) Dashboard V1
10) Landing Page
11) QA complet
12) Déploiement & validation finale
Ne commence un lot que lorsque les conditions de sortie du précédent sont remplies.

TROIS VIGILANCES CRITIQUES (non négociables)
V1 — Aucun Passport émis avant vérification RÉELLE de l'email (email_confirmed_at renseigné).
V2 — Les consentements recueillis AVANT l'existence du profil doivent être transportés (métadonnées de signup) puis journalisés de façon fiable et idempotente dans la table consents.
V3 — « Identity Successfully Established » n'apparaît QU'APRÈS confirmation serveur d'une émission atomique et complète (profil + passport + trust_index + consentements).

INTERDICTIONS ABSOLUES
- Ne modifie AUCUNE décision produit.
- N'ajoute AUCUNE fonctionnalité hors périmètre (pas de Marketplace, Billing, Developer Console, Organizations, Frameworks UI, admin).
- Ne change PAS le vocabulaire verrouillé : on ÉMET/ÉTABLIT, jamais « créer un compte / créer un Passport ». Première étape de cycle de vie = « Identity Established » (jamais « Identity Created »).
- Ne modifie PAS les chaînes institutionnelles anglaises (séquence d'émission, phrase de vision, libellés de statuts, étapes de cycle de vie) : elles sont VERBATIM.
- Ne rends JAMAIS le Passport comme une card SaaS. LOI D'OBJET : Passport = objet (passeport/diplôme/certificat) ; Dashboard = outil sobre.
- Respecte la Règle de localisation : objet Passport en anglais, UI fonctionnelle localisée.

RÈGLE D'ARRÊT (obligatoire)
Si tu rencontres une ambiguïté, une contradiction avec la spec, ou une décision produit manquante : ARRÊTE-TOI, signale précisément le point (lot, fichier, nature du conflit) et attends une décision humaine. N'IMPROVISE JAMAIS une décision produit et ne comble aucun trou par hypothèse.

CRITÈRES DE RÉUSSITE PAR LOT
Pour chaque lot, respecte : objectif, fichiers/zones, dépendances, tâches, critères d'acceptation, tests obligatoires, risques, conditions de sortie — tels que définis dans le package. Ne passe pas au lot suivant tant que tests et conditions de sortie ne sont pas verts.

QA (matrice obligatoire, 100 % PASS avant déploiement)
Double-clic ; retry réseau ; reprise après interruption ; lien magique expiré ; session sur un autre appareil ; création concurrente ; accès aux données d'un autre utilisateur ; audit de TOUTES les policies RLS ; Passport privé réellement inaccessible publiquement (404) ; absence de doublon de Passport ; cohérence Opus ID / handle / lifecycle_stage / issued_at ; plus revérification des 3 vigilances.

DEFINITION OF DONE
Parcours complet < 2 min sans configuration ; Passport émis idempotent et post-vérification avec opus_id (opx_…), handle unique, lifecycle_stage=identity_established, issued_at ; consentements journalisés (V2) ; cérémonie de forge avec ligne finale post-confirmation (V3) et registre OBJET ; Passport privé par défaut, page publique 404, RLS auditée ; Dashboard V1 à 4 modules avec cycle de vie visible, sans Frameworks, qui respire ; vocabulaire verrouillé respecté ; matrice QA 100 % PASS ; aucune fonctionnalité hors périmètre.

DÉMARRAGE
Commence par le Lot 1. Avant d'écrire du code, confirme en une phrase que tu as chargé la spec figée comme source d'autorité, puis exécute le Lot 1 et présente ses résultats (avec tests) avant de continuer.
```
