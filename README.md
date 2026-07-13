# Opus X — Sprint 1

**Établir l'identité professionnelle. Émettre le Professional Passport.**

Le Passport n'est pas créé : il est **ÉMIS**. C'est un actif officiel, émis par
Opus X, détenu par le professionnel, hébergé par Opus X, **privé par défaut**.

---

## Démarrer

```bash
npm install
cp .env.example .env.local     # renseigner depuis Supabase → Settings → API
npm run dev
```

### Supabase

1. Créer le projet (région **EU** — RGPD).
2. Appliquer les migrations de `supabase/migrations/` **dans l'ordre** :
   - `..._schema.sql` — les 9 tables (dont les stubs), aucun seed
   - `..._functions.sql` — `generate_opus_id()` (opx_ + ULID), `generate_unique_handle()`
   - `..._rls.sql` — RLS **deny by default** sur toutes les tables
   - `..._emission.sql` — l'émission idempotente (V1 + V2 + V3)
   - `..._consent_versioning.sql` — version documentaire + date juridique
3. **Auth → Providers → Email → Confirm email : ACTIVÉ.**
   Sans quoi V1 n'a aucun sens (les users seraient auto-confirmés).

---

## Les 3 vigilances (non négociables)

| | |
|---|---|
| **V1** | Aucun Passport émis avant vérification **réelle** de l'email (`email_confirmed_at`). Garde en base (trigger) **et** dans le middleware. |
| **V2** | Les consentements recueillis **avant** l'existence du profil sont transportés (métadonnées de signup) puis journalisés **idempotemment**. |
| **V3** | `Identity Successfully Established` n'apparaît **qu'après** confirmation serveur d'une émission **atomique et complète** (profil + passport + trust_index + consentements) — RPC `finalize_emission()`. |

---

## Lexique verrouillé

| ✅ On dit | ❌ On ne dit jamais |
|---|---|
| **Émettre / émis** un Passport | « créer un Passport », « créer un compte » |
| **Établir / forger** son identité | « s'inscrire », « créer un profil » |
| Un **actif officiel**, un **objet** | « une card », « une fiche » |
| **Trust / Skills / Evidence Status** | « Trust Index » *(interne uniquement)* |

Première étape du cycle de vie : **Identity Established** — jamais « Identity Created ».

Un test (`lib/constants/passport.strings.test.ts`) **casse le build** si une
chaîne verrouillée est reformulée. Ce n'est pas une formalité.

---

## LOI D'OBJET (Décision 4 — la plus importante)

- Le **Passport** est un **OBJET** : passeport officiel, diplôme premium,
  certificat de confiance. Matière, profondeur, sceau. **Jamais une card SaaS.**
- Le **Dashboard** est un **OUTIL** : sobre, calme, qui respire.

Deux registres visuels distincts (`object-*` / `tool-*` dans Tailwind),
maintenus **partout** dans la plateforme.

---

## Règle de localisation (verrouillée)

- **En anglais** (voix institutionnelle) : tout ce qui relève de l'**objet
  Passport** — séquence d'émission, phrase de vision, libellés de statuts,
  étapes du cycle de vie, Opus ID. Identiques quelle que soit la langue.
- **Localisé** : toute l'**interface fonctionnelle** (navigation, boutons, aide).
- **Cas frontière** : le titre *Establish Your Professional Identity* reste en
  anglais ; les champs et le CTA autour sont localisés.

---

## Protocole STOP & REPORT

En cas d'ambiguïté, de contradiction avec la spec, ou de décision produit
manquante : **s'arrêter**, signaler précisément (lot, fichier, nature du
conflit), attendre une décision humaine. **Ne jamais improviser une décision
produit.**

---

## Hors périmètre (Décision 6 — résister à l'ajout)

Pas de Marketplace, Billing, Developer Console, Organizations, Frameworks UI,
admin. Le Sprint 1 a **un seul objectif** : établir une identité, émettre un
Passport, afficher un Dashboard minimaliste à 4 modules.

---

## Structure

```
app/
  (marketing)/       Landing            — Lot 10
  (auth)/            Establish, Verify  — Lots 5 & 6
  (ceremony)/        ÉMISSION (le pic)  — Lot 7
  (app)/             Dashboard          — Lot 9
  (public-passport)/ Réservé, 404       — non ouvert en Sprint 1
lib/
  constants/passport.strings.ts   ← CHAÎNES VERROUILLÉES (source unique)
  auth/AuthService.ts             ← V1 + V2 + V3 côté client
  supabase/                       ← clients server & browser
supabase/migrations/              ← schéma, RLS, émission idempotente
```
