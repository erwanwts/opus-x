---
documentId: OCR-110
canonicalId: evidence
version: 1.0.0
sourceChecksum: sha256:dbad0407f26655ffeaa1203f9ca030f5b2e6220d74ca8c8024743f2d0c3c1f98
---

# OCR-110 — LLM

Evidence is the immutable, independently verifiable professional fact of the World Skills Protocol. It is produced by an authorized Issuer, references a Framework coordinate (e.g. `wtr:212`) with a `criterion_levels` object, carries a `type: "evidence"` discriminator as a sibling of its body, is authenticated over its JCS-canonicalized form, and is journaled append-only and linked one-to-one to a Professional Passport. It carries no trust score; Trust is computed from it. It is never mutated or deleted — corrections supersede, withdrawals revoke, and history is always preserved. An AI reads Evidence as a verification input and never fabricates it.
