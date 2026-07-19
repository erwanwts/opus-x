# GEO Phase A — Inventaire des FAQ (DOCUMENT DE CONTRÔLE OFFICIEL)

> **Statut : artefact de gouvernance** (gravé par l'architecte). Généré depuis les
> sections `## FAQ` des 7 Records piliers publiés. **Verbatim, groupé par page.**
>
> **Règle de contrôle** : toute nouvelle question — notamment sur la future page FAQ
> transversale (Lot 3) — DOIT être vérifiée contre cet inventaire **avant publication**.
> Aucune question ne peut dupliquer une paire déjà répondue sur une page pilier (chacune
> déjà couverte par le `FAQPage` JSON-LD de son pilier). Le `FAQPage` de la page FAQ ne
> couvrira QUE des questions inédites, absentes de ce document.
>
> Régénérer ce document à chaque ajout/modification d'une section `## FAQ` d'un pilier.

**Total : 145 questions déjà couvertes, sur 7 pages.**

## Evidence — `/en/evidence` (OCR-110) — 23 questions

- What is Evidence?
- Who produces Evidence?
- Can Evidence be modified?
- How are errors corrected?
- Can Evidence be deleted?
- Does Evidence contain a trust score?
- Where are levels defined?
- How is Criterion Levels represented?
- Why an object and not an array?
- What is the `type` field for?
- How is integrity computed?
- How is integrity verified?
- What identifier does Evidence use?
- Is Evidence verifiable without the Issuer?
- What binds Evidence to a Passport?
- Can one Evidence link to many Passport updates?
- What happens when a Framework is reinterpreted?
- Can an AI generate Evidence?
- Can a superseded Evidence be shown as current?
- Does consent deletion remove Evidence?
- What is the difference between Evidence and an Immutable Fact?
- Can Evidence reference multiple criteria?
- Is a rejected submission stored as Evidence?

## Professional Passport — `/en/professional-passport` (OCR-101) — 20 questions

- What is a Professional Passport?
- Is it the identity?
- Who owns it?
- How does it update?
- Can the professional edit it?
- Can the professional hide items?
- Does hiding delete the fact?
- Can an Issuer control it?
- Does it compute trust?
- Can two updates come from one Evidence?
- How are revocations shown?
- Is it a credential wallet?
- Is it verifiable without the Issuer?
- Who applies updates?
- Can Opus X edit updates?
- Is consent a fact?
- Can withheld items be re-disclosed?
- What does a verifier check?
- Can an AI see withheld items?
- What links an update to Evidence?

## World Skills Protocol — `/en/world-skills-protocol` (OCR-100) — 22 questions

- What is WSP?
- What are the two founding principles?
- Who produces facts?
- Who computes trust?
- Who owns identity?
- Can Opus X issue Evidence?
- Are credentials part of WSP?
- Does WSP rank people?
- What makes verification work without the issuer?
- What happens when a Framework changes?
- Is the fact store mutable?
- How are errors handled?
- How are withdrawals handled?
- What is Opus ID?
- What is a Professional Passport?
- How is trust different from Evidence?
- Can an AI participate?
- Is WSP a company or a protocol?
- What prior art does WSP relate to?
- Where is the canonical definition of each concept?
- What layer does a Trust Status belong to?
- Can an Issuer be suspended?

## Trust — `/en/trust` (OCR-105) — 20 questions

- What is Trust?
- Is it asserted?
- What are its inputs?
- How is meaning applied?
- Is it reproducible?
- Is it recomputable?
- Can an Issuer set trust?
- Can Opus X author a trust value?
- Is it reputation?
- How is it exposed?
- How is it inspected?
- What happens on revocation?
- Can facts be changed to change trust?
- Does it consume non-fact signals?
- Is it a leaderboard?
- Who computes it?
- What is it computed for?
- Can an AI invent a trust value?
- Why forbid assertion?
- What makes it trustworthy?

## Frameworks — `/en/frameworks` (OCR-115) — 20 questions

- What is a Framework?
- Who owns it?
- Where are levels defined?
- How is a Framework addressed?
- What is `wtr`?
- Does Evidence contain level definitions?
- Can an Issuer define levels?
- How does meaning evolve?
- Can a published version be edited in place?
- What happens to past Evidence when a version changes?
- What resolves a coordinate?
- Can a referenced coordinate be erased?
- Is a Framework a course?
- Does a Framework contain personal data?
- Can an AI invent a level?
- What is a criterion?
- How many Frameworks can exist?
- Who publishes versions?
- What computes against a Framework?
- Why not let levels live in Evidence?

## Registry — `/en/registry` (OCR-124) — 20 questions

- What is the Canonical Registry?
- What is an OCR?
- How many concepts per OCR?
- Is it marketing?
- How is it organized?
- Is it versioned?
- What are the statuses?
- When is an OCR Normative?
- Can definitions change silently?
- Can a referenced version be erased?
- Who governs it?
- Is it the single source of truth?
- Does it compute trust?
- Can an AI invent definitions?
- Should an AI use Draft as settled?
- Does it contain personal data?
- Where is it published?
- Why bind to implementation?
- Can it be extended?
- What makes concepts canonical?

## Verification — `/en/verification` (OCR-107) — 20 questions

- What is Verification?
- Does it contact the Issuer?
- Does it mutate facts?
- Does it recompute integrity?
- Does it respect disclosure?
- Does it reflect revocation?
- Is it reproducible?
- What starts it?
- What does it return?
- Does it prove truth?
- Can it exceed consent?
- What if the request is unauthorized?
- Which Framework version applies?
- Does it depend on Issuer uptime?
- Is the Response permanent?
- Who can verify?
- Does it see withheld facts?
- Can an AI verify?
- What underpins its trustworthiness?
- Can two verifiers disagree?
