# WSP-001 Lot 0 — Inventaire complet des 101 prédicats (KG Relationships) — nom | #occ | #Rec | OCR-004 | exemples

  1. is_a  [26× · 26 Rec · OCR-004]
       e.g. World Skills Protocol (OCR-100) → Protocol
       e.g. Professional Passport (OCR-101) → Identity Surface
  2. part_of  [25× · 25 Rec · OCR-004]
       e.g. Professional Passport (OCR-101) → World Skills Protocol (OCR-100)
       e.g. Professional Identity (OCR-102) → World Skills Protocol (OCR-100)
  3. depends_on  [4× · 4 Rec · OCR-004]
       e.g. World Skills Protocol (OCR-100) → append-only fact store, Framework publication
       e.g. Evidence (OCR-110) → Framework publication of levels
  4. resolved_by  [4× · 4 Rec · —]
       e.g. Framework (OCR-115) → Framework Registry (OCR-119)
       e.g. Skill (OCR-116) → Framework Registry (OCR-119)
  5. about  [3× · 3 Rec · —]
       e.g. Verification Response (OCR-109) → Opus ID (OCR-104)
       e.g. Evidence (OCR-110) → Professional (OCR-103) via Opus ID (OCR-104)
  6. defined_by  [3× · 3 Rec · —]
       e.g. Skill (OCR-116) → Framework (OCR-115)
       e.g. Competency (OCR-117) → Framework (OCR-115)
  7. governed_by  [3× · 3 Rec · —]
       e.g. World Skills Protocol (OCR-100) → Opus X
       e.g. Framework Registry (OCR-119) → Opus X
  8. produces  [3× · 3 Rec · OCR-004]
       e.g. World Skills Protocol (OCR-100) → verifiable professional truth
       e.g. Verification (OCR-107) → Verification Response (OCR-109)
  9. references  [3× · 3 Rec · OCR-004]
       e.g. Verification Request (OCR-108) → Framework version (OCR-115)
       e.g. Evidence (OCR-110) → Framework (OCR-115) / Framework Reference (OCR-119)
 10. superseded_by  [3× · 3 Rec · —]
       e.g. Evidence (OCR-110) → Evidence (OCR-110, reflexive)
       e.g. Immutable Fact (OCR-114) → Immutable Fact (reflexive)
 11. attested_by  [2× · 2 Rec · —]
       e.g. Skill (OCR-116) → Evidence (OCR-110)
       e.g. Competency (OCR-117) → Evidence (OCR-110)
 12. basis_for  [2× · 2 Rec · —]
       e.g. Professional Identity (OCR-102) → Trust (OCR-105)
       e.g. Opus ID (OCR-104) → Trust (OCR-105), Trust Status (OCR-106)
 13. binds  [2× · 2 Rec · —]
       e.g. Professional Identity (OCR-102) → Immutable Fact (OCR-114)
       e.g. Identity (OCR-125) → Immutable Fact (OCR-114)
 14. bound_to  [2× · 2 Rec · —]
       e.g. Evidence (OCR-110) → Professional Passport (OCR-101) via Evidence Link
       e.g. Immutable Fact (OCR-114) → Professional Passport (OCR-101)
 15. bounded_by  [2× · 2 Rec · —]
       e.g. Verification Request (OCR-108) → consent (Passport, OCR-101)
       e.g. Professional Profile (OCR-123) → consent / disclosure
 16. composes  [2× · 2 Rec · —]
       e.g. Skill (OCR-116) → Capability (OCR-118)
       e.g. Capability (OCR-118) → Competency (OCR-117), Skill (OCR-116)
 17. consumed_by  [2× · 2 Rec · —]
       e.g. Evidence (OCR-110) → Trust (OCR-105) → Trust Status (OCR-106)
       e.g. Immutable Fact (OCR-114) → Trust (OCR-105)
 18. defines  [2× · 2 Rec · —]
       e.g. Framework (OCR-115) → Skill (OCR-116), Competency (OCR-117), Capability (OCR-118), Level
       e.g. Canonical Registry (OCR-124) → the protocol's concepts
 19. distinct_from  [2× · 2 Rec · —]
       e.g. Organization (OCR-122) → Professional (OCR-103)
       e.g. Professional Profile (OCR-123) → Professional Identity (OCR-102)
 20. does_not_own  [2× · 2 Rec · —]
       e.g. Issuer (OCR-120) → professional identity (OCR-104), Passport (OCR-101), Trust (OCR-105)
       e.g. Organization (OCR-122) → professional identity (OCR-102)
 21. has_property  [2× · 2 Rec · —]
       e.g. Evidence (OCR-110) → Evidence Integrity (OCR-113), Evidence Source (OCR-111)
       e.g. Immutable Fact (OCR-114) → Evidence Integrity (OCR-113), Evidence Source (OCR-111)
 22. inspected_by  [2× · 2 Rec · —]
       e.g. Trust (OCR-105) → Verification (OCR-107)
       e.g. Evidence (OCR-110) → Verification (OCR-107)
 23. named_by  [2× · 2 Rec · —]
       e.g. Professional Identity (OCR-102) → Opus ID (OCR-104)
       e.g. Identity (OCR-125) → Opus ID (OCR-104)
 24. not_a  [2× · 2 Rec · —]
       e.g. Trust (OCR-105) → reputation, social score
       e.g. Verification Response (OCR-109) → credential
 25. owned_by  [2× · 2 Rec · —]
       e.g. Professional Passport (OCR-101) → Professional (OCR-103)
       e.g. Opus ID (OCR-104) → Professional
 26. owns  [2× · 2 Rec · —]
       e.g. Professional (OCR-103) → Professional Identity (OCR-102)
       e.g. Issuer (OCR-120) → learning journey
 27. precedes  [2× · 2 Rec · —]
       e.g. Verification Request (OCR-108) → Verification Response (OCR-109)
       e.g. Evidence Lifecycle (OCR-112) → Trust (OCR-105)
 28. produced_by  [2× · 2 Rec · —]
       e.g. Verification Response (OCR-109) → Verification (OCR-107)
       e.g. Evidence (OCR-110) → Issuer (OCR-120) / Certified Issuer (OCR-121)
 29. referenced_by  [2× · 2 Rec · —]
       e.g. Opus ID (OCR-104) → Evidence (OCR-110)
       e.g. Framework (OCR-115) → Evidence (OCR-110)
 30. revoked_by  [2× · 2 Rec · —]
       e.g. Evidence (OCR-110) → Revocation fact
       e.g. Immutable Fact (OCR-114) → Immutable Fact (reflexive)
 31. supersedes  [2× · 2 Rec · OCR-004]
       e.g. Evidence (OCR-110) → Evidence (OCR-110, reflexive)
       e.g. Framework (OCR-115) → Framework version (reflexive)
 32. supports  [2× · 2 Rec · —]
       e.g. Evidence Source (OCR-111) → Verification (OCR-107), Issuer revocation
       e.g. Framework Registry (OCR-119) → Trust (OCR-105)
 33. surfaced_by  [2× · 2 Rec · —]
       e.g. Professional Identity (OCR-102) → Professional Passport (OCR-101)
       e.g. Trust Status (OCR-106) → Passport (OCR-101)
 34. accepted_form_of  [1× · 1 Rec · —]
       e.g. Immutable Fact (OCR-114) → Evidence (OCR-110)
 35. accountable_for  [1× · 1 Rec · —]
       e.g. Organization (OCR-122) → its facts and actions
 36. accumulates  [1× · 1 Rec · —]
       e.g. Professional Passport (OCR-101) → Passport update → Immutable Fact (OCR-114)
 37. anchors  [1× · 1 Rec · —]
       e.g. Opus ID (OCR-104) → Immutable Fact (OCR-114), Professional Passport (OCR-101)
 38. answers  [1× · 1 Rec · —]
       e.g. Verification Response (OCR-109) → Verification Request (OCR-108)
 39. applies  [1× · 1 Rec · —]
       e.g. Verification (OCR-107) → Framework (OCR-115)
 40. attributes_to  [1× · 1 Rec · —]
       e.g. Evidence Source (OCR-111) → Certified Issuer (OCR-121)
 41. belongs_to  [1× · 1 Rec · —]
       e.g. Professional Identity (OCR-102) → Professional (OCR-103)
 42. beneficiary_of  [1× · 1 Rec · —]
       e.g. Professional (OCR-103) → Trust (OCR-105)
 43. certified_as  [1× · 1 Rec · —]
       e.g. Issuer (OCR-120) → Certified Issuer (OCR-121)
 44. certified_by  [1× · 1 Rec · —]
       e.g. Certified Issuer (OCR-121) → Opus X
 45. checked_by  [1× · 1 Rec · —]
       e.g. Professional Passport (OCR-101) → Verification (OCR-107)
 46. clusters  [1× · 1 Rec · —]
       e.g. Competency (OCR-117) → Skill (OCR-116)
 47. computed_for  [1× · 1 Rec · —]
       e.g. Trust (OCR-105) → Opus ID (OCR-104)
 48. consumes  [1× · 1 Rec · OCR-004]
       e.g. Trust (OCR-105) → Immutable Fact (OCR-114), Evidence (OCR-110)
 49. contains  [1× · 1 Rec · —]
       e.g. Canonical Registry (OCR-124) → OCR (each defining one concept)
 50. defers_levels_to  [1× · 1 Rec · —]
       e.g. Framework Registry (OCR-119) → Framework (OCR-115)
 51. derived_from  [1× · 1 Rec · —]
       e.g. Professional Profile (OCR-123) → Professional Passport (OCR-101)
 52. does_not_grant  [1× · 1 Rec · —]
       e.g. Certified Issuer (OCR-121) → identity, trust-setting, level-definition, Passport control
 53. enables  [1× · 1 Rec · —]
       e.g. Identity (OCR-125) → Verification (OCR-107), Trust (OCR-105)
 54. exposed_as  [1× · 1 Rec · —]
       e.g. Trust (OCR-105) → Trust Status (OCR-106)
 55. exposed_by  [1× · 1 Rec · —]
       e.g. Trust Status (OCR-106) → Verification (OCR-107)
 56. gates  [1× · 1 Rec · —]
       e.g. Certified Issuer (OCR-121) → Evidence acceptance (OCR-110)
 57. governed_for_disclosure_by  [1× · 1 Rec · —]
       e.g. Professional Passport (OCR-101) → consent facts
 58. governs  [1× · 1 Rec · —]
       e.g. Professional (OCR-103) → Professional Passport (OCR-101)
 59. has_part  [1× · 1 Rec · —]
       e.g. World Skills Protocol (OCR-100) → Evidence, Trust, Framework, Identity, Verification, Issuer, Passport
 60. held_by  [1× · 1 Rec · —]
       e.g. Professional Identity (OCR-102) → Opus X
 61. holds  [1× · 1 Rec · —]
       e.g. Organization (OCR-122) → Issuer (OCR-120) / Certified Issuer (OCR-121) / verifier roles
 62. holds_for  [1× · 1 Rec · —]
       e.g. Trust Status (OCR-106) → Opus ID (OCR-104)
 63. holds_under  [1× · 1 Rec · —]
       e.g. Trust Status (OCR-106) → Framework version (OCR-115)
 64. identified_by  [1× · 1 Rec · —]
       e.g. Professional (OCR-103) → Opus ID (OCR-104)
 65. identifies  [1× · 1 Rec · —]
       e.g. Opus ID (OCR-104) → Professional Identity (OCR-102), Professional (OCR-103)
 66. initiated_by  [1× · 1 Rec · —]
       e.g. Verification (OCR-107) → Verification Request (OCR-108)
 67. initiates  [1× · 1 Rec · —]
       e.g. Verification Request (OCR-108) → Verification (OCR-107)
 68. inspects  [1× · 1 Rec · —]
       e.g. Verification (OCR-107) → Immutable Fact (OCR-114)
 69. instantiated_by  [1× · 1 Rec · —]
       e.g. Identity (OCR-125) → Professional Identity (OCR-102), Organization (OCR-122)
 70. interpreted_against  [1× · 1 Rec · —]
       e.g. Trust (OCR-105) → Framework (OCR-115)
 71. layered_into  [1× · 1 Rec · —]
       e.g. Canonical Registry (OCR-124) → 100s / 200s / 300s
 72. links_to  [1× · 1 Rec · —]
       e.g. Evidence Lifecycle (OCR-112) → Professional Passport (OCR-101)
 73. maps  [1× · 1 Rec · —]
       e.g. Framework Registry (OCR-119) → Criterion → Coordinate
 74. must_agree_with  [1× · 1 Rec · —]
       e.g. Canonical Registry (OCR-124) → implementation
 75. names  [1× · 1 Rec · —]
       e.g. Verification Request (OCR-108) → Opus ID (OCR-104)
 76. orders  [1× · 1 Rec · —]
       e.g. Evidence Lifecycle (OCR-112) → Evidence (OCR-110), Evidence Integrity (OCR-113)
 77. output_of  [1× · 1 Rec · —]
       e.g. Trust Status (OCR-106) → Trust (OCR-105)
 78. presents  [1× · 1 Rec · —]
       e.g. Professional Profile (OCR-123) → Immutable Fact (OCR-114), Trust (OCR-105)
 79. preserved_by  [1× · 1 Rec · —]
       e.g. Evidence Source (OCR-111) → Immutable Fact (OCR-114)
 80. produces_accepted  [1× · 1 Rec · —]
       e.g. Certified Issuer (OCR-121) → Immutable Fact (OCR-114)
 81. produces_at_acceptance  [1× · 1 Rec · —]
       e.g. Evidence Lifecycle (OCR-112) → Immutable Fact (OCR-114)
 82. produces_when_issuer  [1× · 1 Rec · —]
       e.g. Organization (OCR-122) → Evidence (OCR-110)
 83. property_of  [1× · 1 Rec · —]
       e.g. Evidence Integrity (OCR-113) → Immutable Fact (OCR-114)
 84. protects  [1× · 1 Rec · —]
       e.g. Evidence Integrity (OCR-113) → Evidence (OCR-110)
 85. provenance_of  [1× · 1 Rec · —]
       e.g. Evidence Source (OCR-111) → Evidence (OCR-110)
 86. published_by  [1× · 1 Rec · —]
       e.g. Framework (OCR-115) → Opus X
 87. queried_by  [1× · 1 Rec · —]
       e.g. Framework Registry (OCR-119) → Evidence ingestion (OCR-110), Verification (OCR-107)
 88. reads  [1× · 1 Rec · —]
       e.g. Verification (OCR-107) → Trust (OCR-105)
 89. recomputes  [1× · 1 Rec · —]
       e.g. Verification (OCR-107) → Evidence Integrity (OCR-113)
 90. related_to  [1× · 1 Rec · OCR-004]
       e.g. World Skills Protocol (OCR-100) → Verifiable Credentials, DID Core, Open Badges (as prior art, not equivalents)
 91. relied_on_by  [1× · 1 Rec · —]
       e.g. Evidence Integrity (OCR-113) → Verification (OCR-107), Trust (OCR-105)
 92. reports  [1× · 1 Rec · —]
       e.g. Verification Response (OCR-109) → Trust (OCR-105), confirmed Evidence Integrity (OCR-113)
 93. resolves  [1× · 1 Rec · —]
       e.g. Framework Registry (OCR-119) → Framework (OCR-115) coordinates and criteria
 94. separates  [1× · 1 Rec · —]
       e.g. World Skills Protocol (OCR-100) → production (Issuer) from verification (Opus X)
 95. standing_computed_from  [1× · 1 Rec · —]
       e.g. Capability (OCR-118) → Immutable Fact (OCR-114) via Trust (OCR-105)
 96. state  [1× · 1 Rec · —]
       e.g. Certified Issuer (OCR-121) → Applicant | Certified | Suspended | Revoked
 97. subject_of  [1× · 1 Rec · —]
       e.g. Professional (OCR-103) → Evidence (OCR-110)
 98. surfaces  [1× · 1 Rec · —]
       e.g. Professional Passport (OCR-101) → Opus ID (OCR-104), Trust (OCR-105)
 99. used_by  [1× · 1 Rec · —]
       e.g. Framework (OCR-115) → Trust (OCR-105)
100. validated_by  [1× · 1 Rec · —]
       e.g. Evidence Integrity (OCR-113) → non-ASCII conformance test
101. works_with  [1× · 1 Rec · —]
       e.g. Evidence Source (OCR-111) → Evidence Integrity (OCR-113)
