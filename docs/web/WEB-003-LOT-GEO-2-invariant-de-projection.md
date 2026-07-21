# LOT GEO 2 · Lot B — L'INVARIANT DE PROJECTION : liste mesurée des transformations autorisées

> **MESURE, PAS IMPLÉMENTATION.** Aucun moteur de rendu n'est écrit. Ce document établit,
> par mesure sur les 33 Records, la liste des constructions que le corpus emploie
> réellement et, pour chacune, **ce que le rendu retire** et **ce qu'il doit préserver**.
> La liste est soumise à gravure ; le rendu ne sera pas codé avant.

**Date** : 2026-07-21 · corpus 33 Records.

---

## Pourquoi la liste EST l'invariant

L'invariant gravé porte sur le **texte signifiant** :

> « Le nombre de caractères significatifs du corps publié doit être identique avant et
> après projection, à l'exception des transformations explicitement autorisées par le
> moteur de rendu. »

Le markdown étant lui-même du balisage, une égalité stricte source ↔ rendu est
impossible : `**gras**` fait 8 caractères en source et 4 en texte, `## Titre` en fait 8
et 5. Il y a **2 228 gras** et **1 046 titres** dans le corpus — l'égalité stricte
échouerait 3 274 fois d'entrée.

L'invariant n'est donc opérant que sous cette forme :

> **texte source − marqueurs autorisés = texte rendu**

et la **liste des marqueurs autorisés devient la définition même de l'invariant**. Tout ce
qui n'y figure pas doit survivre intact. C'est pourquoi elle doit être gravée marqueur par
marqueur, et non décrite en intention.

---

## Les 11 constructions employées par le corpus — mesure exhaustive

| # | Construction | Occurrences | Marqueur RETIRÉ | Texte PRÉSERVÉ |
|---:|---|---:|---|---|
| 1 | gras `**texte**` | 2 228 | les 4 astérisques | `texte` |
| 2 | titre `#` `##` `###` | 1 046 | les dièses + l'espace suivant | le libellé du titre |
| 3 | item ordonné `1. ` | 795 | le numéro, le point, l'espace, l'indentation de liste | le texte de l'item |
| 4 | puce `- ` | 1 088 | le tiret, l'espace, l'indentation de liste | le texte de l'item |
| 5 | code inline `` `texte` `` | 796 | les 2 accents graves | `texte` |
| 6 | barres de tableau `\|` | 356 lignes | les barres et le remplissage d'alignement | **le contenu de chaque cellule** |
| 7 | clôture de bloc de code ` ``` ` | 104 | les 2 lignes de clôture, `json` compris | **tout le contenu du bloc, à l'octet près** |
| 8 | italique `*texte*` | 205 | les 2 astérisques | `texte` |
| 9 | séparateur de tableau `\|---\|` | 33 | la ligne entière | *(aucun texte — ligne de structure)* |
| 10 | règle `---` | 39 | la ligne entière | *(aucun texte — ligne de structure)* |
| 11 | citation `> ` | 46 | le chevron et l'espace | le texte cité |

**Rien d'autre.** Le corpus ne contient **aucun lien** `[texte](url)` et **aucune image**
`![…]` — 0 occurrence de chacun. Les 52 blocs de code sont **tous en `json`** : un seul
langage. Les tableaux font **2 colonnes au maximum**.

## Deux règles de frontière, sans lesquelles la liste ne suffit pas

**Un bloc de code est opaque.** À l'intérieur d'une clôture ` ``` `, **aucune**
transformation ne s'applique : ni gras, ni italique, ni code inline, ni puce, ni titre. Un
`**` ou un `#` à l'intérieur d'un bloc `json` est du contenu, pas un marqueur. Cette règle
n'est pas une commodité : **70 des 73 pseudo-balises du corpus vivent dans des blocs de
code** (voir plus bas), et c'est elle qui les protège.

**L'ordre de retrait est celui du tableau.** Les marqueurs de bloc (titre, puce, item,
citation, tableau) sont retirés en tête de ligne ; les marqueurs inline (gras, italique,
code) le sont ensuite, à l'intérieur de la ligne. Le gras avant l'italique — sinon
`**gras**` serait lu comme un italique contenant un astérisque.

---

## Ce qui n'est PAS une transformation autorisée

| Séquence | Traitement |
|---|---|
| **Pseudo-balises** `<opus_id>`, `<level>`, `<jcs-digest>`… | **TEXTE.** Préservées caractère pour caractère. |
| Toute autre séquence ressemblant à du balisage | **TEXTE**, tant qu'elle n'est pas dans la liste des 11. |
| HTML brut | **TEXTE.** Jamais interprété, jamais `dangerouslySetInnerHTML`. |
| Images, liens | **Absents du corpus.** Leur apparition future doit faire échouer le test d'exhaustivité, pas être rendue au jugé. |

Conforme à la règle gravée : *« Le contenu d'un Record constitue un texte canonique. Toute
séquence susceptible d'être interprétée comme du balisage est traitée comme du texte tant
qu'elle n'appartient pas explicitement au langage de représentation utilisé. »*

---

## Vérification de la liste — mesurée sur les 33 Records

Le retrait des seuls marqueurs ci-dessus a été **appliqué en mesure** (aucun rendu produit,
aucun fichier modifié) :

```
caractères non blancs   source 431 630  →  texte signifiant 413 505   (retirés : 18 125)
pseudo-balises          source      73  →  après retrait        73
   dont dans un bloc de code : 70   ·   en prose : 3
PERDUES : AUCUNE — toutes survivent
```

**Les 73 pseudo-balises survivent intégralement.** C'est la démonstration que la liste est
complète : si un marqueur non autorisé avait été retiré, ou si un bloc de code avait été
traité, le décompte aurait baissé.

*Note de méthode* : le total des marqueurs bruts vaut 21 276 caractères, contre 18 125
mesurés ici. L'écart tient aux **espaces** contenus dans les marqueurs (`## `, `- `, `> `)
et au remplissage des tableaux : l'invariant porte sur les **caractères non blancs**, seule
grandeur stable face à l'indentation et à l'alignement. C'est cette grandeur, et non le
nombre de caractères bruts, qui doit être gravée.

## Les 3 pseudo-balises de prose — les seules réellement exposées

Toutes dans **OCR-110**, et toutes protégées à la source par du code inline :

```
- **Criterion Levels** — … e.g. `{ "S03.C08": <level> }`. Levels are defined by the Framework…
> Levels shown as `<level>` are placeholders. Levels are defined by the Framework…
8. **How is Criterion Levels represented?** As an object keyed by criterion, e.g. `{ "S03.C08": <level> }`.
```

Elles illustrent le mécanisme de défaillance avec précision : le rendu **retire légitimement
les accents graves** (transformation n° 5) ; `<level>` se retrouve alors en **texte nu**
dans l'arbre rendu. S'il était remis à `innerHTML`, il disparaîtrait — le lecteur lirait
« Levels shown as  are placeholders ». Rendu en élément React depuis du texte, il survit.

**C'est exactement le cas que le test doit couvrir**, avec cet exemple réel plutôt qu'un
exemple fabriqué.

---

## Ce que le test d'invariant devra vérifier

1. **Égalité de comptage** — pour chacun des 33 Records : `nonBlank(source) − marqueurs
   autorisés == nonBlank(rendu)`. Un écart, même de 1, fait échouer.
2. **Survie des pseudo-balises** — les 73 séquences `<…>` présentes à la source sont
   présentes dans le texte rendu, avec **le même compte par séquence**.
3. **Opacité des blocs de code** — le contenu des 52 blocs `json` est identique à l'octet.
4. **Exhaustivité** — aucune construction hors des 11 n'apparaît dans le corpus ; si une
   apparaît, le test échoue **avant** que le rendu ne la traite au jugé.

Les points 1 et 2 portent sur le **texte**, jamais sur le HTML : c'est ce qui rend
l'invariant insensible à la mise en forme et sensible à la perte de contenu.

---

## À GRAVER

- **La liste des 11 transformations autorisées**, telle que mesurée ci-dessus.
- **Les 2 règles de frontière** : opacité des blocs de code, ordre de retrait.
- **La grandeur de l'invariant** : caractères **non blancs**, et non caractères bruts.

Une fois gravée, le rendu peut être écrit — et le test d'invariant sera écrit **avant** lui.

**Aucune ligne de rendu n'a été écrite. Aucun fichier du dépôt n'a été modifié.**
