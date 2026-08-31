# Opus X — Dossier de Conception Produit
## Sprint 1 · Phase Product · « Émission de l'identité professionnelle & du Professional Passport »

> **RÉVISION FIGÉE — Spécification officielle du Sprint 1.** ✅ Tous les arbitrages sont tranchés (voir §7).
> Cette révision intègre les décisions fondatrices validées. Elles ne concernent pas que le Sprint 1 : elles deviennent des **références permanentes** pour toute la plateforme Opus X.
>
> **Statut :** figée, prête pour transmission à Claude Code. La **phase de réalisation d'Opus X est officiellement ouverte**. Aucun code de production ici ; les schémas SQL, triggers et contrats d'API sont des *spécifications d'implémentation*.

---

## Décisions verrouillées (Révision Finale — Figée)

Ces décisions priment sur tout le reste du dossier. En cas de doute d'implémentation, on tranche en leur faveur.

1. **Le Passport n'est pas créé, il est ÉMIS.** On abandonne tout vocabulaire « création de compte / création de Passport ». Le Passport est un **actif officiel émis par Opus X**. L'émission est **forgée progressivement** sous les yeux de l'utilisateur — jamais un objet qui apparaît brutalement.
2. **Dashboard V1 encore plus minimaliste.** Uniquement : **Professional Passport** (élément principal), **Trust Status**, **Skills Status**, **Evidence Status**. **Les Frameworks sont reportés** à un sprint ultérieur. Le premier Dashboard doit *respirer* : calme, confiance, maîtrise.
3. **Le Passport a un cycle de vie visible.** Il n'est jamais statique : il raconte une progression (une timeline / un statut évolutif intégré). La logique du cycle de vie fait partie du produit **dès maintenant**, même si les étapes ne sont pas encore actives techniquement. Le Passport est un **objet vivant** qui évolue toute la carrière.
4. **Le Passport est un OBJET, pas une card SaaS.** *(décision la plus importante)* Il évoque un **passeport officiel / un diplôme premium / un certificat de confiance / un document institutionnel** — une valeur propre, immédiate. Le Dashboard, à l'inverse, reste un **outil d'administration sobre**. Cette séparation de langage visuel est maintenue **partout** dans la plateforme.
5. **Le premier message du Passport raconte la vision.** Juste après l'émission, une phrase explique *pourquoi* cet objet existe et qu'il accompagnera toute la carrière. Ligne canonique : *« From this moment on, every verified achievement you earn can become part of your professional identity. »*
6. **Résister à l'ajout de fonctionnalités.** Le Sprint 1 a **un seul objectif** : établir une identité professionnelle numérique, émettre un Professional Passport, afficher un Dashboard minimaliste. Tout le reste attend (pas de Marketplace, Billing, Developer Console, Organizations, features avancées). Cap produit : le **« ChatGPT Moment » d'Opus X** — en < 2 min, comprendre la valeur, vivre un moment émotionnel fort, repartir convaincu d'avoir obtenu un actif professionnel à vie.

### ⭐ Principe fondateur — « L'émotion d'abord » (référence permanente Opus X)

Le Sprint 1 ne consiste pas à *permettre de créer un Passport* : il consiste à **créer un moment émotionnel**. L'utilisateur doit sentir qu'il vient de **recevoir un actif professionnel qui l'accompagnera toute sa carrière** — le même effet que le « ChatGPT Moment » ou l'ouverture d'un premier compte Stripe. En moins de deux minutes, il doit comprendre :

> *« Je ne viens pas d'ouvrir un compte. Je viens d'établir mon identité professionnelle numérique. »*

**Cette émotion guide toutes les décisions UX de ce sprint** et devient un critère de conception pour toute la plateforme.

### Lexique verrouillé (à respecter dans toute l'UX et la copie)

| ✅ On dit | ❌ On ne dit jamais |
|---|---|
| **Émettre / émis** un Passport ; « Passport émis » | « créer un Passport », « créer un compte » |
| **Établir / forger** son identité professionnelle | « s'inscrire », « créer un profil » |
| **Générer** l'Opus ID | — |
| Un **actif officiel**, un **objet** | « une card », « une fiche », « un dashboard item » |
| **Trust Status / Skills Status / Evidence Status** | « Trust Index / Skills Index » *(termes internes uniquement)* |

> **Règle de localisation (verrouillée — Décision 1).** Le Passport est un **document universel**, indépendant de la langue de l'interface.
> - **En anglais (voix institutionnelle, intemporelle) :** tout ce qui relève de l'**objet Passport** — séquence d'émission, phrase de vision, libellés des statuts (*Trust Status*, *Skills Status*, *Evidence Status*), étapes du cycle de vie (*Identity Established*, etc.), Opus ID, futurs certificats. Ces chaînes sont **identiques quelle que soit la langue de l'utilisateur**.
> - **Localisé (langue de l'utilisateur) :** toute l'**interface fonctionnelle** — navigation, boutons, aide, paramètres, messages système, libellés de formulaire.
> - **Cas frontière — l'écran d'entrée :** le **titre** *« Establish Your Professional Identity »* reste en anglais (headline narratif de l'identité) ; les champs, le CTA et l'aide autour sont localisés.

---

## Sommaire

0. Contexte, périmètre & principes directeurs
1. **PRODUCT SPEC** — l'expérience & le cycle de vie du Passport
2. **UX / UI SPEC** — les écrans & le langage d'objet
3. **ENGINEERING SPEC** — l'implémentation
4. **API SPEC** — les endpoints du Sprint 1
5. **Recommandations produit** — les 6 décisions techniques à verrouiller
6. Definition of Done
7. Journal de décision (arbitrages actés)

---

## 0. Contexte, périmètre & principes directeurs

### 0.1 Rappel de la vision (modèle mental)

Opus X est une **couche d'infrastructure pour l'identité professionnelle**. Son artefact central est le **Professional Passport** : un **actif officiel émis par Opus X**, **détenu par le professionnel**, **hébergé par Opus X**, **privé par défaut**, qui accumule au fil du temps des **Evidence** (preuves de compétence) et qui **évolue** le long d'un cycle de vie visible (§1.6).

L'analogie juste : **le « Stripe » de l'identité professionnelle** — une couche neutre et fiable sur laquelle des plateformes partenaires viennent se brancher pour **alimenter** le Passport via API. Opus X ne produit pas la formation ; il **émet, certifie, agrège et rend portable** la valeur professionnelle.

Trois piliers permanents : **Propriété** (le Passport appartient au professionnel), **Neutralité** (infrastructure, jamais un organisme de formation), **Confiance** (chaque choix produit protège la confiance accordée au Passport).

### 0.2 Périmètre du Sprint 1

**Le Sprint 1 = trois temps forts (le « ChatGPT Moment ») :**

1. **Établir** son identité professionnelle.
2. **Émettre** le Professional Passport (moment émotionnel).
3. **Découvrir** un Dashboard minimaliste qui respire.

Les écrans d'auth/vérification sont du **tissu conjonctif** : nécessaires, mais réduits au strict minimum pour ne jamais diluer les trois temps forts.

**Dans le périmètre :**
- Établissement de l'identité Opus X.
- **Émission automatique** du Professional Passport (aucune configuration).
- **Cycle de vie** du Passport présent dans le produit (même inactif techniquement).
- Dashboard V1 à **4 modules** : Passport, Trust Status, Skills Status, Evidence Status.
- Passport **vide, privé, prêt** à recevoir ses premières Evidence.

**Hors périmètre (explicitement plus tard) :**
- **Frameworks** (reportés — Décision 2).
- Ingestion d'Evidence par les partenaires (APIs partenaires).
- Marketplace, Billing, Developer Console, Organizations, administration, features avancées (Décision 6).
- Partage public *opérationnel* du Passport (on conçoit le modèle & l'URL, on ne construit pas le flux).

### 0.3 Hypothèses techniques que je prends (à valider)

- **Front :** Next.js (App Router) + React + TypeScript + Tailwind. (SSR pour la future page publique, SPA pour le Dashboard, bonne compatibilité Claude Code.)
- **Back :** Supabase (Auth + Postgres + RLS + Edge Functions) — contrainte du brief.
- **Domaines actifs :** `opusx.com` (landing), `app.opusx.com` (Dashboard), `passport.opusx.com` (Passports publics — préparé, non ouvert).
- **Sous-domaines réservés** (non développés en Sprint 1, mais architecture à préserver dès maintenant) : `api.opusx.com`, `docs.opusx.com`, `developers.opusx.com`, `verify.opusx.com`. *(`verify.` hébergera la future vérification publique d'un Passport ; l'URL canonique de vérification pourra y migrer — voir §5.2.)*
- **i18n :** voir la **Règle de localisation** (préambule) — Passport en anglais (voix institutionnelle), UI localisée.

### 0.4 Principes directeurs — l'ADN Opus X

Inspiration **philosophique** de Stripe (retenue, clarté, premium, confiance, fluidité), déclinée en lois locales :

1. **Retenue.** Un écran = une idée, un CTA principal. On enlève avant d'ajouter. *(Décision 6.)*
2. **Clarté > style.** Chaque mot est une décision ; zéro jargon non expliqué ; **lexique d'émission respecté**. *(Décision 1.)*
3. **Rapidité perçue.** Aucune attente nue : les temps de calcul deviennent la **cérémonie d'émission**, jamais un spinner. *(Décision 1.)*
4. **LOI D'OBJET.** Le **Passport est un objet** (registre solennel : passeport / diplôme / certificat institutionnel). Le **Dashboard est un outil** (registre fonctionnel, sobre). **Ces deux registres ne se ressemblent jamais**, dans tout Opus X. *(Décision 4 — la plus importante.)*
5. **Vivant, pas statique.** Le Passport **raconte une progression** via son cycle de vie. *(Décision 3.)*
6. **Cap « ChatGPT Moment ».** Une expérience exceptionnelle sur l'essentiel plutôt qu'une plateforme riche mais oubliable. *(Décision 6.)*

---

## 1. PRODUCT SPEC

### 1.1 Qui est l'utilisateur ?

**Persona primaire — « Le professionnel en construction ».** Une personne qui accumule de la valeur professionnelle (compétences, réalisations, certifications, missions) mais dont les preuves sont aujourd'hui **dispersées, non vérifiables et captives** de plateformes tierces. Elle veut un lieu **qu'elle possède**, portable et crédible.

Trois profils concrets (pour les tests, pas une segmentation Sprint 1) : la **consultante / freelance** (sa réputation est son actif), le **professionnel en évolution** (il capitalise ce qu'il a prouvé, indépendamment d'un employeur), l'**apprenant certifié** (sa preuve doit lui appartenir, pas vivre dans le LMS du partenaire).

**Persona secondaire (non ciblé en Sprint 1) :** la **plateforme partenaire** qui alimentera le Passport. Pas d'écran en Sprint 1, mais l'architecture l'anticipe.

### 1.2 Pourquoi vient-il ?

**Job-to-be-done :** *« Donne-moi un endroit qui m'appartient où ma valeur professionnelle est prouvée, centralisée et portable — pour toute ma carrière. »*

Douleurs résolues : **dispersion** (preuves éparpillées), **captivité** (la valeur enrichit la plateforme, pas la personne), **non-vérifiabilité** (un CV se déclare, il ne se prouve pas), **impermanence** (quitter une plateforme = perdre ses preuves).

Promesse utilisateur : **« Ce que tu prouves t'appartient, pour toujours, et te suit partout. »**

### 1.3 Première impression

Pas « installe une app », pas « crée un compte ». Mais :

> **« Aujourd'hui, une véritable identité professionnelle vient d'être forgée pour moi, et elle m'accompagnera toute ma vie. »**

Trois sensations simultanées : **gravité / signification** (un acte fondateur), **simplicité désarmante** (malgré la gravité, c'est extraordinairement facile), **confiance immédiate** (sérieux, sécurisé, durable). Tension centrale du Sprint : **un acte solennel rendu totalement fluide.**

### 1.4 Le parcours des deux premières minutes (le « ChatGPT Moment »)

| Temps | Durée cible | Ce qui se passe | Intention |
|---|---|---|---|
| **0:00 – 0:15** Landing | ~15 s | Comprend Opus X en une phrase. Un CTA unique : *Établir mon identité professionnelle*. | Désir + confiance en < 15 s. |
| **0:15 – 0:45** Établir l'identité | ~30 s | Saisit le strict minimum (nom, email). Vocabulaire d'**établissement**, jamais de « compte ». | Acte fondateur sans friction. |
| **0:45 – 1:00** Auth | ~15 s | Choisit une méthode (magic link recommandé). Tissu conjonctif, minimal. | Sécuriser sans alourdir. |
| **1:00 – 1:20** Vérification email *(si nécessaire)* | ~20 s | Confirme son email. Attente **active**, jamais un cul-de-sac. | Contrainte de sécurité → gage de sérieux. |
| **1:20 – 1:45** **Émission du Passport** *(le pic)* | ~25 s | **Séquence de forge :** *Establishing… → Generating Opus ID… → Issuing… → Identity Successfully Established.* Puis la **phrase de vision**. | **Le moment "wow".** Un actif officiel vient d'être émis. |
| **1:45 – 2:00** Dashboard | ~15 s | Découvre un Dashboard qui **respire** : le Passport (avec son cycle de vie), Trust / Skills / Evidence Status. | Calme, confiance, maîtrise, potentiel. |

**Règle produit :** entre le premier clic et la **possession** du Passport, **zéro configuration**, **zéro décision non essentielle**.

### 1.5 L'arc émotionnel (écran par écran)

| Écran | Émotion visée | Anti-émotion |
|---|---|---|
| Landing | Curiosité + désir + « c'est pour moi » | « Encore un SaaS » |
| Établir l'identité | Signification + facilité | « Formulaire d'inscription » |
| Auth | Sécurité + fluidité | Friction, méfiance |
| Vérification email | Sérieux rassurant | Abandon, cul-de-sac |
| **Émission du Passport** | **Fierté + émerveillement + propriété** | Anticlimax, banalité, « ça apparaît » |
| Dashboard | Calme + maîtrise + potentiel | « Écran vide décevant », surcharge |

### 1.6 Le cycle de vie du Passport *(Décision 3 — nouveau, structurant)*

Le Passport n'est **jamais statique** : il porte, en lui, une **timeline de progression** qui raconte une carrière. Cette logique est intégrée au produit **dès le Sprint 1**, même si seules les premières étapes sont techniquement atteignables.

**Les 7 étapes canoniques du cycle de vie :**

| # | Étape (label) | État interne | Sens |
|---|---|---|---|
| 1 | **Identity Established** ¹ | `identity_established` | Le Passport vient d'être émis. **← état du Sprint 1.** |
| 2 | **Receiving Evidence** | `receiving_evidence` | Les premières preuves arrivent (via partenaires). |
| 3 | **Skills Emerging** | `skills_emerging` | Des compétences prouvées se dessinent. |
| 4 | **Trust Established** | `trust_established` | Un seuil de confiance est atteint. |
| 5 | **Professional Passport Verified** | `passport_verified` | Le Passport est vérifié. |
| 6 | **Trusted Professional** | `trusted_professional` | Statut de professionnel de confiance. |
| 7 | **Authority** | `authority` | Référence dans son domaine. |

> ¹ **Terminologie officielle (actée).** La 1ʳᵉ étape est **« Identity Established »** (et non « Identity Created ») : le Passport n'est pas créé, il est établi puis émis. Le vocabulaire « Create » est abandonné définitivement dans tout Opus X. Les 6 étapes suivantes sont conservées telles quelles.

**Traitement produit en Sprint 1 :**
- Le Passport affiche **où il en est** (étape 1) **et ce qui vient** (les étapes futures, visibles mais « à venir »).
- Les étapes futures sont **présentées comme une trajectoire désirable**, pas comme des cases vides. Elles donnent au Passport son caractère d'**objet vivant** et projettent l'utilisateur dans une carrière.
- Techniquement : un champ `lifecycle_stage` sur le Passport (§3), figé à l'étape 1 en Sprint 1, mais le **modèle des 7 étapes est posé** pour toute la suite.

### 1.7 Ingénierie du moment « wow » : l'ÉMISSION *(Décisions 1 & 5)*

Le pic émotionnel est une **émission forgée**, pas un écran qui apparaît. Ingrédients :

1. **La séquence de forge, progressive et lisible** (chaque ligne se joue puis se valide) :
   - `Establishing Professional Identity…`
   - `Generating Opus ID…`
   - `Issuing Professional Passport…`
   - `Identity Successfully Established`
2. **L'attribution de l'Opus ID comme instant clé.** L'ID se **grave** en monospace, en dernier — la signature unique et permanente.
3. **La matérialité de l'objet.** Le Passport se **forge** avec matière, profondeur, sceau — registre « credential officiel » (Décision 4, §2.2).
4. **Le temps de calcul habité.** La création serveur (profil + passport + baseline) se déroule **pendant** la forge : le calcul *est* le spectacle. Si le calcul dépasse l'animation, la forge « tient » élégamment jusqu'à résolution.
5. **La phrase de vision** *(Décision 5)*, juste après l'émission :
   > *« From this moment on, every verified achievement you earn can become part of your professional identity. »*
6. **Un seul CTA** après la vision : *Découvrir mon Passport* → Dashboard.

**Contrainte anti-kitsch :** sobriété premium absolue. Pas de confettis ni de sons stridents. La solennité naît de la **retenue** et de la **progression**.

### 1.8 Objectif de chaque écran (synthèse)

- **Landing** — convertir la curiosité en désir d'établir son identité. *KPI : taux de clic CTA.*
- **Établir l'identité** — capturer le minimum vital sans casser la solennité. *KPI : taux de complétion.*
- **Auth** — authentifier sûrement et fluidement. *KPI : taux de réussite, temps d'auth.*
- **Vérification email** — confirmer sans perdre l'utilisateur. *KPI : taux de vérification, abandon.*
- **Émission du Passport** — délivrer le « wow » + le sentiment de propriété. *KPI : progression sans drop.*
- **Dashboard** — clarté + calme + potentiel à partir d'un état vide. *KPI : activation.*

### 1.9 Indicateurs de succès du Sprint 1

- **Activation** : % Landing → *Passport possédé* → Dashboard. **Cible : ≥ 70 %** une fois le CTA cliqué.
- **Time-to-Passport** : médiane premier clic → Passport émis. **Cible : < 90 s.**
- **Zéro configuration** avant possession (binaire).
- **Résonance émotionnelle** (proxy qualitatif) : l'utilisateur formule spontanément une idée de *propriété / permanence* (« c'est à moi », « pour la vie »).

### 1.10 Anti-objectifs *(renforcés — Décision 6)*

- Ne jamais donner l'impression d'une **inscription à un compte**.
- Ne jamais faire **apparaître** le Passport brutalement (il est **forgé**).
- Ne jamais transformer le Dashboard en **plateforme de formation** ni en **catalogue de features**.
- Ne rien demander à **configurer** pour exister.
- Ne jamais afficher un **état vide décourageant** (le vide est *« prêt »*, jamais *« raté »*).
- Ne jamais confondre le registre **Passport (objet)** et **Dashboard (outil)**.
- **Ne rien ajouter** qui ne serve pas directement l'émission et la découverte du Passport. En cas de doute : **ça attend un prochain sprint.**

---

## 2. UX / UI SPEC

### 2.1 Fondations du design system — deux langages, une plateforme

> Direction à valider. ADN Stripe (retenue, clarté, premium) + identité propre axée **confiance & permanence**. Concept directeur : **« Gravité & Clarté »**.

**La règle qui prime sur tout le reste : deux langages visuels séparés** *(Décision 4)*.

- **Langage OBJET (le Passport).** Registre solennel, institutionnel. Il évoque un **passeport officiel / diplôme premium / certificat de confiance**. Matière, profondeur, sceau, guilloché discret, Opus ID gravé en monospace, display serif pour les intitulés, composition **centrée** et posée. Il **possède une valeur propre**.
- **Langage OUTIL (le Dashboard).** Registre fonctionnel, sobre, aéré. Sans-serif humaniste, grille claire, densité maîtrisée. C'est un **poste de pilotage**, pas un objet à admirer.

**Tokens communs :**
- *Couleur* — fond « papier » clair et chaud (off-white) ; « ink » profond (bleu-nuit / indigo) ; **une seule** couleur d'accent signature (bleu Opus) réservée au CTA principal et aux moments de confiance ; sémantiques désaturées (vert vérifié, ambre en cours, rouge erreur).
- *Typo* — sans-serif humaniste (UI) + display raffiné (identité/cérémonie) + **monospace pour l'Opus ID**.
- *Espacement* — grille 8 pt ; densité faible en onboarding (respiration = premium), modérée au Dashboard.
- *Motion* — ease-out doux ; 150–250 ms pour l'UI ; **la séquence d'émission** se joue sur ~2–3 s, ligne par ligne.

### 2.2 Passport (objet) vs Dashboard (outil) — table de référence *(Décision 4)*

| Dimension | **Professional Passport** | **Dashboard** |
|---|---|---|
| Nature | Un **objet officiel** que l'on possède | Un **outil** d'administration |
| Métaphore | Passeport / diplôme / certificat institutionnel | Poste de pilotage d'infrastructure |
| Registre | Solennel, matière, sceau, serif, centré | Sobre, épuré, sans-serif, grille |
| Domaine | `passport.opusx.com/{handle}` | `app.opusx.com` |
| Rendu | SSR (indexable, partageable — futur) | SPA authentifiée |
| Émotion | Fierté, crédibilité, valeur propre | Calme, clarté, maîtrise |

---

### Écran 1 — Landing Page

**Objectifs.** Comprendre Opus X en une phrase, susciter le désir d'**établir** son identité, installer la confiance. Un seul CTA.

**Composants.** Logo discret + lien *Se connecter* (utilisateurs existants) ; **Hero** (titre-promesse fort, ex. *« Votre identité professionnelle. Prouvée. À vous. »* + sous-phrase = le job-to-be-done) ; **CTA unique** *Établir mon identité professionnelle* ; **2–3 signaux de confiance** (propriété, permanence, sécurité) en une ligne chacun ; une **représentation de l'objet Passport** (pour le désirer) ; footer sobre.

**Hiérarchie.** Titre > CTA > objet Passport > signaux de confiance > reste. Une seule action dominante.

**CTA.** Primaire : *Établir mon identité professionnelle* → écran 2. Secondaire (discret) : *Se connecter*.

**Interactions.** Hover subtil sur le CTA ; l'objet Passport réagit légèrement au pointeur/scroll (matière).

**Chargement / erreurs.** SSR quasi instantané. Si l'auth backend est indisponible : bandeau discret *« Service momentanément indisponible »*, la page tient.

**Transitions.** Transition « avancée » vers l'écran 2 (on entre dans un parcours fondateur).

---

### Écran 2 — Establish Your Professional Identity

**Objectifs.** Capturer le minimum vital, **sans** ressembler à une inscription, en préservant la solennité.

**Composants.** Titre (**EN, voix institutionnelle**) : *« Establish Your Professional Identity »* ; sous-titre localisé si besoin ; **champs minimaux** (localisés) : Nom complet, Email ; micro-copie (localisée) : *« Privé par défaut. Vous seul décidez de ce qui est partagé. »* ; **consentements explicites** (cases non pré-cochées : Conditions + Confidentialité — §5.4) ; CTA (localisé) *Continuer* ; lien discret *Vous avez déjà une identité Opus X ? Se connecter.*

**Hiérarchie.** Titre > champs > CTA. Colonne étroite, centrée, beaucoup d'air, zéro distraction.

**CTA.** *Continuer* → Auth. Désactivé tant que champs requis + consentements invalides.

**Interactions.** Validation **inline en temps réel** (douce), focus auto sur le 1ᵉʳ champ, Entrée = soumission.

**Chargement.** CTA en état *loading* (le label devient indicateur), sans bloquer l'écran.

**Erreurs.** *Email déjà utilisé* → *« Cette identité existe déjà. Se connecter ? »* ; *Email invalide* → inline ; *Erreur réseau* → bandeau + réessai sans perte de saisie.

**Transitions.** Vers l'Auth ; le prénom saisi est conservé (*« Bonjour {Prénom} »*).

---

### Écran 3 — Authentication

**Objectifs.** Authentifier sûrement et fluidement. **Magic link par défaut** (pas de mot de passe à créer sur un moment fondateur) ; mot de passe en option.

**Composants.** Titre *« Sécurisons votre identité. »* ; méthode primaire **Lien magique** (*« Un lien de connexion sécurisé »* + CTA *Recevoir mon lien*) ; méthode secondaire repliée *Utiliser un mot de passe* ; réassurance sécurité (chiffrement, aucune revente de données). *(OAuth Google/LinkedIn : hors Sprint 1, emplacement prévu.)*

**Hiérarchie.** Méthode primaire dominante, alternative discrète.

**CTA.** *Recevoir mon lien* ou *Se connecter*.

**Interactions.** Un choix de méthode à la fois ; magic link → bascule vers l'écran 4.

**Chargement / erreurs.** CTA *loading* à l'envoi + confirmation ; *envoi impossible* → réessai ; *mot de passe incorrect* → message inline sans révéler si l'email existe ; *trop de tentatives* → temporisation claire.

**Transitions.** Vers vérification (écran 4) si nécessaire, sinon directement vers l'émission (écran 5).

---

### Écran 4 — Email Verification (si nécessaire)

**Objectifs.** Confirmer l'email **sans perdre l'utilisateur** ; contrainte → gage de sérieux, jamais un cul-de-sac.

**Composants.** *« Vérifiez votre boîte mail »* (icône sobre, email rappelé, instruction claire) ; actions *Renvoyer le lien* (compte à rebours anti-spam), *Modifier l'email* ; micro-copie *« Cette étape protège votre identité. »* ; **flux à deux appareils** : si le lien est cliqué ailleurs, l'onglet d'origine détecte la vérification (realtime/polling) et **avance automatiquement**.

**CTA.** *Ouvrir ma boîte mail* (deep-link si possible) ; *Renvoyer le lien*.

**Chargement.** Attente **active** (l'écran « écoute »), aucun spinner nu ; vérifié → transition automatique vers l'écran 5.

**Erreurs.** *Lien expiré* → nouveau lien immédiat ; *déjà utilisé* → redirection vers l'état connecté ; *rien reçu* → aide (spams) + renvoi.

**Transitions.** Vérifié → **écran 5 (émission)**. C'est le seuil de la partie solennelle.

---

### Écran 5 — Émission du Professional Passport (le pic) *(Décisions 1, 4, 5)*

**Objectifs.** **Émettre** l'actif officiel via une **forge progressive**, attribuer/graver l'Opus ID, délivrer la **phrase de vision**, produire **propriété + permanence**. (Ingénierie émotionnelle : §1.7.)

**Composants.**
- **La séquence de forge** (jouée automatiquement, ligne par ligne) :
  1. `Establishing Professional Identity…`
  2. `Generating Opus ID…`
  3. `Issuing Professional Passport…`
  4. `Identity Successfully Established`
- **L'objet Passport** qui se **forge** (matière / profondeur / sceau — langage OBJET, §2.1). Jamais une card qui « pop ».
- L'**Opus ID gravé** en monospace + *« À vous, à vie. »*
- **La phrase de vision** *(Décision 5)* : *« From this moment on, every verified achievement you earn can become part of your professional identity. »*
- Une amorce discrète du **cycle de vie** : le Passport se pose à l'étape **Identity Established**, avec la trajectoire future suggérée.
- **Un seul CTA** (après la vision) : *Découvrir mon Passport* → Dashboard.

**Hiérarchie.** L'objet Passport au centre absolu ; tout le reste s'efface ; un seul CTA, révélé **après** le scellement.

**Interactions.** La forge se joue seule (aucune action requise). Le CTA n'apparaît qu'après *Identity Successfully Established* + phrase de vision, pour ne pas court-circuiter le moment.

**Chargement.** La création serveur se déroule **pendant** la forge (le calcul = le spectacle). Si le calcul dépasse l'animation, la forge tient jusqu'à résolution.

**Erreurs.** *Échec serveur* → moment à protéger absolument : message digne, non anxiogène, **retry automatique** en tâche de fond ; jamais de Passport « à moitié émis ». **Idempotence obligatoire** (§3.5) : un double-clic/retry n'émet jamais deux Passports.

**Transitions.** *Découvrir mon Passport* → transition douce vers le Dashboard. Le message de bienvenue peut être un léger sur-état du Dashboard (overlay) plutôt qu'un écran séparé, pour garder l'élan.

---

### Écran 6 — Dashboard (V1) *(Décision 2 — encore plus minimaliste)*

**Objectifs.** Donner **calme, confiance, maîtrise** à partir d'un Passport vide mais prêt. Le Dashboard doit **respirer**. Registre OUTIL, sobre.

**Composants — 4 modules, et rien de plus :**
1. **Professional Passport** *(élément principal, proéminent)* — l'aperçu de l'objet + son **cycle de vie visible** (étape courante *Identity Established*, trajectoire future suggérée) + rappel discret de l'Opus ID + accès *Voir mon Passport*.
2. **Trust Status** — état *« Establishing »* (qualitatif, §5.5).
3. **Skills Status** — vide : *« Vos compétences prouvées apparaîtront ici. »*
4. **Evidence Status** — compteur 0 + explication *« Vos partenaires pourront ajouter des preuves, en toute sécurité. »*

> **Frameworks : retirés du Dashboard V1** *(Décision 2)*. Reportés à un sprint ultérieur.

**Structure générale.**
- **Barre supérieure** : logo, nom, Opus ID (discret), menu compte (déconnexion, réglages minimaux).
- **En-tête d'accueil** : *« Bienvenue, {Prénom}. Voici votre Passport. »*
- **Zone principale** : la carte **Passport** en évidence (avec cycle de vie), puis **3 modules Status** disposés avec **beaucoup d'espace** (respiration = potentiel).
- **États zéro** partout : « prêt », jamais « raté ».

**Hiérarchie.** Passport (dominant) > Trust Status > Skills Status > Evidence Status. Volontairement **peu dense** : le vide crée la sensation de potentiel.

**CTA.** Très peu d'actions en V1 (les features n'existent pas). CTA utile : *Voir mon Passport*. Les modules vides sont **pédagogiques** (« voici ce qui arrivera »), jamais des boutons morts.

**Interactions.** Survol → légère élévation. Clic Passport → vue Passport privée. Modules non actifs présentés comme une **promesse**.

**Chargement / erreurs.** Skeletons sobres par module (pas de spinner global) ; données réelles (vides) via `/me/dashboard` (§4) ; erreur d'un module → état isolé (« réessayer ») sans casser le reste.

**Transitions.** Entrée depuis l'émission : apparition douce, registre OUTIL (moins solennel que le Passport).


---

## 3. ENGINEERING SPEC

> Implémentation **propre, idempotente, RLS-first**. Le SQL est une **spécification** à affiner. Note : en interne, la base « crée » des lignes ; l'important est que **toute l'expérience utilisateur parle d'émission** (Décision 1). Les termes techniques restent neutres.

### 3.1 Stack & architecture générale

- **Front :** Next.js (App Router), TypeScript, Tailwind ; route groups distincts (§3.9).
- **Back :** Supabase — Auth, Postgres, RLS, Edge Functions.
- **Principe :** la sécurité vit dans la **base** (RLS + triggers `security definer`), jamais seulement dans le client.
- **Séparation des surfaces :** app authentifiée (`app.`) vs page publique du Passport (`passport.`, SSR, isolée dès maintenant, non ouverte en Sprint 1).

### 3.2 Authentification (Supabase Auth)

- Sprint 1 : **magic link (OTP email)** par défaut + email/mot de passe en option ; **vérification email activée**.
- Sessions Supabase (JWT + refresh) via le SDK. OAuth : non en Sprint 1, mais rien ne l'empêche plus tard.

### 3.3 Modèle de données (tables)

**`profiles`** — le professionnel (1:1 avec `auth.users`).

| Colonne | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | = `auth.users.id` |
| `opus_id` | `text` UNIQUE NOT NULL | ID canonique permanent `opx_...` (§5.1) |
| `full_name` | `text` | saisi à l'établissement |
| `headline` | `text` NULL | intitulé pro (éditable au Dashboard) |
| `avatar_url` | `text` NULL | |
| `locale` | `text` DEFAULT `'fr'` | |
| `created_at` / `updated_at` | `timestamptz` | horodatage technique |

**`passports`** — le Passport (1:1 avec `profiles`, **émis automatiquement**).

| Colonne | Type | Notes |
|---|---|---|
| `id` | `uuid` PK DEFAULT `gen_random_uuid()` | |
| `profile_id` | `uuid` UNIQUE NOT NULL → `profiles(id)` | 1:1 |
| `handle` | `text` UNIQUE NOT NULL | slug d'URL publique (§5.2) |
| `visibility` | `text` DEFAULT `'private'` | CHECK IN (`private`,`unlisted`,`public`) |
| `lifecycle_stage` | `text` DEFAULT `'identity_established'` | **Cycle de vie (Décision 3).** CHECK IN les 7 étapes (§1.6). Figé à l'étape 1 en Sprint 1. |
| `status` | `text` DEFAULT `'active'` | statut technique (actif/suspendu…) |
| `issued_at` | `timestamptz` DEFAULT `now()` | **date d'émission** (product-facing) |
| `updated_at` | `timestamptz` | |

**`trust_index`** — métrique interne du **Trust Status** (1:1 passport).

| Colonne | Type | Notes |
|---|---|---|
| `passport_id` | `uuid` PK → `passports(id)` | |
| `score` | `numeric` NULL | **NULL** tant que non établi (§5.5) |
| `state` | `text` DEFAULT `'establishing'` | *établissement/emerging/established* → alimente le **Trust Status** UI |
| `computed_at` | `timestamptz` NULL | |

**`skills`** — entrées du **Skills Status** (vide en Sprint 1).
`id` PK, `passport_id` → passports, `name`, `level` NULL, `verified` bool DEFAULT false, `evidence_count` int DEFAULT 0, `framework_id` uuid NULL *(FK future)*, `created_at`.

**`evidence`** — les preuves (vide ; alimentée plus tard par les partenaires).
`id` PK, `passport_id` → passports, `source_partner_id` uuid NULL, `type`, `title`, `description` NULL, `status` DEFAULT `'pending'`, `verified` bool DEFAULT false, `issued_at` NULL, `payload` jsonb NULL, `created_at`.

**Tables *stub futur* (créées pour la cohérence du modèle, ni seedées ni surfacées en Sprint 1) :**
- **`frameworks`** — catalogue de référentiels *(reporté, Décision 2)* : `id`, `slug` UNIQUE, `name`, `description`, `publisher`, `created_at`.
- **`passport_frameworks`** — référentiels adoptés (n↔n) : `passport_id`, `framework_id`, `adopted_at`.
- **`partners`** — futurs émetteurs d'Evidence : `id`, `name`, `status`, `created_at`.

**`consents`** — journal de consentement (RGPD, §5.4).
`id` PK, `profile_id` → profiles, `type` (`terms`/`privacy`/`partner_ingestion`/`public_share`), `granted` bool, `version`, `granted_at`, `revoked_at` NULL, `ip`/`user_agent` NULL.

### 3.4 Relations

- `auth.users (1) ── (1) profiles` (id partagé) ── `(1) passports` ── `(1) trust_index`
- `passports (1) ── (n) skills`, `(1) ── (n) evidence`
- `passports (n) ── (n) frameworks` via `passport_frameworks` *(futur)*
- `profiles (1) ── (n) consents` ; `partners (1) ── (n) evidence` *(futur)*

### 3.5 Trigger : émission automatique du profil + du Passport

À l'arrivée d'un utilisateur authentifié/confirmé, un trigger `AFTER INSERT` appelle `handle_new_user()` (`security definer`) qui, **atomiquement et idempotemment** :

1. crée le `profiles` (génère l'`opus_id`) ;
2. **émet** le `passports` (génère un `handle` unique, `lifecycle_stage = 'identity_established'`, `issued_at = now()`) ;
3. initialise `trust_index` en baseline (`score = NULL`, `state = 'establishing'`) ;
4. journalise les consentements captés à l'établissement.

**Points clés :**
- **Idempotence** — tolérante aux ré-exécutions (`on conflict do nothing` / vérification préalable) : un retry n'émet **jamais** deux Passports. La forge de l'écran 5 s'appuie sur cette garantie.
- **`opus_id`** — `opx_` + ULID/UUIDv7 (§5.1).
- **`handle`** — `slugify(full_name)` + suffixe court aléatoire (anti-collision, anti-énumération), boucle de ré-essai sur collision.
- **Sécurité** — `security definer` + `search_path` fixé ; bypass RLS uniquement pour l'émission.
- **Déclenchement** — de préférence à la **confirmation** de l'email (pas de Passport pour une identité non vérifiée) ; à confirmer selon la config Supabase.

### 3.6 RLS — *deny by default*

RLS activé sur **toutes** les tables applicatives.
- **`profiles`** : `select`/`update` si `id = auth.uid()`. Pas d'`insert` client (émission via trigger).
- **`passports`** : `select`/`update` si `profile_id = auth.uid()`. *Politique publique préparée (inactive) :* `select` pour `anon` si `visibility = 'public'` (aucune ligne publique en Sprint 1).
- **`trust_index`, `skills`, `evidence`** : `select` propriétaire via appartenance du `passport_id` à `auth.uid()`. Pas d'`insert`/`update` client en Sprint 1 (réservé au `service_role` / futures Edge Functions partenaires).
- **`consents`** : `select`/`insert` propriétaire (`profile_id = auth.uid()`).
- **Stubs futurs** (`frameworks`, `passport_frameworks`, `partners`) : RLS activé, aucune policy client en Sprint 1.

### 3.7 Services

- **AuthService** — établissement d'identité, connexion (magic link / mot de passe), vérification, session, déconnexion.
- **IdentityService** — lecture/màj du `profiles` courant.
- **PassportService** — lecture du Passport (+ `lifecycle_stage`) ; *(préparé)* màj `handle`/`visibility` — désactivé en Sprint 1.
- **DashboardService** — agrégat `/me/dashboard` (Passport + cycle de vie + Trust/Skills/Evidence Status) en un appel.
- **ConsentService** — enregistrement/lecture des consentements.
- *(Futur)* **IngestionService / PartnerService / FrameworkService** — non implémentés.

### 3.8 Génération d'identifiants

- **`opus_id`** : `opx_` + ULID (26 car., base32 Crockford). Opaque, non énumérable, trié dans le temps, **permanent**. Voir §5.1.
- **`handle`** : `slug(nom)` + suffixe aléatoire ; modifiable plus tard (redirection 301). Voir §5.2.
- Les deux sont **découplés** : `opus_id` = identité canonique permanente ; `handle` = adresse publique lisible et changeable.

### 3.9 Architecture frontend (Next.js App Router)

Route groups pour séparer les registres :
- `(marketing)` → Landing (SSR public).
- `(auth)` → Établir l'identité, Authentication, Email Verification.
- `(ceremony)` → **Émission du Passport** (le pic).
- `(app)` → Dashboard + vue Passport privée (authentifié, `app.`).
- `(public-passport)` → gabarit page publique du Passport (SSR, `passport.`) — **présent, non ouvert** en Sprint 1.

Composants serveur par défaut ; auth via SDK Supabase + middleware protégeant `(app)` ; **deux thèmes de composants** distincts (**OBJET** pour le Passport / **OUTIL** pour le Dashboard — Décision 4) ; design tokens centralisés (§2.1).

### 3.10 Architecture backend

- **Postgres (Supabase)** : schéma §3.3, RLS §3.6, triggers §3.5.
- **Edge Functions** : réservées aux opérations nécessitant le `service_role`. En Sprint 1, minimal — potentiellement une fonction de **finalisation idempotente de l'émission** du Passport (garantie côté serveur pour l'écran 5). L'essentiel des lectures passe par PostgREST sous RLS.
- **Seeds** : **aucun seed Frameworks en Sprint 1** (module retiré, Décision 2).

### 3.11 Sécurité & conformité

RLS-first ; least privilege (jamais de `service_role` côté client) ; **idempotence de l'émission** (anti-doublon) ; RGPD (consentements journalisés, portabilité, effacement en cascade, minimisation nom+email) ; séparation public/privé (la page publique ne lira que des champs whitelistés — §5.3 — jamais l'email).

---

## 4. API SPEC (Sprint 1 uniquement)

> Contrat logique attendu par le front. Une partie est native Supabase (Auth, PostgREST sous RLS). On n'expose que le nécessaire au Sprint 1.

### 4.1 Authentication (Supabase Auth — natif)

| Méthode | Endpoint logique | Rôle |
|---|---|---|
| POST | `/auth/signup` | Établir l'identité (email + mdp **ou** déclenchement magic link) |
| POST | `/auth/magic-link` | Envoyer un lien de connexion (OTP email) |
| POST | `/auth/verify` | Vérifier l'email / consommer l'OTP |
| POST | `/auth/signin` | Connexion (mot de passe) |
| POST | `/auth/signout` | Déconnexion |
| GET | `/auth/session` | Session / utilisateur courant |

Erreurs standard : `400`, `401`, `409` (email déjà utilisé), `429`.

### 4.2 Identity / Profile

**`GET /me`** — profil courant. `200` :
```json
{ "id": "uuid", "opus_id": "opx_01J...", "full_name": "Marie Dubois",
  "headline": null, "avatar_url": null, "locale": "fr", "created_at": "..." }
```
**`PATCH /me`** — màj `full_name`, `headline`, `avatar_url`, `locale`. `200` / `401` / `400`.

### 4.3 Passport

**`GET /me/passport`** — le Passport courant. `200` :
```json
{ "id": "uuid", "opus_id": "opx_01J...", "handle": "marie-dubois-k3n7",
  "visibility": "private", "lifecycle_stage": "identity_established",
  "issued_at": "...", "status": "active" }
```
**`PATCH /me/passport`** — *(préparé, désactivé Sprint 1)* màj `handle`/`visibility`. Renvoie `403 feature_disabled`.

**`GET /passports/{handle}`** — page publique. **Sprint 1 : renvoie toujours `404`** (aucun Passport public). Cible future : `200` avec **champs whitelistés** (§5.3) si `visibility = 'public'`, sinon `404`.

### 4.4 Dashboard (agrégat) *(mis à jour — Décision 2)*

**`GET /me/dashboard`** — tout le Dashboard V1 en un appel. `200` :
```json
{
  "passport": {
    "opus_id": "opx_01J...",
    "handle": "marie-dubois-k3n7",
    "visibility": "private",
    "lifecycle_stage": "identity_established",
    "issued_at": "..."
  },
  "trust_status":    { "state": "establishing", "score": null },
  "skills_status":   { "state": "empty", "count": 0, "verified_count": 0 },
  "evidence_status": { "state": "empty", "count": 0 }
}
```
> **Frameworks absents** de l'agrégat (retirés du V1). État vide **véridique** (données réelles, valeurs nulles) — jamais de fausses données ni de squelettes indéfinis.

### 4.5 Consent

**`POST /me/consents`** — enregistrer un consentement à l'établissement. Body : `{ "type": "terms|privacy", "version": "2026-07", "granted": true }` → `201`.
**`GET /me/consents`** — historique de consentement. Auth requise.

### 4.6 Conventions transverses

Bearer JWT Supabase sur `/me/*` ; JSON, dates ISO 8601 UTC ; erreurs `{ "error": { "code", "message" } }` ; **idempotence** de la finalisation d'émission (§3.5). **Non exposés en Sprint 1 :** Evidence write, partenaires, Frameworks, partage public actif, billing, orgs.


---

## 5. RECOMMANDATIONS PRODUIT — les 6 décisions techniques à verrouiller

### 5.1 Format de l'Opus ID

**Séparer identité canonique et adresse publique.** L'Opus ID est l'**identité canonique permanente**, pas l'URL.
- **Format :** `opx_` + **ULID** (26 car., base32 Crockford). Ex. `opx_01J8ZC3K9X2Q7B4N6M0R5T8W1E`.
- **Pourquoi :** opaque & non énumérable (aucune fuite du nombre d'utilisateurs) ; trié dans le temps (utile en base/logs) ; préfixé façon Stripe (`cus_…`) ; **permanent** — la « signature à vie » gravée à l'émission (écran 5).
- **Ne pas faire :** entier séquentiel public ; ID = email/nom (fuite de PII).

### 5.2 Structure de l'URL publique du Passport

**Handle lisible et changeable, sur sous-domaine dédié, distinct de l'Opus ID.**
- **URL humaine :** `passport.opusx.com/{handle}` — ex. `passport.opusx.com/marie-dubois-k3n7`.
- **URL canonique immuable :** `passport.opusx.com/id/{opus_id}` — résout toujours, même si le handle change.
- **Pourquoi le sous-domaine :** renforce la séparation **objet public** / **outil admin** (Décision 4) ; SSR indexable ; évite les collisions de namespace avec `opusx.com` et `app.opusx.com`.
- **Vérification (futur, réservé) :** le sous-domaine `verify.opusx.com` pourra héberger un service de vérification publique ; l'URL canonique immuable pourra alors s'exposer aussi comme `verify.opusx.com/{opus_id}`. Réservé, non développé en Sprint 1.
- **Handle changeable** → redirection 301 de l'ancien vers le nouveau ; l'URL canonique ne casse jamais les liens de vérification.
- **Sprint 1 :** URL **réservée & modélisée**, **non ouverte** (page publique = 404).

### 5.3 Informations visibles par défaut

**Divulgation progressive, opt-in.** Le Passport est **privé par défaut** ; « visible par défaut » décrit le socle montré **quand** il devient public.
- **Socle public minimal (quand partagé) :** nom d'affichage, `headline`, **étape du cycle de vie**, statut de vérification, **niveaux** Trust/Skills Status (qualitatifs), et les Evidence **que le pro choisit** d'exposer.
- **Jamais public par défaut :** email, contacts, payload brut des Evidence, tout champ non whitelisté.
- **Contrôle au professionnel :** granularité Evidence par Evidence ; le défaut penche toujours vers *moins*.
- **Sprint 1 :** rien n'est public ; on fixe la **whitelist** des champs exposables pour sécuriser l'endpoint public dès sa conception.

### 5.4 Politique de consentement

**Explicite, granulaire, journalisé, révocable (RGPD, France).**
- **À l'établissement (Sprint 1) :** acceptation explicite (cases non pré-cochées) des **Conditions** et de la **Politique de confidentialité**, journalisées dans `consents`. Base légale : consentement + exécution du service.
- **Ingestion partenaire (futur, à cadrer) :** chaque partenaire alimentant le Passport exige un **consentement dédié** (modèle type OAuth/scopes). Rien n'entre sans autorisation préalable.
- **Partage public (futur) :** action explicite + consentement `public_share`.
- **Droits :** portabilité (export prévu), effacement (cascade), retrait à tout moment (`revoked_at`). **Minimisation :** nom + email au départ, le reste différé.

### 5.5 Premiers indicateurs sur un Passport vide

**Un Passport vide se sent « prêt », jamais « raté ».** On montre l'échafaudage, le **cycle de vie** et le potentiel.
- **Cycle de vie** *(nouveau, Décision 3)* : le Passport affiche son étape **Identity Established** et la trajectoire à venir → le vide devient une **promesse de progression**.
- **Trust Status :** état qualitatif *« Establishing »* (`state = establishing`, `score = null`) — jamais un `0/100`. *« Votre confiance se construira à mesure que des preuves rejoignent votre Passport. »*
- **Skills Status :** cadre explicatif *« Vos compétences prouvées apparaîtront ici. »*
- **Evidence Status :** compteur `0` assumé & pédagogique *« Vos partenaires pourront ajouter des preuves, en toute sécurité. »*
- **Règle transverse :** chaque état zéro explique **ce qui viendra** et **comment**, jamais un bouton mort.

### 5.6 Moment idéal où le Passport devient partageable

**Dissocier la capacité (propriété) de la mise en avant (valeur perçue).**
- **Capacité :** le pro **possède** son Passport → le partage lui appartient dès l'émission. On n'enferme pas la propriété derrière un seuil.
- **Mise en avant (nudge) :** on ne **promeut** le partage qu'une fois le Passport **présentable**, pour protéger le « wow ». **Seuil recommandé : la 1ʳᵉ Evidence vérifiée** — qui correspond exactement à l'entrée dans l'étape de cycle de vie **Receiving Evidence** (§1.6). Belle cohérence : *le Passport devient digne d'être montré au moment même où il commence à vivre.*
  - *Avant le seuil :* partage possible mais **discret** (*« Votre Passport gagnera en impact dès votre première preuve »*).
  - *Au seuil :* l'affordance *Partager* devient **proéminente** — moment naturel de fierté.
- **Sprint 1 :** flux de partage **non construit** ; on **verrouille le déclencheur** (1ʳᵉ Evidence → mise en avant). `visibility` et l'endpoint public existent déjà, désactivés.

---

## 6. Definition of Done

**Le Sprint 1 est « fait » quand :**

1. Un nouvel utilisateur parcourt **Landing → Établir l'identité → Auth → (Vérif email) → Émission du Passport → Dashboard** sans configuration.
2. Le Professional Passport est **émis automatiquement**, de façon **idempotente**, avec un **Opus ID** permanent, un **handle** unique, `lifecycle_stage = identity_established` et `issued_at`.
3. L'**écran d'émission** joue la **séquence de forge** (*Establishing → Generating Opus ID → Issuing → Identity Successfully Established*), grave l'Opus ID, affiche la **phrase de vision**, et **forge** l'objet Passport (jamais d'apparition brutale).
4. Le Passport respecte la **LOI D'OBJET** (registre passeport/diplôme/certificat), distinct du **Dashboard-outil**.
5. Le Passport est **privé par défaut** ; tables, RLS, triggers en place ; page publique = 404.
6. Le **Dashboard V1** affiche exactement **4 modules** : Passport (avec **cycle de vie visible**), Trust Status, Skills Status, Evidence Status — **sans Frameworks** — chacun en état zéro « prêt », via `/me/dashboard` (données réelles vides). Le Dashboard **respire**.
7. Les **6 décisions produit** (§5) et les **6 décisions fondatrices** (préambule) sont respectées, **vocabulaire d'émission inclus** (aucun « créer un compte / créer un Passport » dans l'UI).

**Séquence d'implémentation suggérée :** (a) schéma DB + RLS + triggers → (b) Auth + **émission** idempotente du Passport → (c) écrans Établir/Auth → (d) **écran d'émission** (forge + vision) → (e) Dashboard V1 + `/me/dashboard` → (f) Landing.

---

## 7. Journal de décision (arbitrages actés)

Tous les arbitrages sont tranchés. Le dossier est **figé**.

1. **Voix du Passport** — ✅ **Anglais** pour l'objet Passport (émission, statuts, Trust, cycle de vie, futurs certificats), **UI localisée** selon la langue de l'utilisateur. Le Passport est un **document universel**, indépendant de la langue de l'interface. Voir la **Règle de localisation** (préambule).
2. **1ʳᵉ étape du cycle de vie** — ✅ **« Identity Established »**. Le vocabulaire « Create » est **abandonné définitivement** dans tout Opus X (le Passport est établi puis émis).
3. **Écran d'entrée** — ✅ Titre **« Establish Your Professional Identity »** (voix institutionnelle EN ; champs et CTA localisés).
4. **Fondations techniques** — ✅ Next.js (App Router) + TypeScript + Tailwind ; domaines `opusx.com` / `app.opusx.com` / `passport.opusx.com`, avec `api.` `docs.` `developers.` `verify.` **réservés** ; **magic link** par défaut (mot de passe en option) ; direction **« Gravité & Clarté »**, la **LOI D'OBJET** (Passport = objet / Dashboard = outil) érigée en règle de conception de toute la plateforme.
5. **Frameworks** — ✅ **Hors Sprint 1**. Tables en **stub** : aucun seed, aucune interface, aucun affichage — uniquement la structure prête pour les prochains sprints.
6. **Principe fondateur** — ✅ **« L'émotion d'abord »** (voir préambule) : le Sprint 1 crée un moment émotionnel, pas seulement un Passport. Ce principe guide toutes les décisions UX et devient une référence permanente.

> **Statut : RÉVISION FIGÉE — spécification officielle du Sprint 1.** Prête pour transmission à Claude Code. La phase de réalisation d'Opus X est officiellement ouverte.
