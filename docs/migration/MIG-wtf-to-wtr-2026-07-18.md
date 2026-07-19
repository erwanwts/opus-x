# MIG — Migration `wtf` → `wtr` (framework_id + slug) · 2026-07-18

**Statut** : appliquée au dépôt (un commit atomique). Application aux bases vivantes =
acte de déploiement séparé (voir migration forward).

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

## Redirection transitoire

`GET /frameworks/wtf/skills` → **301** → `/frameworks/world-trader/skills`
(`lib/seo/transitional-redirects.ts`, branchée dans `next.config.ts`).

- Mesure de **compatibilité temporaire** pour les consommateurs déjà déployés, **pas**
  une seconde identité.
- Aucun générateur, sitemap, lien interne ou artefact ne **produit** le slug `wtf` : la
  redirection n'existe que pour l'entrant.
- **Date de retrait GRAVÉE** : la redirection est **active jusqu'au 31 octobre 2026 inclus**
  et doit être **supprimée au plus tard le 1er novembre 2026**. Au retrait : supprimer
  l'entrée de `transitional-redirects.ts` (et le test associé).

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

**Règle** : tout outillage touchant à un checksum de Record (manifest, golden,
sourceChecksum) doit hasher les **octets du blob LF** — soit `git show HEAD:<file>`,
soit le disque avec `\r\n → \n` — **jamais le disque brut**. Lire le disque CRLF produit
des checksums qui divergent silencieusement de la convention du dépôt.

Trois incidents CRLF ont émaillé cette migration, tous corrigés :
1. régénération manifest lisant le disque CRLF → 17 checksums parasites (faux positifs) ;
2. patch manifest via `subprocess.run(text=True)` → décodage cp1252 → **mojibake** des
   em-dash ; corrigé en lecture **octets** (`capture_output`, pas `text=True`) ;
3. normalisation LF de tous les Records sur disque → 18 diffs EOL parasites ; annulée
   (seuls les Records au contenu réellement migré doivent différer).

Que le prochain lecteur ne les redécouvre pas : **octets du blob, jamais le disque.**

## Note de gouvernance

D2/WEB-D2 affirmaient « `wtf` inchangé » : **amendées** par l'architecte le 2026-07-18
(seul l'architecte peut amender une décision gelée). Le présent document est la source
historique de l'ancien identifiant jusqu'à retrait de la redirection.
