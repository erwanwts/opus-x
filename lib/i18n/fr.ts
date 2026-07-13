/**
 * UI FONCTIONNELLE — localisée.
 *
 * ⚠️ Les chaînes de l'OBJET Passport (séquence d'émission, phrase de vision,
 * statuts, cycle de vie, Opus ID) ne sont PAS ici : elles vivent, en anglais
 * institutionnel, dans lib/constants/passport.strings.ts. Règle de
 * localisation verrouillée (Décision 1).
 */
export const fr = {
  establish: {
    // Le TITRE reste en anglais (cas frontière) — voir passport.strings.ts
    subtitle: 'Quelques secondes suffisent. Votre Passport vous suivra toute votre carrière.',
    fullName: 'Votre nom',
    email: 'Votre email professionnel',
    privacyNote: 'Privé par défaut. Vous seul décidez de ce qui est partagé.',
    acceptTerms: "J'accepte les Conditions d'utilisation",
    acceptPrivacy: 'J’accepte la Politique de confidentialité',
    cta: 'Continuer',
    submitting: 'Établissement de votre identité…',
    consentsRequired: 'Merci d’accepter les deux documents pour continuer.',
    emailInvalid: 'Cette adresse email semble invalide.',
    nameRequired: 'Indiquez le nom qui figurera sur votre Passport.',
    error: 'Service momentanément indisponible. Votre saisie est conservée — réessayez.',
  },
  verifyEmail: {
    title: 'Vérifiez votre boîte mail',
    body: 'Nous avons envoyé un lien de connexion sécurisé à {email}. Ouvrez-le pour établir votre identité.',
    waiting: 'En attente de vérification…',
    protect: 'Cette étape protège votre identité.',
    openMailbox: 'Ouvrir ma boîte mail',
    resend: 'Renvoyer le lien',
    resendIn: 'Renvoyer dans {seconds}s',
    resent: 'Lien renvoyé. Vérifiez votre boîte mail.',
    changeEmail: 'Modifier l’email',
    expired: 'Ce lien a expiré. Nous venons de vous en préparer un nouveau.',
    spamHint: 'Rien reçu ? Pensez à vérifier vos courriers indésirables.',
  },
  dashboard: {
    welcome: 'Bienvenue, {firstName}. Voici votre Passport.',
    viewPassport: 'Voir mon Passport',
    issuedOn: 'Émis le {date}',
    lifecycleHint: 'Votre Passport progressera à mesure que des preuves rejoignent votre identité.',
    stageProgress: 'Étape {n} sur {total}',
    nextStage: 'À venir : {stage}',
    skillsEmpty: 'Vos compétences prouvées apparaîtront ici.',
    skillsCaption: 'Aucune compétence prouvée pour le moment.',
    evidenceEmpty: 'Vos partenaires pourront ajouter des preuves, en toute sécurité.',
    evidenceCount: '{count} preuve reçue',
    evidenceCountPlural: '{count} preuves reçues',
    trustHint: 'Votre confiance se construira à mesure que des preuves rejoignent votre Passport.',
    signOut: 'Se déconnecter',
    retry: 'Réessayer',
    moduleError: 'Ce module n’a pas pu se charger.',
    backToDashboard: 'Retour au Dashboard',
  },
  ceremony: {
    forLife: 'À vous, à vie.',
    discover: 'Découvrir mon Passport',
    holding: 'Nous finalisons l’émission…',
  },
  landing: {
    // Institutionnel : le produit n'essaie pas de convaincre, il énonce (§3.4).
    headline: 'Votre identité professionnelle. Prouvée. À vous.',
    subhead:
      'Un lieu qui vous appartient, où votre valeur professionnelle est prouvée, centralisée et portable — pour toute votre carrière.',
    message:
      'Vous n’ouvrez pas un compte. Vous établissez votre identité professionnelle numérique.',
    // CTA = commande d'interface fonctionnelle → localisée. Le titre EN de
    // l'Écran 2 est un headline narratif (l'objet), pas une action.
    cta: 'Établir mon identité professionnelle',
    passportCaption: 'Un actif officiel, émis par Opus X.',
    signals: {
      ownershipTitle: 'Propriété',
      ownershipBody: 'Ce que vous prouvez vous appartient — pour toujours, et vous suit partout.',
      permanenceTitle: 'Permanence',
      permanenceBody: 'Un Opus ID permanent, gravé à vie, indépendant de toute plateforme.',
      securityTitle: 'Sécurité',
      securityBody: 'Privé par défaut. Vous seul décidez de ce qui est partagé.',
    },
    footer: '© 2026 Opus X — Infrastructure d’identité professionnelle.',
  },
} as const;
