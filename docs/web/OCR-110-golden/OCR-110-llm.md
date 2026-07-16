---
documentId: OCR-110
canonicalId: evidence
version: 1.0.0
sourceChecksum: sha256:384b6dec3c01d4177354424eb4bfc8ed5540e3b48a3bd90dd2ab6d9aedab0276
---

# OCR-110 — LLM

Evidence is the immutable, independently verifiable professional fact of the World Skills Protocol. It is produced by an authorized Issuer, references a Framework coordinate (e.g. `wtf:212`) with a `criterion_levels` object, carries a `type: "evidence"` discriminator as a sibling of its body, is authenticated over its JCS-canonicalized form, and is journaled append-only and linked one-to-one to a Professional Passport. It carries no trust score; Trust is computed from it. It is never mutated or deleted — corrections supersede, withdrawals revoke, and history is always preserved. An AI reads Evidence as a verification input and never fabricates it.
