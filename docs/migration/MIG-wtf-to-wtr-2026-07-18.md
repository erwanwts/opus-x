# MIG — Migration `wtf` → `wtr` (framework_id + slug) · 2026-07-18

> ## ⚠️ APPROCHE DB ANNULÉE (2026-07-19) — voir mise à jour
> La partie **CODE** de cette migration (corpus, seed, tests, redirection) a bien été
> appliquée au dépôt le 2026-07-18 (commit ddfda6f). En revanche, **l'application DB par
> mutation a été ANNULÉE par l'architecte** : muter `framework:wtf` (id/slug publiés) est
> **structurellement interdit** par la garde d'immuabilité (`wsp_reject_mutation`, WSP-001,
> FRAMEWORK-003) — l'essai staging a été rejeté, transaction annulée, aucune donnée touchée.
>
> **Nouvelle direction** : succession de versions **append-only** — `framework:wtf` reste
> publié (**superseded**), `framework:wtr` est une **nouvelle publication** reliée par
> `supersedes` ; les 79 Evidence gardent `wtf:212` à jamais. La migration de mutation et son
> rollback sont **archivés** (`docs/migration/archive/`), **jamais exécutés**. La
> **redirection 301** `/frameworks/wtf → world-trader` devient contraire à la décision
> (wtf doit rester consultable) : à retirer dans le chantier de succession. Plusieurs
> dispositions ci-dessous (« aucune coexistence permanente », date de retrait 301) sont
> **caduques** — à amender par l'architecte.

**Statut** : partie CODE appliquée au dépôt (2026-07-18) ; **partie DB par mutation ANNULÉE
(2026-07-19)** — remplacée par une succession de versions append-only.

## Décision (amendement architecte, 2026-07-18)

Trois niveaux d'identification désormais distincts :

| Niveau | Avant | Après |
|---|---|---|
| Nom public | World Trader Framework | **World Trader Framework** (inchangé) |
| id canonique | `framework:wtf` | **`framework:wtr`** |
| coordonnées | `wtf:NNN` | **`wtr:NNN`** (numérotation conservée) |
| étiquette humaine | `WTF-NNN` | **`WTR-NNN`** |
| slug public | `wtf` | **`world-trader`** |

Substitution par **préfixe seul** ; numérotation, versions et structure intégralement
conservées. Un remplacement global `wtf → wtr` aurait été FAUX (aurait corrompu le slug).

## Surface migrée

Records OCR (13) · registres/manifest régénérés · seed SQL `20260713000001` · migration
forward `20260718000001` · Knowledge Graph (régénéré, inchangé : 0 wtf) · API canonique
(régénérée) · tests unitaires + intégration · golden `OCR-110-golden/*` (régénéré) ·
décisions D2 (CLAUDE.md) & WEB-D2 (WEB-001B) réécrites.

## Préservés (non migrés — état historique daté)

- `docs/deploy/PROD-2026-07-17.md` — trace de déploiement.
- `docs/web/OCR-GROUND-001-*` — rapports d'analyse datés (F2–F5, SYNTHESE, Mandate, pilote-110).
- Cette note de migration — conserve `wtf` à titre **historique**.

## Redirection transitoire — RETIRÉE le 2026-07-20, avant l'échéance du 31 octobre

> **AMENDEMENT (2026-07-20) — pourquoi la redirection disparaît AVANT sa date de retrait gravée.**
>
> La **publication de la représentation canonique `wtr` par réidentification**
> (`reidentified_as`, OCR-007 PRD-306 — appliquée en **production** le 2026-07-20) rend cette
> redirection **doctrinalement fausse**. L'architecte a gravé que **chaque représentation a son
> adresse propre** et qu'**aucune redirection permanente ne subsiste** : `framework:wtf` n'est
> pas un slug périmé à éteindre, c'est une **représentation canonique antérieure, toujours
> publiée et immuable**, qui doit rester **consultable** à `/frameworks/wtf` avec son **statut
> dérivé** `reidentified` (+ `canonical_identifier: framework:wtr`). Un 301 vers
> `world-trader` la rendrait **inatteignable** — précisément ce que la réidentification
> interdit.
>
> La date du **31 octobre 2026 devient sans objet**. Elle supposait que `wtf` était une
> survivance de compatibilité, à éteindre à terme. La réidentification établit l'inverse :
> **`wtf` demeure**. Le retrait n'attend donc pas l'échéance — il ne s'agit plus d'un délai de
> compatibilité, mais d'une **correction de doctrine** : la redirection contredisait le
> principe le jour où la réidentification a été publiée.
>
> **Supprimés** : `lib/seo/transitional-redirects.ts`, son test, et le branchement dans
> `next.config.ts`. Le texte d'origine ci-dessous est **conservé comme trace historique**.

### Texte d'origine (historique — conservé, caduc)

`GET /frameworks/wtf/skills` → **301** → `/frameworks/world-trader/skills`
(`lib/seo/transitional-redirects.ts`, branchée dans `next.config.ts`).

- Mesure de **compatibilité temporaire** pour les consommateurs déjà déployés, **pas**
  une seconde identité.
- Aucun générateur, sitemap, lien interne ou artefact ne **produit** le slug `wtf` : la
  redirection n'existe que pour l'entrant.
- **Date de retrait GRAVÉE** : la redirection est **active jusqu'au 31 octobre 2026 inclus**
  et doit être **supprimée au plus tard le 1er novembre 2026**. Au retrait : supprimer
  l'entrée de `transitional-redirects.ts` (et le test associé).
  *(Caduque — retrait effectué le 2026-07-20, voir l'amendement ci-dessus.)*

## Base de données — deux artefacts

1. **Seed `20260713000001` édité** — cohérence du dépôt / installations fraîches.
2. **Migration forward `20260718000001`** — bases déjà seedées (staging/prod).
   Contrainte signalée : id du framework incorporé dans les PK/FK de 5 tables, FK non
   nommées et non-`on update cascade` → drop dynamique (pg_constraint) → update →
   recreate, en transaction. **Écrire n'est pas appliquer.**

## Convention de fins de ligne (EOL) — piège récurrent

Le dépôt stocke les Records en **LF** (blob git), mais `core.autocrlf=true` les
**checke out en CRLF** sur Windows. Le `_manifest.json` et les golden utilisent des
**checksums calculés sur le contenu LF** (le blob), pas sur le disque.

> **CADUQUE depuis le 2026-07-21.** Un `.gitattributes` (`* text=auto eol=lf`) normalise
> désormais l'arbre de travail : disque et blob portent les mêmes octets. Le générateur
> lit le dossier réel du corpus et produit les checksums attendus — vérifié, zéro écart.
> Le contournement par miroir LF hors dépôt **n'existe plus**. La règle ci-dessous est
> conservée comme trace de l'incident ; elle ne s'applique plus.

~~**Règle** : tout outillage touchant à un checksum de Record (manifest, golden,
sourceChecksum) doit hasher les **octets du blob LF** — soit `git show HEAD:<file>`,
soit le disque avec `\r\n → \n` — **jamais le disque brut**.~~

Trois incidents CRLF ont émaillé cette migration, tous corrigés :
1. régénération manifest lisant le disque CRLF → 17 checksums parasites (faux positifs) ;
2. patch manifest via `subprocess.run(text=True)` → décodage cp1252 → **mojibake** des
   em-dash ; corrigé en lecture **octets** (`capture_output`, pas `text=True`) ;
3. normalisation LF de tous les Records sur disque → 18 diffs EOL parasites ; annulée
   (seuls les Records au contenu réellement migré doivent différer).

Que le prochain lecteur ne les redécouvre pas — et qu'il n'ait plus à s'en prémunir :
le `.gitattributes` a supprimé la cause.

## Note de gouvernance

D2/WEB-D2 affirmaient « `wtf` inchangé » : **amendées** par l'architecte le 2026-07-18
(seul l'architecte peut amender une décision gelée). Le présent document est la source
historique de l'ancien identifiant jusqu'à retrait de la redirection.
