# **Schéma GEO du site Opus X**

L’objectif du site n’est pas seulement d’être bien référencé sur Google. Il doit devenir une **source de vérité structurée**, compréhensible et réutilisable par :

* les moteurs de recherche ;  
* les assistants IA ;  
* les LLM ;  
* les moteurs de réponse ;  
* les partenaires institutionnels ;  
* les développeurs ;  
* les futurs consommateurs du World Skills Protocol.

Le site doit donc être construit comme une **projection publique du Knowledge Graph**, et non comme un simple site marketing.

---

# **1\. Architecture générale**

```
OPUS X
│
├── 1. Accueil institutionnel
│
├── 2. Vision
│   ├── Pourquoi Opus X
│   ├── Le problème de la confiance professionnelle
│   ├── De la compétence déclarée à la compétence vérifiée
│   └── L’identité professionnelle numérique
│
├── 3. Professional Passport
│   ├── Qu’est-ce qu’un Professional Passport ?
│   ├── Comment il est émis
│   ├── Cycle de vie du Passport
│   ├── Trust Status
│   ├── Skills Status
│   ├── Evidence Status
│   ├── Vérification publique
│   ├── Cas d’usage
│   └── FAQ
│
├── 4. World Skills Protocol
│   ├── Présentation du protocole
│   ├── Principes fondamentaux
│   ├── Architecture du protocole
│   ├── Gouvernance
│   ├── Versioning
│   ├── Conformité
│   └── FAQ protocole
│
├── 5. Ontologie
│   ├── Vue d’ensemble
│   ├── Canonical Type Registry
│   ├── Canonical Predicate Registry
│   ├── Canonical Attribute Registry
│   ├── Canonical Constraint Registry
│   ├── Canonical Inference Registry
│   ├── Canonical Cardinality Registry
│   └── Knowledge Graph
│
├── 6. Registry
│   ├── Vue d’ensemble du Registry
│   ├── Records
│   ├── Predicates
│   ├── Types
│   ├── Attributes
│   ├── Constraints
│   ├── Frameworks
│   └── Versions
│
├── 7. Knowledge Graph
│   ├── Présentation
│   ├── Nodes
│   ├── Edges
│   ├── Relations canoniques
│   ├── Provenance
│   ├── Visualisation
│   └── API Graph
│
├── 8. Evidence
│   ├── Qu’est-ce qu’une preuve ?
│   ├── Types de preuves
│   ├── Cycle de vie d’une preuve
│   ├── Intégrité
│   ├── Provenance
│   ├── Vérification
│   ├── Révocation
│   └── FAQ
│
├── 9. Trust
│   ├── Qu’est-ce que la confiance vérifiable ?
│   ├── Trust Status
│   ├── Calcul de confiance
│   ├── Limites
│   ├── Explicabilité
│   └── FAQ
│
├── 10. Skills
│   ├── Qu’est-ce qu’une compétence vérifiée ?
│   ├── Skill Frameworks
│   ├── Niveaux
│   ├── Critères
│   ├── Evidence Requirements
│   ├── Skill Passport
│   └── FAQ
│
├── 11. Frameworks
│   ├── Vue d’ensemble
│   ├── Framework Registry
│   ├── Framework Versions
│   ├── Publication
│   ├── Certification
│   ├── Conformité
│   └── Catalogue
│
├── 12. Applications
│   ├── Intelligence artificielle
│   ├── Trading
│   ├── Recrutement
│   ├── Éducation
│   ├── Universités
│   ├── Organismes de certification
│   ├── Marketplaces
│   └── Entreprises
│
├── 13. Pour les acteurs
│   ├── Pour les professionnels
│   ├── Pour les entreprises
│   ├── Pour les recruteurs
│   ├── Pour les écoles
│   ├── Pour les certificateurs
│   ├── Pour les développeurs
│   ├── Pour les plateformes IA
│   └── Pour les partenaires
│
├── 14. Développeurs
│   ├── Documentation API
│   ├── Quickstart
│   ├── Authentification
│   ├── Passport API
│   ├── Evidence API
│   ├── Registry API
│   ├── Knowledge Graph API
│   ├── Webhooks
│   ├── SDK
│   ├── Exemples
│   └── Changelog
│
├── 15. Standards et comparatifs
│   ├── Opus X vs CV
│   ├── Opus X vs badge numérique
│   ├── Opus X vs certificat
│   ├── Opus X vs Open Badges
│   ├── Opus X vs Verifiable Credentials
│   ├── Opus X vs DID
│   └── Interopérabilité
│
├── 16. Ressources
│   ├── Glossaire
│   ├── Questions fréquentes
│   ├── Guides
│   ├── Research
│   ├── Documents normatifs
│   ├── White papers
│   ├── Cas d’étude
│   └── Actualités
│
├── 17. Pages publiques dynamiques
│   ├── /p/[handle]
│   ├── /registry/[record-id]
│   ├── /predicates/[predicate]
│   ├── /types/[type]
│   ├── /frameworks/[framework]
│   ├── /skills/[skill]
│   ├── /evidence/[evidence-id]
│   └── /verify/[verification-id]
│
└── 18. Institutionnel
    ├── À propos
    ├── Gouvernance
    ├── Sécurité
    ├── Confidentialité
    ├── Conditions
    ├── Contact
    └── Partenaires
```

---

# **2\. Structure des grandes pages piliers**

Le site doit comporter quelques **pages piliers**, très riches, qui servent de référence principale aux moteurs IA.

## **Page pilier 1 — Professional Passport**

URL recommandée :

```
/professional-passport
```

Sections :

```
H1 — What Is a Professional Passport?

Définition courte
Pourquoi il existe
Ce qu’il contient
Ce qu’il ne contient pas
Comment il est émis
Qui peut l’émettre
Cycle de vie
Statuts visibles
Preuves associées
Vérification publique
Confidentialité
Cas d’usage
Exemple de Passport
FAQ
Sources normatives liées
```

Questions GEO ciblées :

* What is a Professional Passport?  
* How does a verified professional identity work?  
* What is the difference between a CV and a Professional Passport?  
* How can professional skills be verified?  
* Who issues a Professional Passport?  
* Can a Professional Passport be revoked?  
* Is a Professional Passport public?

---

## **Page pilier 2 — World Skills Protocol**

```
/world-skills-protocol
```

Sections :

```
H1 — What Is the World Skills Protocol?

Définition officielle
Mission du protocole
Problème résolu
Principes fondamentaux
Architecture
Records
Registry
Ontology
Knowledge Graph
Evidence
Trust
Passport
Gouvernance
Versioning
Interopérabilité
Implémentations
FAQ
Documents normatifs
```

---

## **Page pilier 3 — Verified Skills**

```
/verified-skills
```

Sections :

```
Définition d’une compétence
Différence entre connaissance et compétence
Différence entre compétence déclarée et vérifiée
Niveaux de compétence
Critères
Preuves attendues
Validation
Révocation
Frameworks
Applications
FAQ
```

---

## **Page pilier 4 — Verifiable Evidence**

```
/evidence
```

Sections :

```
Définition
Origine
Types
Source
Intégrité
Attribution
Validation
Cycle de vie
Supersession
Révocation
Utilisation dans le Passport
Utilisation dans le Trust Engine
FAQ
```

---

## **Page pilier 5 — Knowledge Graph**

```
/knowledge-graph
```

Sections :

```
Définition
Pourquoi un graphe
Nœuds
Arêtes
Prédicats
Types
Attributs
Contraintes
Provenance
Inférences
Extraction
Représentation machine
API
FAQ
```

---

# **3\. Organisation par entités GEO**

Le site doit exposer les entités principales de manière stable.

```
Opus X
World Skills Protocol
Professional Passport
Professional Identity
Opus ID
Evidence
Immutable Fact
Verification
Verification Request
Verification Response
Trust
Trust Status
Skill
Competency
Framework
Framework Version
Certified Issuer
Registry
Knowledge Graph
Canonical Predicate
Canonical Type
Canonical Attribute
Canonical Constraint
```

Chaque entité importante doit disposer d’une page dédiée.

Exemple :

```
/concepts/evidence
/concepts/trust
/concepts/professional-identity
/concepts/immutable-fact
/concepts/verification
```

Structure standard :

```
Nom canonique
Définition officielle
Identifiant éventuel
Catégorie
Fonction dans le protocole
Relations principales
Exemples
Ce que l’entité n’est pas
Documents normatifs
Questions fréquentes
Données structurées
```

---

# **4\. Projection du Registry sur le site**

Le Registry ne doit pas rester uniquement dans GitHub ou dans les fichiers Markdown. Il doit disposer d’une projection publique lisible.

## **Records**

```
/registry
/registry/ocr-100
/registry/ocr-101
/registry/ocr-102
...
```

Chaque Record doit afficher :

```
Record ID
Canonical Name
Status
Version
Layer
Kind
Definition
Purpose
Normative statements
Knowledge Graph Relationships
Related Records
Supersedes
Superseded by
Source document
Machine-readable version
Last updated
```

---

## **Predicates**

```
/registry/predicates
/registry/predicates/is-a
/registry/predicates/part-of
/registry/predicates/produces
/registry/predicates/protects
```

Chaque page prédicat :

```
predicate_id
canonical name
semantic contract
family
relationship type
ontology domain
signature
direction
inverse
symmetry
semantic stability
aliases
derived predicates
source and target examples
Records using the predicate
introduced_in
governed_by
used_by
```

---

## **Types**

```
/registry/types
/registry/types/evidence
/registry/types/framework
/registry/types/passport
```

---

## **Frameworks**

```
/frameworks
/frameworks/world-trader-pass
/frameworks/ai-professional-framework
```

Chaque framework :

```
Nom
Version
Owner
Publisher
Status
Domain
Skills
Competencies
Levels
Criteria
Evidence requirements
Changelog
Machine-readable definition
```

---

# **5\. Architecture éditoriale GEO**

Le contenu doit être organisé selon quatre couches.

## **Couche 1 — Définitions**

Pages courtes et très précises.

Exemples :

```
What is verified evidence?
What is a skill framework?
What is a professional identity?
What is a canonical predicate?
What is a trust status?
```

Objectif : obtenir des citations directes dans les réponses IA.

---

## **Couche 2 — Explications**

Pages pédagogiques approfondies.

Exemples :

```
How professional skills are verified
How evidence becomes part of a Professional Passport
How Opus X protects professional identity
How the World Skills Protocol works
How the Knowledge Graph represents verified achievements
```

---

## **Couche 3 — Comparatifs**

```
Professional Passport vs CV
Professional Passport vs digital badge
Verified skill vs declared skill
Evidence vs certificate
Framework vs qualification
Opus ID vs traditional account ID
World Skills Protocol vs Open Badges
```

---

## **Couche 4 — Cas d’usage**

```
Professional Passport for traders
Professional Passport for AI professionals
Verified skills for recruiters
Verified evidence for universities
Professional identity for freelancers
Skill verification for marketplaces
Trust infrastructure for AI agents
```

---

# **6\. Modèle de page GEO**

Chaque page stratégique doit respecter une structure cohérente.

```
H1 clair sous forme de question ou de définition

Réponse directe de 40 à 80 mots

Résumé en 3 à 5 points

Définition officielle

Pourquoi le concept existe

Comment il fonctionne

Composants

Exemple concret

Relations avec les autres concepts

Ce que le concept n’est pas

Limites

Gouvernance

FAQ

Sources normatives

Dernière mise à jour
```

Exemple :

```
H1 — What Is a Professional Passport?

A Professional Passport is a verifiable digital representation of a person’s
professional identity, skills, evidence, achievements and trust status. It is
issued through the World Skills Protocol and can be independently verified by
authorized systems, employers, institutions and AI applications.
```

---

# **7\. Graphe de liens internes**

Le maillage interne doit reproduire le Knowledge Graph.

Exemple :

```
Professional Passport
├── part_of → World Skills Protocol
├── surfaces → Professional Identity
├── references → Evidence
├── owned_by → Professional
├── governed_by → Opus X
└── exposes → Public Passport
```

Sur la page du Passport, ces relations deviennent des liens :

```
Professional Passport fait partie du World Skills Protocol.
Il expose une projection de la Professional Identity.
Il référence les Evidence vérifiées.
Il appartient au Professional.
```

Le texte éditorial et le graphe doivent donc utiliser les **mêmes relations canoniques**.

---

# **8\. Données structurées Schema.org**

## **Accueil**

```
{
  "@type": "Organization",
  "name": "Opus X",
  "description": "Infrastructure for verified professional identity and skills",
  "knowsAbout": [
    "Professional identity",
    "Verified skills",
    "Digital credentials",
    "Knowledge graphs",
    "Skill certification"
  ]
}
```

## **World Skills Protocol**

```
{
  "@type": "TechArticle",
  "headline": "World Skills Protocol",
  "about": {
    "@type": "DefinedTerm",
    "name": "World Skills Protocol"
  }
}
```

## **Glossaire**

```
{
  "@type": "DefinedTermSet",
  "name": "World Skills Protocol Glossary"
}
```

## **Entrée du Registry**

```
{
  "@type": "DefinedTerm",
  "termCode": "OCR-101",
  "name": "Professional Passport",
  "description": "..."
}
```

## **Framework**

```
{
  "@type": "EducationalOccupationalCredential",
  "name": "World Trader Pass",
  "credentialCategory": "Professional Skills Framework"
}
```

## **FAQ**

```
{
  "@type": "FAQPage"
}
```

## **Documentation**

```
{
  "@type": "TechArticle"
}
```

---

# **9\. URLs recommandées**

Les URLs doivent être courtes, permanentes et canoniques.

```
/
/vision
/professional-passport
/world-skills-protocol
/verified-skills
/evidence
/trust
/knowledge-graph
/registry
/frameworks
/use-cases
/developers
/research
/glossary
/faq
```

Pages dynamiques :

```
/p/[handle]
/registry/[record-id]
/predicates/[predicate-name]
/types/[type-name]
/attributes/[attribute-name]
/constraints/[constraint-name]
/frameworks/[framework-slug]
/skills/[skill-slug]
```

Éviter :

```
/page?id=123
/article-456
/blog/category/general
```

---

# **10\. Structure du menu principal**

Je recommande un menu public simple.

```
Passport
Protocol
Registry
Developers
Applications
Resources
About
```

Sous-menus :

```
Passport
├── Overview
├── How it works
├── Verification
└── Public Passport

Protocol
├── World Skills Protocol
├── Evidence
├── Trust
├── Skills
└── Knowledge Graph

Registry
├── Records
├── Predicates
├── Types
├── Frameworks
└── Versions

Applications
├── AI
├── Trading
├── Recruitment
├── Education
└── Certification

Resources
├── Glossary
├── Guides
├── Research
├── FAQ
└── Documentation
```

---

# **11\. Arborescence éditoriale initiale**

Pour la première version GEO, je recommande environ **45 pages prioritaires**.

## **Niveau 1 — Pages fondatrices**

```
1. Homepage
2. Vision
3. Professional Passport
4. World Skills Protocol
5. Verified Skills
6. Evidence
7. Trust
8. Knowledge Graph
9. Registry
10. Governance
```

## **Niveau 2 — Concepts principaux**

```
11. Professional Identity
12. Opus ID
13. Immutable Fact
14. Verification
15. Verification Request
16. Verification Response
17. Skill
18. Competency
19. Framework
20. Certified Issuer
```

## **Niveau 3 — Acteurs**

```
21. For Professionals
22. For Employers
23. For Recruiters
24. For Schools
25. For Certification Bodies
26. For Developers
27. For AI Platforms
```

## **Niveau 4 — Cas d’usage**

```
28. Trading
29. Artificial Intelligence
30. Recruitment
31. Education
32. Universities
33. Marketplaces
```

## **Niveau 5 — Comparatifs**

```
34. Professional Passport vs CV
35. Professional Passport vs Digital Badge
36. Verified Skill vs Declared Skill
37. Evidence vs Certificate
38. WSP vs Open Badges
39. WSP vs Verifiable Credentials
```

## **Niveau 6 — Ressources**

```
40. Glossary
41. FAQ
42. API overview
43. Protocol documents
44. Security
45. Privacy
```

---

# **12\. Architecture langue**

La voix institutionnelle d’Opus X est en anglais, mais le site peut être localisé.

Structure recommandée :

```
/en/
/fr/
/es/
```

Exemples :

```
/en/professional-passport
/fr/professional-passport
/es/professional-passport
```

Les identifiants normatifs ne doivent jamais être traduits :

```
Professional Passport
World Skills Protocol
Trust Status
Evidence Status
Skills Status
Opus ID
```

Le contenu explicatif peut être traduit, mais les noms canoniques restent identiques.

---

# **13\. Relation entre le site et WSP-001**

Le site doit être alimenté par trois couches distinctes.

```
Couche normative
OCR Records et Registry

Couche machine
JSON / Knowledge Graph / API

Couche éditoriale
Pages lisibles pour humains et moteurs IA
```

Pipeline recommandé :

```
OCR Markdown
      ↓
Registry JSON
      ↓
WSP-001 Graph Extractor
      ↓
Knowledge Graph
      ↓
Public API
      ↓
Pages GEO
      ↓
Search engines / LLM / partners
```

Le contenu éditorial ne doit pas recréer manuellement la vérité.

Il doit consommer :

* les noms canoniques ;  
* les définitions ;  
* les relations ;  
* les identifiants ;  
* les versions ;  
* les statuts ;  
* les références normatives.

---

# **14\. Principe GEO central**

La structure finale doit répondre à cette règle :

> **Une entité, une définition canonique, une URL stable, une représentation machine, plusieurs contextes éditoriaux.**

Exemple :

```
Entité : Evidence

Définition normative :
OCR-110

Page canonique :
/evidence

Page Registry :
/registry/ocr-110

Données machine :
/api/registry/ocr-110

Relations :
Knowledge Graph

Pages contextuelles :
/professional-passport/evidence
/trust/evidence
/verification/evidence
```

Ainsi, Google et les IA rencontrent toujours la même entité, la même définition et la même source d’autorité.

---

# **15\. Ordre de construction recommandé**

```
Lot GEO 1
Fondations et pages piliers

Lot GEO 2
Registry public

Lot GEO 3
Glossaire et entités

Lot GEO 4
Knowledge Graph public

Lot GEO 5
Comparatifs et cas d’usage

Lot GEO 6
Documentation développeurs

Lot GEO 7
Localisation FR / ES

Lot GEO 8
Automatisation complète depuis le Registry
```

La priorité immédiate est :

```
1. Homepage
2. Professional Passport
3. World Skills Protocol
4. Evidence
5. Trust
6. Verified Skills
7. Registry
8. Knowledge Graph
9. Glossary
10. FAQ
```

Cette structure permet à Opus X de devenir simultanément :

* une marque institutionnelle ;  
* une infrastructure technologique ;  
* une documentation normative ;  
* une base de connaissances ;  
* une source exploitable par les IA ;  
* une autorité sémantique sur les compétences vérifiées.

