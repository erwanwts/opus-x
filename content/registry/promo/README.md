`content/registry/promo/README.md` · lieu de promotion (créé à vide) · 2026-07-26

# Lieu de promotion — `content/registry/promo/`

Registre **distinct** du corpus OCR qui porte les **actes de promotion ordinaire** (série `PROMO`). Miroir du
lieu fondateur `founding/`, **adapté au grain souple (D-027)**.

- **Un fait `PROMO` déclare UN OU PLUSIEURS Records Normative** (`declares_normative` = tableau). L'acte
  fondateur `RATIF` (deux Records) devient un **cas ordinaire** de ce grain, plus une exception.
- **L'identifiant fait foi par le CONTENU** (champ `id`), pas par le nom de fichier (D-027). C'est la **garde
  de contenu** (`lib/registry/promoLieu.test.ts`) qui le vérifie — elle ne peut plus s'appuyer sur le nom.
- **Le statut est DÉRIVÉ** du fait par le résolveur (`resolveStatus`, étape 6) ; le champ `Status` d'un Record
  n'est **jamais** authored (OCR-009 §4, D-022).
- **La révocation** est un **fait séparé** (`kind: revocation`, `revokes_normative`), jamais une suppression
  (D-013). Le résolveur calcule `effective = promoted \ revoked`.
- **Acte en 2 parties (D-004)** : écrire un `PROMO-nnn` **et** étendre la borne `expected_ranges` du manifeste
  OCR (plage autoritative). La garde vérifie la **cohérence** des deux plages (source unique).

**Ce lieu est créé à VIDE.** Aucun fait `PROMO` réel n'est écrit ici. Son émission est un **mandat distinct et
postérieur (étape 8)**. La garde est **armée** : elle accepte un `PROMO` bien formé et rejette chaque forme
mal formée (id absent du corpus, doublon dans un fichier, id promu deux fois, hors plage) — prouvé par mutation
sur des **fixtures de test**, sans toucher au corpus ni promouvoir aucun Record.
