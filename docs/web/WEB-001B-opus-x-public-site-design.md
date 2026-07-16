# WEB-001B — Opus X Public Site — Document de conception

**World Skills Protocol · Chantier Web · Sprint WEB-001**

| | |
|---|---|
| **Document** | WEB-001B |
| **Titre** | Site public Opus X (`opusx.world`) — Document de conception complet |
| **Série** | Engineering / Web (chantier site institutionnel) |
| **Version** | 0.2 |
| **Statut** | Draft — révisé, en attente de validation humaine (WEB-001C) |
| **Date** | 2026-07-16 |
| **Langue du document** | Français (document de travail interne) |
| **Classification** | INTERNAL — non indexé, non publié |
| **Fondé sur** | Audit réel WEB-001A (dépôt `erwanwts/opus-x`, HEAD `9bcb98b`, 2026-07-16) ; décisions WEB-D1→WEB-D5 |

> **NOTE — Position de ce document.** WEB-001B est un **profil d'implémentation Web**. Il ne modifie aucun document gelé du corpus. Là où le corpus normatif (WSP, ARCH, PRODUCT, FOUNDATION, OPUS, FRAMEWORK, SCHEMA, ENG) et ce profil sembleraient diverger, **le normatif prévaut**. Le document spécialise des choix laissés ouverts (route HTML publique, i18n, SEO/GEO, modèle de contenu) sans redéfinir aucune règle. Règle directrice : *« Nothing that has been proven may be broken by what comes next. »*

## Journal des révisions

| Version | Date | Changements |
|---|---|---|
| 0.1 | 2026-07-16 | Publication initiale — 23 livrables sur arborescence figée WEB-D1→D4. |
| 0.2 | 2026-07-16 | **Correction 1** — résolution technique de `<html lang>` (root layouts par branche, `setRequestLocale`) + impact rendu statique/cache/perf (§10.1). **Correction 2** — suppression du « troisième registre » : composition éditoriale dérivée du registre OUTIL ; règle de l'or corrigée (exception logo bornée) (§6). **Correction 3** — fallback linguistique strict : jamais d'anglais sous `/fr`·`/es` (§10.2). **Correction 4** — matrice explicite V1 / architecture cible (§6.1). **Décision WEB-D5** — racine `/` validée (§10.3). |

---

## Décisions verrouillées (rappel — ce document est autoportant)

- **WEB-D1** — Vue HTML publique du Passport sous préfixe statique **`/p/{handle}`** ; API JSON publique **`/passports/{handle}`** inchangée. La racine est libérée pour `[locale]`. Aucune redirection depuis l'ancien `/{handle}` (jamais mis en circulation).
- **WEB-D2** — **World Trader Framework** ; slug public **`world-trader`** ; identifiant canonique WSP **`wtf`** inchangé, exposé dans les données structurées.
- **WEB-D3** — Infrastructure juridique préparée (routes, composants, versioning). Textes rédigés/validés **humainement** avant publication ; sinon page **`noindex`, non publiée**. Constantes gelées `v1.0.0` / `2026-07-11` inchangées.
- **WEB-D4** — **SEC-02** (rotation des secrets staging) = **condition d'entrée** avant tout câblage partagé, service externe, formulaire, analytics ou déploiement. Ne bloque pas la rédaction ; bloque l'implémentation concernée.
- **WEB-D5** — Racine `/` : **redirection 307 temporaire** selon (1) cookie de langue, (2) `Accept-Language`, (3) fallback anglais ; `x-default` → `/en` ; design de la landing porté vers les pages localisées ; **aucun contenu indexable concurrent** à la racine (§10.3).
- **Repo** — même dépôt, route groups dédiés. **Classification du corpus en 4 niveaux** : PUBLIC / PUBLIC SUMMARY ONLY / RESTRICTED / INTERNAL. **Commando OS** = Certified Issuer / premier démonstrateur uniquement. **Auteur** = Opus X. **Pas de page Pricing** en V1. **Contact** abstrait. **Racine** `/en /fr /es`. **`llms.txt` + `llms-full.txt`** publics. **Analytics** privacy-first abstrait. **`next-intl`** validé.

---

## 1. Audit du dépôt actuel (synthèse WEB-001A)

Dépôt réel, à jour (dernier commit le jour même). **Stack** : Next.js 15 (App Router), React 19, TypeScript 5.6, Tailwind 3.4 (mappé verbatim sur *PRODUCT-001 Annexe A*), Supabase SSR, `canonicalize` 3.0 (RFC 8785), Vitest (unit + intégration). **Aucune librairie i18n** — seulement `lib/i18n/fr.ts` fait-maison (registre OUTIL localisé) et `lib/constants/passport.strings.ts` (chaînes **anglaises** de l'OBJET Passport, protégées par un test d'égalité stricte).

**Sécurité — posture exemplaire, à préserver telle quelle** : zéro `service_role` côté client/app ; Passport public via client anon + RLS comme seule barrière (indistinction connecté/anonyme) ; garde anti-prod des tests d'intégration robuste (refuse de démarrer si URL de test = URL principale, vérifiée à l'import *et* en `globalSetup`) ; test `w7-no-issuer-specific-code`.

**SEO/GEO** : terrain vierge. Aucun `sitemap.ts`, `robots.ts`, `generateMetadata`, `metadataBase`, ni `alternates/hreflang`. Seuls `title`/`description` au layout racine + `og-image.png` et icônes.

**Corpus embarqué** (`docs/`) : PRODUCT-001 v1.1, ARCH-001 v0.2, ENG-001, ENG-002, SPRINT-002, opus-x-sprint-1. Les sources de vérité sont dans le dépôt — la publication documentaire s'appuiera dessus.

## 2. Recommandation repo — 3. Justification

**Même dépôt, route groups dédiés** (verrouillé). Justification confirmée par l'audit : le site partage le design system (Tailwind ↔ PRODUCT-001 Annexe A déjà en place), le lexique verrouillé (`passport.strings.ts`), la garde anti-prod, le pipeline staging→prod Vercel prouvé et Supabase. Un dépôt séparé imposerait de dupliquer et resynchroniser tout cela, pour un bénéfice d'isolation que les route groups + le middleware fournissent déjà. Séparation applicative/site assurée par la frontière de routing (site sous `[locale]`, app à la racine sans locale) et par l'exclusion explicite du site du round-trip de session (§ Middleware).

## 4. Cartographie des routes existantes

```
Route groups (aucun segment d'URL) :
  (marketing)        /                    landing institutionnelle COMPLÈTE (construite, non squelette)
  (auth)             /establish  /verify-email
  (ceremony)         /emission
  (app)              /dashboard  /link  /link/token  /passport     [protégés middleware]
  (public-passport)  /[handle]            page HTML, 404 non-énumérant en Sprint 1 — OCCUPE la racine dynamique

Handlers (hors groupe) :
  /api/link/authorize · /api/link/revoke · /auth/callback
  /frameworks/[id]/skills · /issuers/evidence (ingestion HMAC)
  /me · /me/consents · /me/dashboard · /me/passport
  /passports/[handle]  (route.ts — API JSON publique du Passport)
```

## 5. Risques de collision — résolution & plan de migration

**Collision unique confirmée** : `app/(public-passport)/[handle]/page.tsx` est un segment dynamique **racine** ; `app/[locale]/…` introduirait un second slug dynamique racine de nom différent → **échec de build** Next.js (« different slug names for the same path »). `/passports/[handle]` (préfixe statique) ne collisionne pas.

**Résolution (WEB-D1)** : déplacer la page HTML sous `app/(public-passport)/p/[handle]/page.tsx` → URL `/p/{handle}`. La racine dynamique est supprimée avant l'introduction de `[locale]`.

**Plan de migration — invariants à préserver exactement** (aucune régression Sprint 1) :
- même comportement **404 privé/non-énumérant** (aucune distinction « existe mais privé » vs « n'existe pas ») ;
- **client Supabase anonyme** (`createPublicClient`, `persistSession:false`) ;
- **RLS** comme barrière principale (policy `visibility = 'public'` uniquement) ;
- construction de la réponse par **whitelist explicite** — jamais de spread d'une ligne DB ;
- **tests de confidentialité existants** repointés sur `/p/{handle}`, verts avant fermeture du lot ;
- **suppression** de l'ancienne route racine dynamique **avant** l'ajout de `[locale]` ; **pas** de recréation via middleware ambigu ; **aucune** redirection `/{handle}` (jamais mise en circulation).
- WEB-001B **signale** (sans réécrire) : si un document gelé mentionne `/{handle}`, l'implémentation Web V1 **spécialise** l'accès HTML sous `/p/{handle}` ; le normatif prévaut en cas de contradiction réelle.

## 6. Architecture cible du site

Site institutionnel + documentaire, **rendu côté serveur / pré-rendu**, sous `app/[locale]/` (locale ∈ `en|fr|es`, canonique institutionnelle = `en`). Il **explique et oriente** ; il ne **duplique jamais** l'application (Passport privé, Dashboard, cérémonie, auth). Trois piliers d'expérience : (1) **Institutionnel** — Home, Passport, WSP, Professionals, Issuers, Organizations, Developers, About, Contact, Legal ; (2) **Knowledge Center** — Glossary, FAQ, Use Cases, Comparisons, Research, Blog, Docs ; (3) **GEO Foundation** — pages de définition et pages-questions « answer-shaped », graphe d'entités, blocs LLM, `llms.txt`.

**Composition éditoriale du site (dérivée du registre OUTIL).** Le site **ne crée aucun nouveau registre normatif** à côté d'OBJET et d'OUTIL. Il applique une **composition éditoriale dérivée du registre OUTIL** et des **principes institutionnels de PRODUCT-001** — §4 (« The product never persuades. It states »), les **six notes** (§19.1 : Institution · Luxury · Technology · Trust · Calm · Precision) et **le test** (§19.2 : à sa place dans le rapport annuel d'une banque centrale *et* dans l'interface de l'entreprise technologique la plus précise du monde). Concrètement : navy dominant, grands espaces, typographie institutionnelle (Source Serif 4) pour titres et voix, interface (Inter) pour la navigation — le vocabulaire visuel déjà présent sur la landing. **Aucun token ni règle nouvelle : uniquement une composition des tokens existants.**

**Discipline de l'or (PRODUCT-001 §5.3 — exception logo bornée).** L'or est la couleur de la **confiance méritée**. Le **logo** conserve son or au titre de l'**exception bornée et non transitive déjà validée** (le logo n'est pas le sceau). Sur les surfaces éditoriales, l'or peut **signaler une confiance réellement méritée** (une certification / vérification réelle) ; il n'est **jamais** décoratif, ni couleur de **navigation**, de **CTA** ou d'**en-tête**, ni accent de marque. Sa rareté fait son autorité.

### 6.1 Périmètre V1 vs architecture cible (matrice)

Les §7–§20 décrivent l'**architecture cible**. La **V1 (fenêtre 8–12 semaines)** en est un **sous-ensemble strict**. Les routes reportées **ne sont pas créées** en V1 — ni page vide, ni page artificielle.

| Périmètre | Contenu |
|---|---|
| **V1 — obligatoire** | Fondations i18n · Home · Passport · WSP · Professionals · Issuers · Organizations · Developers · About · Contact · documentation publique MDX · glossaire initial · FAQ initiale · **20–30 pages GEO canoniques** · recherche simple · **SEO/GEO technique complet**. |
| **Reporté V1.1 / V2** | Skills Library publique · profils publics **complets** d'Issuers · **knowledge graph Supabase** · research avancée · **génération automatisée des PDF** · recherche **structurée avancée** · analytics GEO approfondis · fonctionnalités éditoriales secondaires (**Blog** éditorial, **Research** avancée) · **registre/discovery dynamique des Frameworks** et système de template par-Framework (par symétrie avec la Skills Library). |
| **À arbitrer — recommandé en V1** | Fiche **canonique** du **World Trader Framework** (`/[locale]/frameworks/world-trader`) et de la notion **Framework**, page **Evidence**, entrée **Verify**, quelques **Use Cases** / **Compare** phares — **portés comme pages GEO canoniques** (statiques, MDX), **non** comme systèmes dynamiques. Le *registre* dynamique des Frameworks reste V1.1 ; seule la **fiche du framework démonstrateur** entre en V1. *→ Décision résiduelle §23.* |

Les composants et templates dynamiques des périmètres reportés **ne sont pas montés** en V1 ; leurs slugs ne sont pas exposés, ne figurent ni au sitemap ni aux `hreflang`.

## 7. Arborescence complète des routes V1 (figée)

Marqueurs : **[V1]** créé en V1 · **[V1?]** recommandé V1, à arbitrer (§6.1) · **[V1.1]** reporté, **non créé** en V1.

```
app/
  layout.tsx OU root layouts par branche       → voir §10.1 (résolution <html lang>)
  (marketing)/
    page.tsx                          → PRÉSERVÉE jusqu'au portage ; racine = redirection (§10.3)

  [locale]/                           → en | fr | es  (site public localisé, SSR/SSG)
    layout.tsx                        → ROOT LAYOUT de branche : <html lang={locale}>, setRequestLocale (§10.1)
    page.tsx                          → [V1] Home localisée (portage du design de la landing)
    passport/page.tsx                 → [V1]
    wsp/page.tsx                      → [V1]
    frameworks/world-trader/page.tsx  → [V1?] fiche canonique GEO (statique) — WEB-D2
    frameworks/page.tsx               → [V1.1] registre/discovery dynamique
    frameworks/[frameworkSlug]/page.tsx → [V1.1] template par-Framework
    skills/…                          → [V1.1] Skills Library publique
    evidence/page.tsx                 → [V1?]
    issuers/page.tsx                  → [V1] présentation du rôle Issuer
    issuers/apply/page.tsx            → [V1] prise de contact (abstraction, post-SEC-02)
    issuers/[issuerSlug]/page.tsx     → [V1.1] profil public COMPLET d'Issuer
    organizations/page.tsx            → [V1]
    developers/page.tsx               → [V1]
    docs/page.tsx                     → [V1]
    docs/[family]/page.tsx            → [V1] familles au périmètre public validé (§23)
    docs/[family]/[document]/page.tsx → [V1]
    glossary/page.tsx                 → [V1] glossaire initial
    glossary/[term]/page.tsx          → [V1]
    faq/page.tsx                      → [V1] FAQ initiale
    faq/[questionSlug]/page.tsx       → [V1]
    knowledge/page.tsx                → [V1] hub
    use-cases/page.tsx + [slug]       → [V1?] quelques cas phares (GEO canoniques)
    compare/page.tsx + [slug]         → [V1?] quelques comparatifs phares (GEO canoniques)
    research/… · blog/…               → [V1.1] éditorial secondaire
    verify/page.tsx                   → [V1?] entrée vérification publique (oriente vers /p/{handle})
    pricing/page.tsx                  → EXISTE, noindex, NON publiée
    about/page.tsx · contact/page.tsx → [V1]
    legal/[document]/page.tsx         → [V1] infra ; noindex tant que texte humain absent (WEB-D3)

  (public-passport)/
    p/[handle]/page.tsx               → Passport HTML public (migré — WEB-D1)

  (auth)/  (ceremony)/  (app)/        → INCHANGÉS (racine, sans locale)

  passports/[handle]/route.ts         → API JSON publique INCHANGÉE (WEB-D1)
  api/ · auth/callback · me/ · issuers/evidence · frameworks/[id]/skills   → INCHANGÉS

  robots.ts · sitemap.ts              → [V1] NOUVEAUX (racine app) — §12
  llms.txt / llms-full.txt            → [V1] NOUVEAUX (public only) — §13
```

Fichiers hors `app/` : `content/` (MDX versionné Git — §8), `messages/{en,fr,es}.json` (next-intl), `lib/site/` (helpers SEO/GEO/i18n/contenu), `components/site/` (templates & blocs LLM).

## 8. Modèle de contenu — 9. Stratégie MDX / Supabase

**Hybride pragmatique** (brief §8). En **V1**, le contenu vit **essentiellement en MDX/Git** ; Supabase reste minimal (le knowledge graph structuré est **reporté V1.1**).

**A. MDX versionné dans Git** (`content/[type]/[locale]/*.mdx`) — pour tout ce qui exige review, versioning et diff Git : documentation publique, résumés de documents normatifs (PUBLIC SUMMARY ONLY), pages de définition GEO, glossaire/FAQ initiaux (V1 peut démarrer en MDX/JSON avant toute table), comparatifs et use cases phares. Frontmatter typé : `id` canonique stable, `type`, `status`, `lang`, `title`, `slug`, `summary`, `author` (= Opus X), `publishedAt`, `updatedAt`, `version`, `canonicalId` (lien inter-langues), `classification`, `sources[]`, `relations[]`, `seo{}`, `geo{}`, `indexable`.

**B. Supabase** — **en V1**, seulement si un besoin réel de requête/relation apparaît (sinon différé). Cible V1.1 : framework metadata publiques, skills publiques, relations d'entités (knowledge graph), redirects éditoriaux, navigation dynamique. RLS deny-by-default ; tables `*_public` en lecture anon **whitelistée** uniquement. **Aucune** publication automatique du corpus : chaque contenu porte une **classification** (PUBLIC / PUBLIC SUMMARY ONLY / RESTRICTED / INTERNAL) et un état (`Draft/Published/Final/Superseded/Deprecated/Archived`) ; seul `Published` + `PUBLIC*` est rendu et indexable.

**Types de contenu** (cible, brief §8.C) : `canonical_entity`, `document`, `document_version`, `glossary_term`, `faq_item`, `article`, `research_publication`, `use_case`, `comparison`, `framework_publication`, `skill_publication`, `author`, `organization`, `issuer_public_profile`, `source_reference`, `translation`, `relationship`. En V1, seuls les types nécessaires au périmètre §6.1 sont matérialisés.

**Pipeline de publication** (brief §24) : document validé → source Git/corpus approuvé → HTML → PDF officiel (les PDF existent déjà dans `docs/` ; la **génération automatisée** est V1.1) → résumé → définitions liées → FAQ liées → données structurées → maillage → sitemap → publication. **STOP** si le corpus est contradictoire : citer les documents, demander l'arbitrage, ne jamais synthétiser une définition officielle depuis des sources divergentes.

## 10. Architecture multilingue

`next-intl` (compatible, confirmé par l'audit). Règles : chaque langue a **son URL** (`/en /fr /es`) ; métadonnées **localisées** par page ; `hreflang` complets **entre traductions réellement existantes** ; `x-default` **statique → `/en`** ; sitemaps avec alternates ; slugs localisables mais **identité de contenu stable** via `canonicalId` ; **aucune** traduction client-side (SSR/pré-rendu).

### 10.1 Résolution technique de `<html lang>` (Correction 1)

**Problème.** Un layout imbriqué `app/[locale]/layout.tsx` **ne peut pas** rendre un second élément `<html>`. Il faut donc que l'élément `<html lang>` reçoive la locale **sans** dépendre d'un layout racine unique figé.

**Stratégie retenue — root layouts par branche (multiple root layouts).** On supprime le rendu de `<html>`/`<body>` du niveau supérieur et on laisse **chaque branche** posséder son propre root layout :

- **Branche site** : `app/[locale]/layout.tsx` devient un **root layout** et rend `<html lang={locale}><body>`. La locale est un **paramètre de route** ; on déclare `generateStaticParams()` retournant `en/fr/es` et on appelle `setRequestLocale(locale)` en tête de layout et de page. Résultat : **rendu statique (SSG/ISR) préservé**, locale connue **au build**, aucune opt-in dynamique.
- **Branche application + public-passport** : conserve son **propre** root layout rendant `<html lang="fr">` (comportement actuel **inchangé** — rien de prouvé n'est cassé).
- Les **polices** (Source Serif 4 / Inter / IBM Plex Mono), aujourd'hui dans `app/layout.tsx`, sont extraites dans un module partagé importé par les deux root layouts.

**Pourquoi pas l'alternative header/cookie dans un root layout unique ?** Lire la locale via `headers()` (header injecté par middleware) ou `cookies()` dans un layout **déclenche le rendu dynamique** de tout le sous-arbre : Next.js déscelle le SSG dès qu'un layout accède aux headers/cookies. Cela **détruirait** la génération statique et la mise en cache CDN de toutes les pages localisées — contraire aux objectifs SEO/GEO/perf. On rejette donc cette voie **pour les pages de rendu**.

**Impact explicite (rendu statique / cache / performance).**
- *Rendu statique* : **préservé** pour toutes les pages `[locale]` (locale = param + `setRequestLocale`). Aucune page localisée ne lit headers/cookies dans son chemin de rendu.
- *Cache* : les pages localisées sont **cacheables/CDN-friendly** (indépendantes des en-têtes de requête). Seule la racine `/` (redirection, §10.3) est dynamique — sans corps, coût négligeable.
- *Performance* : pas de round-trip par requête sur les pages du site ; le middleware `next-intl` (détection/routage de locale) et la session Supabase sont **composés** mais **scindés** — la session n'est évaluée que sur les routes app (matcher), jamais sur les pages publiques localisées.
- *Coût de refactor* : toucher à `app/layout.tsx` (fichier qui sert l'app prouvée) → **lot dédié WEB-002.0-bis** avec test de non-régression : l'app rend toujours `<html lang="fr">` et charge bien les trois polices.

### 10.2 Fallback linguistique strict (Correction 3)

Une URL localisée contient **toujours** une traduction **réelle et validée**. Lorsqu'une traduction n'existe pas :

- la route localisée **n'est pas générée** (absente de `generateStaticParams` pour cette locale) ;
- elle **n'apparaît pas** dans le sitemap ;
- elle **ne figure pas** dans les `hreflang` ;
- un accès direct renvoie un **404 honnête** ;
- l'interface **peut proposer explicitement** la version anglaise disponible (lien vers `/en/…`), **sans jamais** servir de contenu anglais sous une URL `/fr` ou `/es`.

On **ne sert jamais** une page anglaise sous une URL localisée. `hreflang` et sitemap ne référencent que des couples (locale, contenu) réellement présents.

### 10.3 Racine `/` — décision validée (WEB-D5) (Correction complémentaire)

Redirection **307 temporaire** selon l'ordre : (1) cookie de langue `NEXT_LOCALE` ; (2) `Accept-Language` ; (3) fallback anglais. `x-default` → `/en`. Le **design** de la landing actuelle est **porté** vers les pages localisées `[locale]/page.tsx`. La racine **ne contient aucun contenu indexable concurrent** (redirection sans corps). La détection runtime ne s'exécute **qu'ici et dans le middleware** — jamais dans le chemin de rendu statique des pages localisées. Nuance : `x-default` est une balise **statique** (→ `/en`), la détection runtime fait la **redirection** ; les deux coexistent sans contradiction.

## 11. Composants & templates

**Templates de page** (composition éditoriale) : `EntityPage`, `QuestionPage` (answer-shaped), `DocumentPage` (HTML + PDF + version history + source-of-truth), `GlossaryTermPage`, `FaqPage`, `ComparisonPage`, `UseCasePage`, `FrameworkCanonicalPage` (fiche world-trader statique — V1), `SearchPage`. *Reportés V1.1* : `FrameworkRegistryPage`, `SkillPage`, `IssuerPublicProfilePage`, `ArticlePage`/research. Chrome commun : `SiteHeader` (navigation par public : Professionals / Issuers / Organizations / Developers / Knowledge), `SiteFooter` (langues, legal, llms.txt, sitemap), `Breadcrumbs`, `LocaleSwitcher` (propose explicitement l'anglais quand la traduction manque — §10.2), `EntityLinks`.

**Structure éditoriale « answer-shaped »** (brief §9) pour toute page stratégique : H1 explicite → réponse directe 40–80 mots → définition canonique → pourquoi → comment → acteurs → cycle de vie → exemple → non-exemple → distinctions → FAQ → sources → date/auteur/version → liens d'entités → CTA sobre. Interdits : slogans non expliqués, superlatifs invérifiables, bourrage, pages pauvres, chiffres sans source, promesses professionnelles/financières (garde-fou doctrine : jamais « trader rentable certifié », « prop firm garantie », « certification de rentabilité » — compétences **observées**, pas résultats garantis).

## 12. Plan SEO (technique)

Metadata API Next.js par page (`generateMetadata`) : `title` unique, `description` unique, `metadataBase`, `alternates.canonical` + `alternates.languages` (hreflang **limités aux traductions existantes**, §10.2), Open Graph, Twitter/X cards, `robots` par page (non-publiées → `noindex`). **`sitemap.ts`** dynamique (par type/langue, alternates linguistiques réels uniquement). **`robots.ts`** explicite. Breadcrumbs (JSON-LD). Redirects permanents versionnés, 404 propres, gestion des `superseded`. **SSG/ISR** par défaut, Server Components, images/fonts optimisées, cache contrôlé, **aucun contenu critique dépendant du client**. HTML sémantique, accessibilité, Core Web Vitals. Aucune donnée structurée fabriquée.

## 13. Plan GEO

Objectif (brief §4) : *« Do not merely rank as a result. Become the definition used to explain the category. »* Chaque page stratégique compréhensible **indépendamment** par humain, moteur, crawler, agent IA, système RAG, développeur. Moyens : HTML complet, contenu principal dans le DOM, résumés autonomes, définitions stables, **cohérence terminologique absolue** (lexique verrouillé), réponses directes, entités reliées, sources primaires, exemples concrets, dates/auteurs/versions visibles, données structurées, maillage interne. **`llms.txt` + `llms-full.txt`** (publics uniquement) → Vision, Professional Passport, WSP, Definitions, Documentation, Frameworks, Developer docs, Research, Contact ; **jamais** de données privées/secrets/contenu non validé. **Jamais de cloaking / texte caché** — les blocs machine-readable sont **visibles**. La V1 livre **20–30 pages GEO canoniques** (définitions + pages-questions du brief §13.D), socle du graphe d'entités.

## 14. Blocs LLM (composants éditoriaux réutilisables, visibles)

Quinze blocs (brief §10), tous rendus dans le DOM, jamais cachés : **Definition** · **Direct Answer** · **Key Facts** · **Entity Relationship** · **Process** · **Distinction** (Evidence vs Claim, Issuer vs Trust Platform, Passport vs Issuer Progress, Skill vs Framework, Diploma vs Verified Competence) · **Source of Truth** (document gouvernant, version, section, statut, lien public) · **Example** · **Non-Example** · **FAQ** · **Machine-Readable Summary** (visible) · **Citation** · **Status** · **Version History** · **LLM Context Summary** (« Key context »). Chaque bloc alimente compréhension humaine + SEO + GEO et émet le JSON-LD correspondant (§15). Les blocs nécessaires aux 20–30 pages GEO sont **V1** ; les variantes liées aux entités reportées suivent leur périmètre.

## 15. Modèle de données structurées (JSON-LD)

Schema.org appliqué **uniquement quand pertinent**, jamais fabriqué : `Organization` (Opus X, cohérent partout), `WebSite`, `WebPage`, `Article`/`TechArticle`/`ScholarlyArticle` (research — V1.1), `DefinedTerm` + `DefinedTermSet` (glossaire — cœur GEO V1), `FAQPage`, `HowTo` (pages réellement procédurales), `BreadcrumbList`, `Person` (auteurs research — V1.1), `Dataset` (si vrai dataset), `SoftwareApplication` (plateforme, si pertinent), `Course` (**seulement** vraies formations d'Issuers, **jamais** Opus X). La fiche framework expose **`framework_id: wtf`** et **`public_slug: world-trader`** (WEB-D2). **Entity Consistency Score** interne : un concept = **une** définition canonique réutilisée partout.

## 16. Stratégie de recherche

**V1 = recherche simple et robuste** (brief §18) : index statique pré-généré au build **ou** PostgreSQL (`tsvector`/trigram) si Supabase est déjà mobilisé — couvrant docs, glossaire, FAQ, pages GEO, use cases/compare phares. Champs : titre, résumé, corps, synonymes contrôlés, codes canoniques, relations, langue, type, statut, version. Résultats **typés**. **Recherche structurée avancée = V1.1.** Aucun service lourd (Algolia/Elastic) en V1.

## 17. Stratégie d'analytics

**Privacy-first, via abstraction** — aucune décision fournisseur maintenant. Interface `Analytics` (`track(event, props)`) avec adaptateur remplaçable (no-op par défaut). Mesures V1 : vues/page, langues, entrées organiques, recherche interne, pages sans résultat, clics Establish / Issuer Apply / Developers, consultation de définitions. **KPI GEO approfondis = V1.1** (AI Citation Rate, Entity Consistency Score outillé, backlinks…). **Aucune** prétention à mesurer ce qu'un LLM « a appris ». **Activation conditionnée à SEC-02** (WEB-D4).

## 18. Stratégie de sécurité

Préserver **intégralement** la posture auditée : RLS **deny-by-default** ; **aucune** `service_role` côté client ; aucun secret exposé ; **whitelist explicite** des champs publics, jamais de spread DB→réponse ; Passport **privé par défaut** + réponses **non-énumérantes** ; consentements séparés (ne pas mélanger les consentements légaux Sprint 1 avec de futurs consentements Issuer) ; staging **strictement isolé** ; tests refusant la prod (garde existante conservée) ; CSP + headers de sécurité adaptés au site public ; validation de toutes les entrées ; protection des formulaires (anti-spam, rate limiting) ; journaux sans données sensibles. **SEC-02 = condition d'entrée (WEB-D4)** avant toute variable partagée, service externe, formulaire, analytics ou déploiement. Le site **n'hérite d'aucun** secret staging exposé tant que la rotation n'est pas confirmée.

## 19. Plan de tests

**Unitaires** (Vitest) : génération metadata, résolution de locale, URLs canoniques, mapping de traductions (`canonicalId`), **absence de génération d'une route localisée sans traduction (§10.2)**, validation des types de contenu, génération JSON-LD, blocs LLM, versioning. **Intégration** (harnais staging existant, garde anti-prod réutilisée) : rendu de chaque type de page V1, **404 honnête sur locale manquante**, recherche, sitemaps (**alternates réels uniquement**), robots, redirects, pages de documents, statut public/restricted, **protection des routes app préservée**, **migration `/p/{handle}` : 404 non-énumérant + confidentialité intacts**, **non-régression `<html lang="fr">` + 3 polices côté app (§10.1)**. **E2E** : navigation, changement de langue, proposition explicite de l'anglais si traduction absente, recherche, consultation document/définition, CTA Establish/Issuer/Developers, mobile. **Éditoriaux automatiques** : titres/descriptions dupliqués, liens cassés, pages orphelines, alt manquants, documents sans version, contenu public sans auteur/organisation, chaînes interdites, **divergence terminologique**, canoniques incorrectes, incohérence de locales. **Vocabulaire verrouillé** : étendre `passport.strings.test.ts` sans casser les chaînes validées.

## 20. Plan de staging

Workflow obligatoire : **Development → Staging → QA → Validation humaine → Production**. Preview deployments Vercel, variables séparées, Supabase staging isolé, garde anti-prod, migrations versionnées, rollback documenté, smoke tests, validation metadata/`hreflang`/sitemaps/robots/redirects/404, Core Web Vitals, mobile, accessibilité, **`npm run build` obligatoire vert**. Aucun lot suivant sans conditions de sortie vertes. **SEC-02** validé avant tout déploiement partagé.

## 21. Découpage en sprints & lots

Sprints **scopés au périmètre V1-obligatoire (§6.1)** ; les items reportés sont explicitement marqués V1.1. Un seul changement de séquence vs brief §26 : **WEB-001 est en cours** (001A ✅, 001B ce document, 001C validation) et la **migration `/p/{handle}` + refactor `<html lang>` deviennent les tout premiers lots de code**, car ils débloquent `[locale]` en préservant des invariants prouvés.

- **WEB-001** — Audit, décisions, conception (001A/001B/001C). *En cours.*
- **WEB-002** — Fondations. **002.0** migration `/p/{handle}` · **002.0-bis** root layouts par branche + polices partagées + `setRequestLocale` (§10.1) · `[locale]` + `next-intl` + middleware composé · composition éditoriale (design) · header/footer/nav · metadata foundation (`metadataBase`, hreflang, sitemap, robots) · racine 307 (§10.3) · staging · tests de base.
- **WEB-003** — Pages institutionnelles V1 (Home, Passport, WSP, Professionals, Issuers, Organizations, Developers, About, Contact).
- **WEB-004** — Documentation publique MDX (familles au périmètre validé, versions, PDF existants, navigation, recherche documentaire, source-of-truth blocks).
- **WEB-005** — Knowledge Center V1 (glossaire initial, FAQ initiale, use cases/compare **phares**, recherche simple). *Registre Frameworks & Skills Library = V1.1.*
- **WEB-006** — GEO Content Foundation (20–30 pages de définition/questions, données structurées, blocs LLM, `llms.txt`, fiche `world-trader` [V1?]).
- **WEB-007** — Multilingue complet (en/fr/es, QA linguistique, hreflang & sitemap **sur traductions réelles**, fallback strict).
- **WEB-008** — *(V1.1)* Research, Blog, Author authority, RSS.
- **WEB-009** — SEO/GEO QA (crawl, liens, indexabilité, performance, accessibilité, données structurées, duplicate, orphelines).
- **WEB-010** — *(post-SEC-02)* Analytics & conversion V1 (instrumentation, funnels).
- **WEB-011** — Production (smoke tests, domaine `opusx.world`, DNS, redirections, lancement, monitoring, rollback).

## 22. Definition of Done — V1

Évaluée **sur le périmètre V1-obligatoire (§6.1)**, reprend les 34 critères du brief §27. Conditions de sortie : site sur **staging** ; routes V1 existantes ; **en/fr/es** fonctionnels avec **fallback strict** (aucune page anglaise sous `/fr`·`/es`) ; pages **SSR/pré-rendues** ; `<html lang>` correct par branche **sans casser le rendu statique** ; design conforme à **PRODUCT-001** (composition éditoriale, discipline de l'or) ; **aucune** route/invariant app cassé ; pages institutionnelles publiées ; Passport, WSP et rôles Professional/Issuer/Opus X clairement expliqués et séparés ; Knowledge Center V1, docs HTML + PDF, glossaire, FAQ, recherche simple **fonctionnels** ; **20–30 pages GEO** publiques ; JSON-LD / `hreflang` / sitemaps / canoniques / robots **valides** ; performances et accessibilité **auditées** ; **aucun** lien critique cassé, **aucun** document privé/secret exposé ; analytics essentiels installés (post-SEC-02) ; **tests verts** ; **`npm run build` sans erreur** ; smoke staging validé ; **production = promotion** d'une version validée ; humain + moteur + agent IA comprennent les entités centrales **sans** application cliente. Les périmètres reportés **ne créent aucune page vide**.

## 23. Décisions humaines encore nécessaires

1. **Périmètre « À arbitrer » de la V1 (§6.1)** — confirmer l'entrée en V1 de la fiche canonique World Trader Framework, de la page Evidence, de l'entrée Verify et de quelques Use Cases/Compare phares (portés en pages GEO statiques), le *registre* dynamique restant V1.1.
2. **Affectation document par document du corpus** aux niveaux PUBLIC / PUBLIC SUMMARY ONLY / INTERNAL pour `docs/[family]` (la grille 4 niveaux est verrouillée ; l'affectation par document reste à rendre avant WEB-004).
3. **Textes juridiques** (privacy/terms/legal) — rédaction/validation **humaine** ; sinon pages `noindex` non publiées (WEB-D3).
4. **Contact** — cible réelle de l'abstraction (email, CRM, backend) avant l'ouverture du formulaire (post-SEC-02).
5. **SEC-02** — confirmer la rotation avant tout câblage partagé / déploiement (WEB-D4).
6. **Profil public Commando OS** — confirmer la fiche « Certified Issuer / premier démonstrateur » (formulation + consentement partenaire) avant publication.

*(La stratégie racine `/`, ouverte en v0.1, est désormais tranchée — WEB-D5, §10.3.)*

---

## Références

**Normatives (dépôt `docs/`)** — PRODUCT-001 (§4, §5.3 discipline de l'or & exception logo, §10 deux registres, §12.5/§14.5, §19.1 six notes, §19.2 le test, §21) ; ARCH-001 (§2.2 les deux devises, §7 propriété du Passport) ; ENG-001 ; ENG-002 ; SPRINT-002 ; opus-x-sprint-1 (chaînes verrouillées, §5.2/§4.3 URL réservée du Passport).
**Code audité** — `middleware.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/(marketing)/page.tsx`, `lib/constants/passport.strings.ts`, `lib/i18n/fr.ts`, `lib/supabase/public.ts`, `tests/integration/_harness.ts`.
**Standards** — RFC 8785 (JCS), Schema.org, Next.js Metadata API & App Router (root layouts, `generateStaticParams`, `setRequestLocale`), `next-intl`.

*WEB-001B — Site public Opus X — Version 0.2 (Draft). Aucun document normatif n'a été modifié pour écrire ce profil d'implémentation. Aucune ligne de code avant validation humaine (WEB-001C).*
