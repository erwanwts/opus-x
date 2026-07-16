---
documentId: OCR-110
canonicalId: evidence
version: 1.0.0
sourceChecksum: sha256:384b6dec3c01d4177354424eb4bfc8ed5540e3b48a3bd90dd2ab6d9aedab0276
---

# OCR-110 — FAQ

1. **What is Evidence?** An immutable, independently verifiable professional fact produced by an authorized Issuer.
2. **Who produces Evidence?** A Certified Issuer. Never Opus X, never the professional, never an AI.
3. **Can Evidence be modified?** No. It is append-only once accepted.
4. **How are errors corrected?** By emitting a new superseding Evidence; the original is preserved.
5. **Can Evidence be deleted?** No. Withdrawals are expressed as revocation facts.
6. **Does Evidence contain a trust score?** No. Trust is computed downstream from Evidence.
7. **Where are levels defined?** In the Framework, published by Opus X — not inside Evidence.
8. **How is Criterion Levels represented?** As an object keyed by criterion, e.g. `{ "S03.C08": <level> }`.
9. **Why an object and not an array?** To preserve the criterion→level binding unambiguously.
10. **What is the `type` field for?** It is the discriminator, placed as a sibling of the body for routing.
11. **How is integrity computed?** Over the JCS-canonicalized (RFC 8785) payload.
12. **How is integrity verified?** By recomputing the digest and comparing in constant time.
13. **What identifier does Evidence use?** A ULID prefixed `ev_`.
14. **Is Evidence verifiable without the Issuer?** Yes. Independent verifiability is required.
15. **What binds Evidence to a Passport?** A uniqueness-constrained Evidence Link.
16. **Can one Evidence link to many Passport updates?** No. The link enforces one-to-one uniqueness.
17. **What happens when a Framework is reinterpreted?** Trust is recomputed; Evidence is not rewritten.
18. **Can an AI generate Evidence?** No. An AI may read it, never fabricate it.
19. **Can a superseded Evidence be shown as current?** No. Provenance and status MUST be preserved.
20. **Does consent deletion remove Evidence?** No. Consent governs disclosure, not existence.
21. **What is the difference between Evidence and an Immutable Fact?** Evidence is the concept; the Immutable Fact is its accepted, journaled record (OCR-114).
22. **Can Evidence reference multiple criteria?** Yes, within a Framework coordinate.
23. **Is a rejected submission stored as Evidence?** No. Rejection is terminal and journals no fact.
