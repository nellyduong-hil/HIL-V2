/* ═══════════════════════════════════════════════════════════════════════════
   dashboard.js — Home in Love | Plan de Vol Client
   Requires: auth.js
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────
   CONFIG TYPES DE PROJETS
   ───────────────────────────────────────────────────────────────────────── */
const PROJECT_TYPES = {
  'location':      { label: 'Recherche Location',  color: '#1e63f0', bg: 'rgba(30,99,240,0.09)'   },
  'achat':         { label: 'Recherche Achat',      color: '#0ba592', bg: 'rgba(11,165,146,0.09)'  },
  'investissement':{ label: 'Achat Investissement', color: '#7c3aed', bg: 'rgba(124,58,237,0.09)'  },
  'mise-location': { label: 'Mise en Location',     color: '#c47a00', bg: 'rgba(196,122,0,0.09)'   },
  'vente':         { label: 'Mise en Vente',        color: '#16a34a', bg: 'rgba(22,163,74,0.09)'   },
  'renovation':    { label: 'Rénovation',           color: '#e02424', bg: 'rgba(224,36,36,0.09)'   },
  'passoire':      { label: 'Passoire Energetique',      color: '#f59e0b', bg: 'rgba(245,158,11,0.09)' },
  'bureau':        { label: 'Transformation Bureau',   color: '#6366f1', bg: 'rgba(99,102,241,0.09)'  },
};

/* ─────────────────────────────────────────────────────────────────────────
   CONFIG EXPERTISES (ex-Boucliers)
   ───────────────────────────────────────────────────────────────────────── */
const EXPERTISES = {
  financier: {
    label   : 'Expertise Financière',
    icon    : '💶',
    prix    : 590,
    slogan  : 'Ne laissez pas un centime sur la table.',
    titre   : 'Sécurisez votre Plan de Financement & vos Aides.',
    desc    : 'L\'ingénierie financière est le moteur de votre projet. Nos experts analysent vos droits (MaPrimeRénov\', PTZ, Action Logement, Fiscalité LMNP) pour maximiser votre budget et garantir l\'accord bancaire. Ne laissez pas un centime sur la table.',
    cta     : 'Débloquer mes aides — 590€',
    couleur : '#1e63f0',
  },
  juridique: {
    label   : 'Expertise Juridique',
    icon    : '⚖️',
    prix    : 590,
    slogan  : 'Vous ne signerez rien sans qu\'on ait tout lu.',
    titre   : 'Blindez votre Engagement.',
    desc    : 'Zonage PLU, servitudes, conformité du bail ou du compromis : nous passons votre dossier au crible du droit immobilier. Évitez les recours et les vices cachés avant de signer. Votre tranquillité n\'a pas de prix.',
    cta     : 'Signer en toute sécurité — 590€',
    couleur : '#7c3aed',
  },
  technique: {
    label   : 'Expertise Technique',
    icon    : '🔧',
    prix    : 590,
    slogan  : 'Aucun vice caché ni travaux imposés ne passera.',
    titre   : 'Expertise Bâtiment & Travaux.',
    desc    : 'Audit DPE, pathologie des structures et mise en concurrence réelle des artisans RGE. Nous certifions l\'état technique du bien et la justesse des devis pour éviter les mauvaises surprises sur le chantier.',
    cta     : 'Certifier la technique — 590€',
    couleur : '#c47a00',
  },
   administratif: {
  label   : 'Expertise Administrative',
  icon    : '📋',
  prix    : 590,
  slogan  : 'Chaque dossier, chaque délai, chaque obligation maîtrisés.',
  titre   : 'Sécurisez vos Démarches Administratives.',
  desc    : 'Permis, déclarations, dossiers de subvention : nous gérons chaque obligation administrative pour que rien ne bloque votre projet. Délais respectés, dossiers complets.',
  cta     : 'Sécuriser mes démarches — 590€',
  couleur : '#6366f1',
},
};

/* ─────────────────────────────────────────────────────────────────────────
   STATUTS DES PHASES
   ───────────────────────────────────────────────────────────────────────── */
const PHASE_STATUS = {
  done:    { label: 'Validé ✓',              color: '#16a34a', bg: 'rgba(22,163,74,0.09)',    dot: '#16a34a', pulse: false },
  active:  { label: 'Pilote en cours',        color: '#1e63f0', bg: 'rgba(30,99,240,0.09)',    dot: '#1e63f0', pulse: true  },
  late:    { label: 'Action client requise',  color: '#c47a00', bg: 'rgba(196,122,0,0.09)',    dot: '#c47a00', pulse: true  },
  locked:  { label: 'Non sécurisé 🔒',       color: '#e02424', bg: 'rgba(224,36,36,0.09)',    dot: '#e02424', pulse: false },
  pending: { label: 'À venir',               color: '#8494b8', bg: 'rgba(132,148,184,0.09)', dot: '#8494b8', pulse: false },
};

/* Statuts sous-missions (feux de signalisation) */
const MISSION_STATUS = {
  done:    { label: 'Validé',               color: '#16a34a', bg: 'rgba(22,163,74,0.09)',    cls: 'ms-done'    },
  active:  { label: 'Pilote en cours',       color: '#1e63f0', bg: 'rgba(30,99,240,0.09)',    cls: 'ms-active'  },
  pending: { label: 'À venir',              color: '#8494b8', bg: 'rgba(132,148,184,0.09)', cls: 'ms-pending' },
  client:  { label: 'Action client requise', color: '#c47a00', bg: 'rgba(196,122,0,0.09)',    cls: 'ms-client'  },
  late:    { label: 'En retard',            color: '#e02424', bg: 'rgba(224,36,36,0.09)',    cls: 'ms-late'    },
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPER DATES
   ───────────────────────────────────────────────────────────────────────── */
function addDays(base, days) {
  var d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function fmtDate(iso) {
  if (!iso) return '—';
  var d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  var d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ─────────────────────────────────────────────────────────────────────────
   MATRICE DES PHASES (7 phases × 8 types de projets)
   start = date de création du projet
   ───────────────────────────────────────────────────────────────────────── */
function buildPhases(type, start) {
  var s = start || '2026-01-01';

  var PHASES = {
    location: [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'L1-1', title:'Définition du projet', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'L1-2', title:'Définition du budget', responsable:'Moi', statut:'done', deadline: addDays(s,1) },
          { id:'L1-3', title:'Problématiques rencontrées', responsable:'Cabinet', statut:'done', deadline: addDays(s,2) },
          { id:'L1-4', title:'Définition cahier des charges', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'done',
        expertises: ['juridique','financier'],
        missions: [
          { id:'L2-1', title:'Vérification éligibilité aides (Visale, Loca-Pass, APL/ALS)', responsable:'Cabinet', statut:'done', deadline: addDays(s,7) },
          { id:'L2-2', title:'Dépôt des dossiers d\'aides', responsable:'Cabinet', statut:'done', deadline: addDays(s,10) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'active',
        expertises: ['technique'],
        missions: [
          { id:'L3-1', title:'Préparation du dossier locataire complet (dossier facile)', responsable:'Moi', statut:'active', deadline: addDays(s,12) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'L4-1', title:'Recherche des logements disponibles', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'L4-2', title:'Dépôt des dossiers pour demande de visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,16) },
          { id:'L4-3', title:'Organisation des visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,18) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'L5-1', title:'Réalisation des visites', responsable:'Moi', statut:'pending', deadline: addDays(s,21) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique'],
        missions: [
          { id:'L6-1', title:'Dossier accepté — demande finale', responsable:'Cabinet', statut:'pending', deadline: addDays(s,30) },
          { id:'L6-2', title:'Vérification Visale/Loca-Pass', responsable:'Cabinet', statut:'pending', deadline: addDays(s,32) },
          { id:'L6-3', title:'Vérification conformité du bail', responsable:'Cabinet', statut:'pending', deadline: addDays(s,35) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'L7-1', title:'Demande CAF', responsable:'Moi', statut:'pending', deadline: addDays(s,60) },
          { id:'L7-2', title:'Signature du bail', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
          { id:'L7-3', title:'État des lieux d\'entrée', responsable:'Cabinet', statut:'pending', deadline: addDays(s,65) },
        ]
      },
    ],

    achat: [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'A1-1', title:'Définition du projet', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'A1-2', title:'Définition des besoins et problématiques rencontrées', responsable:'Cabinet', statut:'done', deadline: addDays(s,1) },
          { id:'A1-3', title:'Définition du budget', responsable:'Moi', statut:'done', deadline: addDays(s,2) },
          { id:'A1-4', title:'Définition cahier des charges', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'done',
        expertises: ['financier','juridique'],
        missions: [
          { id:'A2-1', title:'Capacité d\'emprunt', responsable:'Cabinet', statut:'done', deadline: addDays(s,7) },
          { id:'A2-2', title:'Vérification éligibilité aides (PTZ, Action Logement, TVA réduite)', responsable:'Cabinet', statut:'done', deadline: addDays(s,8) },
          { id:'A2-3', title:'Dépôt des dossiers d\'aides', responsable:'Cabinet', statut:'done', deadline: addDays(s,10) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'active',
        expertises: ['technique'],
        missions: [
          { id:'A3-1', title:'Simulation et accord de principe bancaire', responsable:'Prestataire', statut:'active', deadline: addDays(s,12) },
          { id:'A3-2', title:'Intégration des aides dans le plan de financement', responsable:'Cabinet', statut:'active', deadline: addDays(s,14) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'A4-1', title:'Recherche des biens', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'A4-2', title:'Demande d\'informations complémentaires', responsable:'Cabinet', statut:'pending', deadline: addDays(s,16) },
          { id:'A4-3', title:'Sélection et organisation des visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,18) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'A5-1', title:'Réalisation des visites', responsable:'Moi', statut:'pending', deadline: addDays(s,21) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique','financier'],
        missions: [
          { id:'A6-1', title:'Analyse de la valeur marché', responsable:'Cabinet', statut:'pending', deadline: addDays(s,30) },
          { id:'A6-2', title:'Négociation du prix', responsable:'Cabinet', statut:'pending', deadline: addDays(s,32) },
          { id:'A6-3', title:'Offre d\'achat', responsable:'Cabinet', statut:'pending', deadline: addDays(s,33) },
          { id:'A6-4', title:'Signature du Compromis', responsable:'Cabinet', statut:'pending', deadline: addDays(s,35) },
          { id:'A6-5', title:'Obtention du financement', responsable:'Prestataire', statut:'pending', deadline: addDays(s,40) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'A7-1', title:'Signature de l\'acte authentique', responsable:'Cabinet', statut:'pending', deadline: addDays(s,60) },
          { id:'A7-2', title:'Remise des clés', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
        ]
      },
    ],

    investissement: [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'I1-1', title:'Définition du projet', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'I1-2', title:'Définition des besoins et problématiques', responsable:'Cabinet', statut:'done', deadline: addDays(s,1) },
          { id:'I1-3', title:'Définition du budget', responsable:'Moi', statut:'done', deadline: addDays(s,2) },
          { id:'I1-4', title:'Cahier des charges investisseur', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'active',
        expertises: ['financier','juridique'],
        missions: [
          { id:'I2-1', title:'Définition de la stratégie (Rendement vs Patrimonial)', responsable:'Cabinet', statut:'done', deadline: addDays(s,5) },
          { id:'I2-2', title:'Zone géographique cible', responsable:'Cabinet', statut:'done', deadline: addDays(s,6) },
          { id:'I2-3', title:'Type de bien (Studio, Coloc, Immeuble de rapport)', responsable:'Moi', statut:'active', deadline: addDays(s,7) },
          { id:'I2-4', title:'Analyse de la fiscalité (LMNP Réel, SCI, Pinel/Denormandie)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,8) },
          { id:'I2-5', title:'Vérification éligibilité aides (Loc\'Avantages, ANAH)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,10) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'locked',
        expertises: ['financier','technique'],
        missions: [
          { id:'I3-1', title:'Capacité d\'emprunt investisseur', responsable:'Cabinet', statut:'pending', deadline: addDays(s,12) },
          { id:'I3-2', title:'Simulation de rentabilité brute/nette/nette-nette', responsable:'Cabinet', statut:'pending', deadline: addDays(s,13) },
          { id:'I3-3', title:'Montage du dossier bancaire "Investisseur"', responsable:'Prestataire', statut:'pending', deadline: addDays(s,14) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'I4-1', title:'Chasse immobilière (Focus Market & Off-Market)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'I4-2', title:'Analyse des annonces selon le prix au €m² et la tension locative', responsable:'Cabinet', statut:'pending', deadline: addDays(s,16) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'I5-1', title:'Visites avec focus technique', responsable:'Cabinet', statut:'pending', deadline: addDays(s,21) },
          { id:'I5-2', title:'Audit des travaux nécessaires pour la mise en location', responsable:'Cabinet', statut:'pending', deadline: addDays(s,22) },
          { id:'I5-3', title:'Estimation du futur loyer', responsable:'Cabinet', statut:'pending', deadline: addDays(s,23) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique','financier'],
        missions: [
          { id:'I6-1', title:'Analyse des PV de copropriété (travaux à venir)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,30) },
          { id:'I6-2', title:'Offre d\'achat et négociation', responsable:'Cabinet', statut:'pending', deadline: addDays(s,32) },
          { id:'I6-3', title:'Signature du compromis', responsable:'Cabinet', statut:'pending', deadline: addDays(s,35) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'I7-1', title:'Obtention définitive du prêt', responsable:'Prestataire', statut:'pending', deadline: addDays(s,58) },
          { id:'I7-2', title:'Signature de l\'acte authentique', responsable:'Cabinet', statut:'pending', deadline: addDays(s,60) },
          { id:'I7-3', title:'Mise en place du Carnet d\'Information (CIL)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
          { id:'I7-4', title:'Remise des clés', responsable:'Cabinet', statut:'pending', deadline: addDays(s,63) },
        ]
      },
    ],

    'mise-location': [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'ML1-1', title:'Définition des besoins', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'ML1-2', title:'Estimation Loyer Prix du marché', responsable:'Cabinet', statut:'done', deadline: addDays(s,1) },
          { id:'ML1-3', title:'Problématique rencontrée', responsable:'Cabinet', statut:'done', deadline: addDays(s,2) },
          { id:'ML1-4', title:'Définition cahier des charges', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'done',
        expertises: ['financier','juridique','administratif'],
        missions: [
          { id:'ML2-1', title:'Estimation Précis du loyer (Encadrement, augmentation loyer, la loi)', responsable:'Cabinet', statut:'done', deadline: addDays(s,7) },
          { id:'ML2-2', title:'Vérification éligibilité aides (Loc\'Avantages, ANAH)', responsable:'Cabinet', statut:'done', deadline: addDays(s,8) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'active',
        expertises: ['technique'],
        missions: [
          { id:'ML3-1', title:'Préparation et mise en valeur du bien', responsable:'Cabinet', statut:'done', deadline: addDays(s,10) },
          { id:'ML3-2', title:'Réalisation des diagnostics (DPE, etc.)', responsable:'Prestataire', statut:'active', deadline: addDays(s,12) },
          { id:'ML3-3', title:'Rédaction de l\'annonce et photos', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'ML3-4', title:'Publication de l\'annonce', responsable:'Cabinet', statut:'pending', deadline: addDays(s,15) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'ML4-1', title:'Sélection des candidats', responsable:'Cabinet', statut:'pending', deadline: addDays(s,21) },
          { id:'ML4-2', title:'Organisation des visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,22) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'ML5-1', title:'Réalisation des visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,28) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique'],
        missions: [
          { id:'ML6-1', title:'Étude approfondie des dossiers', responsable:'Cabinet', statut:'pending', deadline: addDays(s,35) },
          { id:'ML6-2', title:'Rédaction du bail conforme', responsable:'Cabinet', statut:'pending', deadline: addDays(s,37) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'ML7-1', title:'État des lieux d\'entrée', responsable:'Cabinet', statut:'pending', deadline: addDays(s,60) },
          { id:'ML7-2', title:'Remise des clés', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
        ]
      },
    ],

    vente: [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'V1-1', title:'Définition des besoins', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'V1-2', title:'Estimation Prix du marché', responsable:'Cabinet', statut:'done', deadline: addDays(s,1) },
          { id:'V1-3', title:'Problématique rencontrée', responsable:'Cabinet', statut:'done', deadline: addDays(s,2) },
          { id:'V1-4', title:'Définition cahier des charges', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'done',
        expertises: ['financier','juridique'],
        missions: [
          { id:'V2-1', title:'Estimation plus précise du bien', responsable:'Cabinet', statut:'done', deadline: addDays(s,7) },
          { id:'V2-2', title:'Vérification éligibilité aides (Exonération plus-value, abattements)', responsable:'Cabinet', statut:'done', deadline: addDays(s,8) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'active',
        expertises: ['technique'],
        missions: [
          { id:'V3-1', title:'Préparation et mise en valeur du bien', responsable:'Cabinet', statut:'done', deadline: addDays(s,10) },
          { id:'V3-2', title:'Réalisation des diagnostics obligatoires', responsable:'Prestataire', statut:'active', deadline: addDays(s,12) },
          { id:'V3-3', title:'Rédaction de l\'annonce et photos', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'V3-4', title:'Publication', responsable:'Cabinet', statut:'pending', deadline: addDays(s,15) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'V4-1', title:'Gestion des appels', responsable:'Cabinet', statut:'pending', deadline: addDays(s,18) },
          { id:'V4-2', title:'Validation du financement avant visite', responsable:'Cabinet', statut:'pending', deadline: addDays(s,19) },
          { id:'V4-3', title:'Éviter la prospection commerciale et les curieux', responsable:'Cabinet', statut:'pending', deadline: addDays(s,20) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'V5-1', title:'Réalisation des visites', responsable:'Cabinet', statut:'pending', deadline: addDays(s,25) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique','financier'],
        missions: [
          { id:'V6-1', title:'Réception et analyse des offres', responsable:'Cabinet', statut:'pending', deadline: addDays(s,35) },
          { id:'V6-2', title:'Acceptation d\'offre', responsable:'Moi', statut:'pending', deadline: addDays(s,36) },
          { id:'V6-3', title:'Signature du compromis', responsable:'Cabinet', statut:'pending', deadline: addDays(s,38) },
          { id:'V6-4', title:'Suivi rétractation', responsable:'Cabinet', statut:'pending', deadline: addDays(s,48) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'V7-1', title:'Signature de l\'acte authentique', responsable:'Cabinet', statut:'pending', deadline: addDays(s,60) },
          { id:'V7-2', title:'Remise des clés', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
        ]
      },
    ],

    renovation: [
      {
        id: 'P1', title: 'Définition & Audit', deadline: s, status: 'done',
        expertises: [],
        missions: [
          { id:'R1-1', title:'Définition du projet', responsable:'Cabinet', statut:'done', deadline: addDays(s,0) },
          { id:'R1-2', title:'Définition des besoins', responsable:'Cabinet', statut:'done', deadline: addDays(s,1) },
          { id:'R1-3', title:'Problématique rencontrée', responsable:'Cabinet', statut:'done', deadline: addDays(s,2) },
          { id:'R1-4', title:'Définition cahier des charges', responsable:'Cabinet', statut:'done', deadline: addDays(s,3) },
        ]
      },
      {
        id: 'P2', title: 'Ingénierie & Aides', deadline: addDays(s,7), status: 'active',
        expertises: ['financier','juridique','administratif'],
        missions: [
          { id:'R2-1', title:'Définition du projet et des travaux', responsable:'Cabinet', statut:'done', deadline: addDays(s,5) },
          { id:'R2-2', title:'Éligibilité aides (MPR, Éco-PTZ, CEE, TVA 5.5)', responsable:'Cabinet', statut:'active', deadline: addDays(s,7) },
          { id:'R2-3', title:'Montage des dossiers d\'aides', responsable:'Cabinet', statut:'pending', deadline: addDays(s,9) },
          { id:'R2-4', title:'Estimation du budget au prix de marché', responsable:'Cabinet', statut:'pending', deadline: addDays(s,10) },
        ]
      },
      {
        id: 'P3', title: 'Préparation, Financement & Mise en Marché', deadline: addDays(s,7), status: 'locked',
        expertises: ['technique'],
        missions: [
          { id:'R3-1', title:'Création du cahier des charges de consultation', responsable:'Cabinet', statut:'pending', deadline: addDays(s,14) },
          { id:'R3-2', title:'Mise en concurrence artisans', responsable:'Cabinet', statut:'pending', deadline: addDays(s,16) },
          { id:'R3-3', title:'Obtention des devis', responsable:'Prestataire', statut:'pending', deadline: addDays(s,18) },
          { id:'R3-4', title:'Sélection prestataires', responsable:'Moi', statut:'pending', deadline: addDays(s,20) },
        ]
      },
      {
        id: 'P4', title: 'Opérations Terrain', deadline: addDays(s,14), status: 'pending',
        expertises: [],
        missions: [
          { id:'R4-1', title:'Demande de permis / DP si besoin', responsable:'Cabinet', statut:'pending', deadline: addDays(s,21) },
          { id:'R4-2', title:'Suivi du chantier, lien avec le cahier des charges', responsable:'Cabinet', statut:'pending', deadline: addDays(s,25) },
        ]
      },
      {
        id: 'P5', title: 'Validation & Analyse', deadline: addDays(s,14), status: 'pending',
        expertises: ['technique'],
        missions: [
          { id:'R5-1', title:'Réception des travaux en lien avec le cahier des charges', responsable:'Cabinet', statut:'pending', deadline: addDays(s,45) },
          { id:'R5-2', title:'Vérification conformité si besoin', responsable:'Cabinet', statut:'pending', deadline: addDays(s,47) },
        ]
      },
      {
        id: 'P6', title: 'Engagement Juridique', deadline: addDays(s,30), status: 'pending',
        expertises: ['juridique','financier','technique'],
        missions: [
          { id:'R6-1', title:'Transmission justificatifs pour déblocage aides', responsable:'Moi', statut:'pending', deadline: addDays(s,50) },
          { id:'R6-2', title:'Vérification conformité', responsable:'Cabinet', statut:'pending', deadline: addDays(s,52) },
          { id:'R6-3', title:'Levée des réserves', responsable:'Cabinet', statut:'pending', deadline: addDays(s,54) },
        ]
      },
      {
        id: 'P7', title: 'Closing & Remise des clés', deadline: addDays(s,60), status: 'pending',
        expertises: ['administratif'],
        missions: [
          { id:'R7-1', title:'Bilan final', responsable:'Cabinet', statut:'pending', deadline: addDays(s,60) },
          { id:'R7-2', title:'Mise en place du Carnet d\'Information Logement (CIL)', responsable:'Cabinet', statut:'pending', deadline: addDays(s,62) },
          { id:'R7-3', title:'Clôture du chantier', responsable:'Cabinet', statut:'pending', deadline: addDays(s,65) },
        ]
      },
    ],

passoire: [
  { id:'P1', title:'Audit & Diagnostic', deadline:s, status:'done',
    expertises:[],
    missions:[
      { id:'PS1-1', title:'DPE de départ', responsable:'Prestataire', statut:'done', deadline:addDays(s,0) },
      { id:'PS1-2', title:'Audit énergétique obligatoire', responsable:'Cabinet', statut:'done', deadline:addDays(s,2) },
      { id:'PS1-3', title:'Vérification de la structure', responsable:'Cabinet', statut:'done', deadline:addDays(s,3) },
    ]},
  { id:'P2', title:'Ingénierie Financière', deadline:addDays(s,7), status:'active',
    expertises:['financier','juridique'],
    missions:[
      { id:'PS2-1', title:'Calcul MaPrimeRénov\'', responsable:'Cabinet', statut:'active', deadline:addDays(s,7) },
      { id:'PS2-2', title:'Calcul CEE', responsable:'Cabinet', statut:'pending', deadline:addDays(s,8) },
      { id:'PS2-3', title:'Calcul Éco-PTZ', responsable:'Cabinet', statut:'pending', deadline:addDays(s,9) },
      { id:'PS2-4', title:'Objectif : réduire le reste à charge au minimum', responsable:'Cabinet', statut:'pending', deadline:addDays(s,10) },
    ]},
  { id:'P3', title:'Sélection RGE & Devis', deadline:addDays(s,7), status:'locked',
    expertises:['technique'],
    missions:[
      { id:'PS3-1', title:'Mise en concurrence artisans certifiés RGE', responsable:'Cabinet', statut:'pending', deadline:addDays(s,14) },
      { id:'PS3-2', title:'Vérification des assurances décennales', responsable:'Cabinet', statut:'pending', deadline:addDays(s,16) },
    ]},
  { id:'P4', title:'Administratif & Urbanisme', deadline:addDays(s,14), status:'pending',
    expertises:[],
    missions:[
      { id:'PS4-1', title:'Déclaration préalable (si modification façade/fenêtres)', responsable:'Cabinet', statut:'pending', deadline:addDays(s,21) },
    ]},
  { id:'P5', title:'Suivi de Chantier', deadline:addDays(s,14), status:'pending',
    expertises:['technique'],
    missions:[
      { id:'PS5-1', title:'Visites de contrôle', responsable:'Cabinet', statut:'pending', deadline:addDays(s,30) },
      { id:'PS5-2', title:'Respect du planning thermique', responsable:'Cabinet', statut:'pending', deadline:addDays(s,45) },
    ]},
  { id:'P6', title:'Certification & Réception', deadline:addDays(s,30), status:'pending',
    expertises:['juridique'],
    missions:[
      { id:'PS6-1', title:'Nouveau DPE — vérification du saut de classe (G à C ou B)', responsable:'Prestataire', statut:'pending', deadline:addDays(s,60) },
      { id:'PS6-2', title:'Levée des réserves', responsable:'Cabinet', statut:'pending', deadline:addDays(s,62) },
    ]},
  { id:'P7', title:'Relocation & CIL', deadline:addDays(s,60), status:'pending',
    expertises:[],
    missions:[
      { id:'PS7-1', title:'Mise à jour du Carnet d\'Information (obligatoire)', responsable:'Cabinet', statut:'pending', deadline:addDays(s,65) },
      { id:'PS7-2', title:'Nouveau bail ou mise en place de la gestion', responsable:'Cabinet', statut:'pending', deadline:addDays(s,67) },
    ]},
],

bureau: [
  { id:'P1', title:'Audit & Diagnostic', deadline:s, status:'done',
    expertises:[],
    missions:[
      { id:'B1-1', title:'Analyse du PLU (Plan Local d\'Urbanisme)', responsable:'Cabinet', statut:'done', deadline:addDays(s,0) },
      { id:'B1-2', title:'Vérification du règlement de copropriété', responsable:'Cabinet', statut:'done', deadline:addDays(s,2) },
    ]},
  { id:'P2', title:'Ingénierie Financière', deadline:addDays(s,7), status:'active',
    expertises:['juridique','financier'],
    missions:[
      { id:'B2-1', title:'Modèle de rentabilité — calcul de la plus-value latente', responsable:'Cabinet', statut:'active', deadline:addDays(s,7) },
      { id:'B2-2', title:'Montage fiscal (LMNP/SCI)', responsable:'Cabinet', statut:'pending', deadline:addDays(s,10) },
    ]},
  { id:'P3', title:'Plans & Architecture', deadline:addDays(s,7), status:'locked',
    expertises:['technique'],
    missions:[
      { id:'B3-1', title:'Relevé de l\'existant', responsable:'Prestataire', statut:'pending', deadline:addDays(s,14) },
      { id:'B3-2', title:'Plans de coupes', responsable:'Prestataire', statut:'pending', deadline:addDays(s,16) },
      { id:'B3-3', title:'Schémas des futurs réseaux (eau/élec)', responsable:'Prestataire', statut:'pending', deadline:addDays(s,18) },
    ]},
  { id:'P4', title:'Autorisations & Urbanisme', deadline:addDays(s,14), status:'pending',
    expertises:['juridique'],
    missions:[
      { id:'B4-1', title:'Changement de destination — permis de construire ou DP', responsable:'Cabinet', statut:'pending', deadline:addDays(s,21) },
      { id:'B4-2', title:'Phase critique — suivi instruction', responsable:'Cabinet', statut:'pending', deadline:addDays(s,35) },
    ]},
  { id:'P5', title:'Consultation Entreprises', deadline:addDays(s,14), status:'pending',
    expertises:['technique'],
    missions:[
      { id:'B5-1', title:'Devis cloisonnement', responsable:'Prestataire', statut:'pending', deadline:addDays(s,40) },
      { id:'B5-2', title:'Devis isolation phonique', responsable:'Prestataire', statut:'pending', deadline:addDays(s,42) },
      { id:'B5-3', title:'Devis réseaux', responsable:'Prestataire', statut:'pending', deadline:addDays(s,44) },
    ]},
  { id:'P6', title:'Réalisation & Contrôle', deadline:addDays(s,30), status:'pending',
    expertises:['juridique','financier','technique'],
    missions:[
      { id:'B6-1', title:'Suivi des travaux lourds', responsable:'Cabinet', statut:'pending', deadline:addDays(s,60) },
      { id:'B6-2', title:'Mise en conformité sécurité/incendie', responsable:'Cabinet', statut:'pending', deadline:addDays(s,70) },
    ]},
  { id:'P7', title:'Mise en Marché & CIL', deadline:addDays(s,60), status:'pending',
    expertises:[],
    missions:[
      { id:'B7-1', title:'Création du CIL (indispensable pour les futurs acheteurs)', responsable:'Cabinet', statut:'pending', deadline:addDays(s,80) },
      { id:'B7-2', title:'Vente ou location du bien transformé', responsable:'Cabinet', statut:'pending', deadline:addDays(s,85) },
    ]},
],
  },
   
  return PHASES[type] || PHASES['location'];
};

/* ─────────────────────────────────────────────────────────────────────────
   DOCUMENTS PAR TYPE DE PROJET
   ───────────────────────────────────────────────────────────────────────── */
const DOCS_BY_TYPE = {
  location: [
    { section: 'Documents Personnels', docs: [
      { id:'d1', label:'Pièce d\'identité (recto/verso)', statut:'recu' },
      { id:'d2', label:'3 derniers bulletins de salaire', statut:'recu' },
      { id:'d3', label:'Dernier avis d\'imposition', statut:'recu' },
      { id:'d4', label:'3 derniers relevés bancaires', statut:'recu' },
      { id:'d5', label:'Contrat de travail', statut:'recu' },
      { id:'d6', label:'Justificatif de domicile actuel', statut:'recu' },
    ]},
    { section: 'Documents Aides', docs: [
      { id:'d7', label:'Dossier Visale', statut:'attente' },
      { id:'d8', label:'Dossier CAF / APL', statut:'attente' },
    ]},
  ],
  achat: [
    { section: 'Documents Personnels', docs: [
      { id:'d1', label:'Pièce d\'identité (recto/verso)', statut:'recu' },
      { id:'d2', label:'3 derniers bulletins de salaire', statut:'recu' },
      { id:'d3', label:'Dernier avis d\'imposition', statut:'recu' },
      { id:'d4', label:'3 derniers relevés bancaires', statut:'recu' },
      { id:'d5', label:'Contrat de travail', statut:'recu' },
      { id:'d6', label:'Justificatif de domicile actuel', statut:'recu' },
    ]},
    { section: 'Documents Solvabilité', docs: [
      { id:'d7', label:'Accord de principe bancaire', statut:'recu' },
      { id:'d8', label:'Justificatif d\'apport', statut:'recu' },
    ]},
    { section: 'Documents CIL / Audit Pré-achat', docs: [
      { id:'d9',  label:'État des diagnostics (DPE, Amiante, Plomb, ERP)', statut:'recu' },
      { id:'d10', label:'PV des 3 dernières Assemblées Générales', statut:'attente' },
      { id:'d11', label:'Règlement de copropriété', statut:'attente' },
      { id:'d12', label:'Taxe foncière', statut:'attente' },
    ]},
    { section: 'Documents Financement', docs: [
      { id:'d13', label:'Offre de prêt définitive', statut:'attente' },
      { id:'d14', label:'Attestation PTZ', statut:'attente' },
    ]},
  ],
  investissement: [
    { section: 'Documents Personnels', docs: [
      { id:'d1', label:'Pièce d\'identité (recto/verso)', statut:'recu' },
      { id:'d2', label:'3 derniers bulletins de salaire', statut:'recu' },
      { id:'d3', label:'Dernier avis d\'imposition', statut:'recu' },
      { id:'d4', label:'3 derniers relevés bancaires', statut:'recu' },
    ]},
    { section: 'Documents Solvabilité Investisseur', docs: [
      { id:'d5', label:'Accord de principe bancaire', statut:'recu' },
      { id:'d6', label:'Justificatif d\'apport', statut:'recu' },
    ]},
    { section: 'Documents CIL / Audit Pré-achat', docs: [
      { id:'d7', label:'État des diagnostics (DPE, Amiante, Plomb, ERP)', statut:'attente' },
      { id:'d8', label:'PV des 3 dernières Assemblées Générales', statut:'attente' },
      { id:'d9', label:'Règlement de copropriété', statut:'attente' },
      { id:'d10', label:'Taxe foncière', statut:'attente' },
    ]},
    { section: 'Spécifique Investissement', docs: [
      { id:'d11', label:'Simulation de rentabilité Pilot Immo (P3)', statut:'attente' },
    ]},
  ],
  'mise-location': [
    { section: 'Titre de Propriété', docs: [
      { id:'d1', label:'Acte notarié', statut:'recu' },
    ]},
    { section: 'CIL — Performances', docs: [
      { id:'d2', label:'DPE de moins de 10 ans', statut:'attente' },
      { id:'d3', label:'Audit énergétique (si passoire)', statut:'attente' },
    ]},
    { section: 'CIL — Plans', docs: [
      { id:'d4', label:'Plans de coupes du logement', statut:'attente' },
      { id:'d5', label:'Règlement de copropriété', statut:'attente' },
      { id:'d6', label:'Taxe foncière', statut:'recu' },
    ]},
    { section: 'CIL — Réseaux', docs: [
      { id:'d7', label:'Attestation de conformité électrique/gaz', statut:'attente' },
      { id:'d8', label:'Derniers certificats d\'entretien de chaudière', statut:'attente' },
    ]},
    { section: 'Mandat', docs: [
      { id:'d9', label:'Mandat de recherche ou de vente Home in Love signé', statut:'attente' },
    ]},
  ],
  vente: [
    { section: 'Titre de Propriété', docs: [
      { id:'d1', label:'Acte notarié', statut:'recu' },
    ]},
    { section: 'CIL — Diagnostics', docs: [
      { id:'d2', label:'DPE de moins de 10 ans', statut:'recu' },
      { id:'d3', label:'Audit énergétique (si passoire)', statut:'attente' },
      { id:'d4', label:'Attestation de conformité électrique/gaz', statut:'attente' },
      { id:'d5', label:'Derniers certificats d\'entretien de chaudière', statut:'attente' },
    ]},
    { section: 'Mandat', docs: [
      { id:'d6', label:'Mandat de vente Home in Love signé', statut:'recu' },
    ]},
  ],
  renovation: [
    { section: 'Administratif', docs: [
      { id:'d1', label:'Récépissé de Déclaration Préalable (DP) ou Permis de Construire', statut:'attente' },
      { id:'d2', label:'Techniques des isolants (R ou lambda) fournis par les artisans', statut:'attente' },
    ]},
    { section: 'CIL — Réseaux', docs: [
      { id:'d3', label:'Schéma de modification électrique ou plomberie après travaux', statut:'attente' },
    ]},
    { section: 'Notices Techniques', docs: [
      { id:'d4', label:'Notice d\'entretien PAC', statut:'attente' },
      { id:'d5', label:'Chauffe-eau thermodynamique', statut:'attente' },
      { id:'d6', label:'VMC', statut:'attente' },
    ]},
    { section: 'Financier', docs: [
      { id:'d7', label:'Devis artisans signés', statut:'recu' },
      { id:'d8', label:'Factures finales (indispensables pour déblocage aides en P7)', statut:'attente' },
    ]},
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   DONNÉES DÉMO — 8 PROJETS
   ───────────────────────────────────────────────────────────────────────── */
function buildDemoProjects() {
  return [
    {
      id: 'proj_1',
      type: 'achat',
      titre: 'Recherche d\'un appartement 3 pièces — Bordeaux',
      adresse: 'Bordeaux Chartrons / Caudéran — 33000',
      objectif: 'Acheter avant fin 2026 avec un financement optimisé',
      deadline: '2026-12-01',
      offre: 'copilot',
      expertisesActives: { financier: true, juridique: false, technique: true },
      phases: buildPhases('achat', '2026-01-01'),
      documents: DOCS_BY_TYPE['achat'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:600, coutPrev:800, isHIL: true },
        { id:'p2', nom:'Crédit Conseil', specialite:'Courtier en financement', email:'contact@creditconseil.fr', tel:'05 56 XX XX XX', coutEngage:0, coutPrev:1500, isHIL: false },
      ],
      messages: [
        { id:'m1', texte:'Visite T3 rue Fondaudège — 68m², DPE C, charges 120€/mois. Prix demandé 295k. Potentiel de négo à 280k.', date:'2026-02-10T16:00:00', auteur:'Cabinet' },
        { id:'m2', texte:'Accord de principe Crédit Agricole obtenu. Taux 3,45% sur 20 ans. Mensualité estimée : 1 580€ pour 280k.', date:'2026-01-28T10:30:00', auteur:'Cabinet' },
      ],
      notesPrivees: [],
      nextMsgId: 3,
    },
    {
      id: 'proj_2',
      type: 'location',
      titre: 'Recherche d\'un T2 meublé — Lyon Part-Dieu',
      adresse: 'Lyon 3e / Lyon 6e — 69003, 69006',
      objectif: 'Trouver un logement avant ma prise de poste le 1er mars 2026',
      deadline: '2026-03-01',
      offre: 'flash',
      expertisesActives: { financier: false, juridique: true, technique: false },
      phases: buildPhases('location', '2026-01-15'),
      documents: DOCS_BY_TYPE['location'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:500, coutPrev:350, isHIL: true },
      ],
      messages: [
        { id:'m1', texte:'Visite appart rue Garibaldi — très lumineux, bon état général. Propriétaire réactif. À rappeler avant vendredi.', date:'2026-01-22T14:32:00', auteur:'Cabinet' },
      ],
      notesPrivees: [],
      nextMsgId: 2,
    },
    {
      id: 'proj_3',
      type: 'investissement',
      titre: 'Acquisition investissement locatif — Paris 13e',
      adresse: 'Paris 13e / 75013',
      objectif: 'Acquérir un studio à fort rendement locatif',
      deadline: '2026-09-01',
      offre: 'delegation',
      expertisesActives: { financier: false, juridique: false, technique: false },
      phases: buildPhases('investissement', '2026-01-10'),
      documents: DOCS_BY_TYPE['investissement'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:1200, coutPrev:2400, isHIL: true },
      ],
      messages: [],
      notesPrivees: [],
      nextMsgId: 1,
    },
    {
      id: 'proj_4',
      type: 'mise-location',
      titre: 'Mise en location — Appartement Marseille 6e',
      adresse: 'Marseille 6e — 13006',
      objectif: 'Louer mon bien rapidement avec un locataire solvable',
      deadline: '2026-04-01',
      offre: 'copilot',
      expertisesActives: { financier: false, juridique: true, technique: false },
      phases: buildPhases('mise-location', '2026-01-20'),
      documents: DOCS_BY_TYPE['mise-location'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:400, coutPrev:600, isHIL: true },
      ],
      messages: [],
      notesPrivees: [],
      nextMsgId: 1,
    },
    {
      id: 'proj_5',
      type: 'vente',
      titre: 'Mise en vente — Maison Nantes',
      adresse: 'Nantes, 44000',
      objectif: 'Vendre au meilleur prix avant l\'été 2026',
      deadline: '2026-07-01',
      offre: 'copilot',
      expertisesActives: { financier: false, juridique: false, technique: true },
      phases: buildPhases('vente', '2026-01-05'),
      documents: DOCS_BY_TYPE['vente'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:800, coutPrev:1200, isHIL: true },
      ],
      messages: [],
      notesPrivees: [],
      nextMsgId: 1,
    },
    {
      id: 'proj_6',
      type: 'renovation',
      titre: 'Rénovation énergétique — Appartement Toulouse',
      adresse: 'Toulouse, 31000',
      objectif: 'Passer de DPE G à DPE C avec les aides MaPrimeRénov\'',
      deadline: '2026-10-01',
      offre: 'flash',
      expertisesActives: { financier: false, juridique: false, technique: false },
      phases: buildPhases('renovation', '2026-01-08'),
      documents: DOCS_BY_TYPE['renovation'],
      prestataires: [
        { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:300, coutPrev:900, isHIL: true },
      ],
      messages: [],
      notesPrivees: [],
      nextMsgId: 1,
    },
    {
         id: 'proj_7',
        type: 'passoire',
        titre: 'Sauvetage passoire — Appartement DPE G, Lyon',
        adresse: 'Lyon 8e — 69008',
        objectif: 'Passer de DPE G à DPE C et remettre en location',
        deadline: '2026-12-01',
        offre: 'copilot',
        expertisesActives: { financier: false, juridique: false, technique: false },
        phases: buildPhases('passoire', '2026-02-01'),
        documents: DOCS_BY_TYPE['renovation'],
        prestataires: [
    { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:400, coutPrev:1200, isHIL:true },
  ],
  messages: [],
  notesPrivees: [],
  nextMsgId: 1,
},
{
  id: 'proj_8',
  type: 'bureau',
  titre: 'Transformation bureau en logement — Paris 11e',
  adresse: 'Paris 11e — 75011',
  objectif: 'Convertir 120m² de bureaux en 3 appartements locatifs',
  deadline: '2027-06-01',
  offre: 'delegation',
  expertisesActives: { financier: false, juridique: false, technique: false },
  phases: buildPhases('bureau', '2026-02-15'),
  documents: DOCS_BY_TYPE['renovation'],
  prestataires: [
    { id:'p1', nom:'Home in Love', specialite:'Accompagnement immobilier', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', coutEngage:0, coutPrev:3500, isHIL:true },
  ],
  messages: [],
  notesPrivees: [],
  nextMsgId: 1,
},
  ];
}

/* ─────────────────────────────────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────────────────────────────────── */
var currentUser    = null;
var allProjects    = [];
var currentProjIdx = 0;
var activeTab      = 'tab-projet';
var msgMode        = 'public'; // 'public' | 'prive'

function proj() { return allProjects[currentProjIdx]; }

/* ─────────────────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  currentUser = authRequire(['client']);
  if (!currentUser) return;

  allProjects = buildDemoProjects();

  renderNavbar();
  renderSidebar();
  renderProject();
  bindTabs();
  showOnboardingBanner();
});

/* ─────────────────────────────────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────────────────────────────────── */
function renderNavbar() {
  var el = document.getElementById('navAvatar');
  if (el) el.textContent = currentUser.avatar;
  el = document.getElementById('navName');
  if (el) el.textContent = currentUser.prenom + ' ' + currentUser.nom;
}

/* ─────────────────────────────────────────────────────────────────────────
   ONBOARDING BANNER
   ───────────────────────────────────────────────────────────────────────── */
function showOnboardingBanner() {
  if (sessionStorage.getItem('hil_onboarding_seen')) return;
  var banner = document.getElementById('onboardingBanner');
  if (banner) banner.style.display = 'flex';
}
function closeOnboarding() {
  sessionStorage.setItem('hil_onboarding_seen', '1');
  var banner = document.getElementById('onboardingBanner');
  if (banner) banner.style.display = 'none';
}

/* ─────────────────────────────────────────────────────────────────────────
   SIDEBAR
   ───────────────────────────────────────────────────────────────────────── */
function renderSidebar() {
  var list = document.getElementById('sidebarProjectList');
  if (!list) return;
  list.innerHTML = '';
  allProjects.forEach(function(p, idx) {
    var cfg = PROJECT_TYPES[p.type] || {};
    var activePhase = p.phases.filter(function(ph){ return ph.status === 'active'; })[0];
    var item = document.createElement('div');
    item.className = 'project-item' + (idx === currentProjIdx ? ' active' : '');
    item.onclick = function() { switchProject(idx); };
    item.innerHTML =
      '<div class="proj-type-dot" style="background:' + (cfg.color||'#888') + '"></div>' +
      '<div>' +
        '<div class="proj-item-name">' + (cfg.label || p.type) + '</div>' +
        '<div class="proj-item-meta">' + p.adresse.split('—')[0].trim() + '</div>' +
        (activePhase ? '<div class="proj-item-phase">' + activePhase.title + '</div>' : '') +
      '</div>';
    list.appendChild(item);
  });
}

function switchProject(idx) {
  currentProjIdx = idx;
  renderSidebar();
  renderProject();
}

/* ─────────────────────────────────────────────────────────────────────────
   RENDER PROJECT (dispatch vers l'onglet actif)
   ───────────────────────────────────────────────────────────────────────── */
function renderProject() {
  renderHeader();
  if (activeTab === 'tab-projet')       renderTabProjet();
  if (activeTab === 'tab-documents')    renderTabDocuments();
  if (activeTab === 'tab-prestataires') renderTabPrestataires();
  if (activeTab === 'tab-messagerie')   renderTabMessagerie();
}

/* ─────────────────────────────────────────────────────────────────────────
   HEADER PROJET
   ───────────────────────────────────────────────────────────────────────── */
function renderHeader() {
  var p   = proj();
  var cfg = PROJECT_TYPES[p.type] || {};

  var badge = document.getElementById('projBadge');
  if (badge) {
    badge.textContent = cfg.label || p.type;
    badge.style.background = cfg.bg;
    badge.style.color = cfg.color;
  }
  var title = document.getElementById('projTitle');
  if (title) title.textContent = p.titre;

  var adresse = document.getElementById('projAdresse');
  if (adresse) adresse.textContent = p.adresse;

  var objectif = document.getElementById('projObjectif');
  if (objectif) objectif.textContent = p.objectif;

  var deadline = document.getElementById('projDeadline');
  if (deadline) deadline.textContent = fmtDate(p.deadline);

  /* Barre de progression phases */
  var doneCount = p.phases.filter(function(ph){ return ph.status === 'done'; }).length;
  var pct = Math.round((doneCount / p.phases.length) * 100);

  /* Détecter retard client */
  var hasClientLate = p.phases.some(function(ph) {
    return ph.missions && ph.missions.some(function(m) {
      return m.responsable === 'Moi' && (m.statut === 'late' || m.statut === 'client');
    });
  });
  var lateClientMission = null;
  p.phases.forEach(function(ph) {
    if (ph.missions) ph.missions.forEach(function(m) {
      if (!lateClientMission && m.responsable === 'Moi' && (m.statut === 'late' || m.statut === 'client')) {
        lateClientMission = m;
      }
    });
  });

  var fill = document.getElementById('projProgressFill');
  if (fill) {
    fill.style.width = pct + '%';
    fill.style.background = hasClientLate
      ? 'linear-gradient(90deg,#c47a00,#ef9f27)'
      : 'linear-gradient(90deg,var(--accent),var(--teal))';
  }
  var pctEl = document.getElementById('projProgressPct');
  if (pctEl) pctEl.textContent = 'Phase ' + doneCount + '/' + p.phases.length + ' · ' + pct + '%';

  /* Bandeau nudge retard client */
  var nudge = document.getElementById('nudgeBanner');
  if (nudge) {
    if (lateClientMission) {
      nudge.style.display = 'flex';
      var nudgeText = document.getElementById('nudgeText');
      if (nudgeText) nudgeText.textContent = 'Votre retard sur l\'étape "' + lateClientMission.title + '" décale votre date de signature finale.';
    } else {
      nudge.style.display = 'none';
    }
  }

  /* Badge offre */
  var offreBadge = document.getElementById('projOffreBadge');
  if (offreBadge) {
    var offreLabels = { flash: 'Diagnostic Flash', copilot: 'Co-Pilote', delegation: 'Délégation Totale' };
    offreBadge.textContent = offreLabels[p.offre] || p.offre;
  }

  /* CTA délégation — visible à partir de P3 */
  var ctaDeleguer = document.getElementById('ctaDeleguer');
  if (ctaDeleguer) {
    ctaDeleguer.style.display = doneCount >= 2 ? 'inline-flex' : 'none';
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   TABS
   ───────────────────────────────────────────────────────────────────────── */
function bindTabs() {
  document.querySelectorAll('.dash-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.dash-tab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(function(p) {
    p.classList.toggle('active', p.id === tabId);
  });
  renderProject();
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET MON PROJET (Bilan + Parcours fusionnés)
   ═══════════════════════════════════════════════════════════════════════════ */
function renderTabProjet() {
  var p   = proj();
  var wrap = document.getElementById('projetContent');
  if (!wrap) return;

  var activePhaseIdx = p.phases.findIndex(function(ph){ return ph.status === 'active' || ph.status === 'late' || ph.status === 'locked'; });
  if (activePhaseIdx === -1) activePhaseIdx = 0;

  /* ── Widget sécurité (3 expertises) ── */
  var santeHtml = '<div class="sante-section"><div class="sante-header"><div class="sante-title">État de Sécurité du Projet</div><div class="sante-subtitle">Mis à jour il y a 2h</div></div><div class="sante-grid">';
  ['financier','juridique','technique'].forEach(function(key) {
    var ex = EXPERTISES[key];
    var active = p.expertisesActives[key];
    santeHtml +=
      '<div class="sante-card ' + (active ? 'sante-ok' : 'sante-risk') + '">' +
        '<div class="sante-card-top">' +
          '<div class="sante-icon">' + ex.icon + '</div>' +
          '<div class="sante-lock">' + (active ? '<span class="lock-certified">✅</span>' : '<span class="lock-closed">🔒</span>') + '</div>' +
        '</div>' +
        '<div class="sante-label">' + ex.label.replace('Expertise ','') + '</div>' +
        '<div class="sante-slogan">' + ex.slogan + '</div>' +
        '<div class="sante-status">' + (active ? '✓ Phase Certifiée Pilot Immo' : '⚠ Risque détecté') + '</div>' +
        (!active ? '<button class="btn-resoudre" onclick="openExpertiseModal(\'' + key + '\')">Résoudre →</button>' : '<div class="sante-certified">Phase Certifiée ✅</div>') +
      '</div>';
  });
  santeHtml += '</div></div>';

  /* ── Plan de route (macro) ── */
  var planHtml = '<div class="plan-section"><div class="plan-header"><span class="plan-title">Mon Plan de Vol</span><span class="plan-step">Phase ' + (activePhaseIdx+1) + ' / ' + p.phases.length + '</span></div>';
  planHtml += '<div class="plan-steps">';
  p.phases.forEach(function(phase, idx) {
    var st = PHASE_STATUS[phase.status] || PHASE_STATUS.pending;
    var isActive = idx === activePhaseIdx;
    planHtml +=
      '<div class="plan-step-item' + (isActive ? ' plan-step-active' : '') + '">' +
        '<div class="plan-step-dot" style="background:' + st.dot + ';border-color:' + st.dot + '">' +
          (phase.status === 'done' ? '✓' : (idx+1)) +
        '</div>' +
        '<div class="plan-step-label">' + phase.title + '</div>' +
      '</div>' +
      (idx < p.phases.length-1 ? '<div class="plan-step-connector"></div>' : '');
  });
  planHtml += '</div>';

  /* Action requise si phase active bloquée */
  var activePhase = p.phases[activePhaseIdx];
  if (activePhase && activePhase.status === 'locked') {
    planHtml += '<div class="plan-alert"><div class="plan-alert-text"><strong>Projet non sécurisé :</strong> Activez une expertise pour débloquer cette phase et sécuriser votre projet.</div><button class="btn-debloquer" onclick="openExpertiseModal(\'financier\')">Activer une Expertise →</button></div>';
  } else if (activePhase) {
    var nextMission = null;
    activePhase.missions.forEach(function(m){ if (!nextMission && m.statut !== 'done') nextMission = m; });
    if (nextMission) {
      planHtml += '<div class="plan-action"><div class="plan-action-text"><strong>Action requise :</strong> ' + nextMission.title + '</div><button class="btn-debloquer" onclick="switchTab(\'tab-projet\')">Voir le détail →</button></div>';
    }
  }
  planHtml += '</div>';

  /* ── Timeline Parcours (7 phases avec sous-missions) ── */
  var timelineHtml = '<div class="timeline-section"><div class="timeline-title">Parcours détaillé</div>';
  p.phases.forEach(function(phase, phIdx) {
    var st = PHASE_STATUS[phase.status] || PHASE_STATUS.pending;
    var isLocked = phase.status === 'locked';

    timelineHtml +=
      '<div class="tl-phase' + (isLocked ? ' tl-phase-locked' : '') + '">' +
        '<div class="tl-phase-header">' +
          '<div class="tl-phase-dot" style="background:' + st.dot + '"></div>' +
          '<div class="tl-phase-info">' +
            '<div class="tl-phase-id">' + phase.id + '</div>' +
            '<div class="tl-phase-title">' + phase.title + '</div>' +
            '<div class="tl-phase-deadline">Échéance : ' + fmtDate(phase.deadline) + '</div>' +
          '</div>' +
          '<div class="tl-phase-badge" style="background:' + st.bg + ';color:' + st.color + '">' + st.label + '</div>' +
        '</div>';

    if (isLocked) {
      timelineHtml += '<div class="tl-locked-msg">⚠ Phase non sécurisée — activez une expertise pour débloquer cette phase.<button class="btn-inline-expertise" onclick="openExpertiseModal(\'financier\')">Activer une Expertise — 590€</button></div>';
    } else {
      /* Sous-missions */
      timelineHtml += '<div class="tl-missions">';
      phase.missions.forEach(function(m) {
        var mSt = MISSION_STATUS[m.statut] || MISSION_STATUS.pending;
        /* Statut client automatique si responsable = Moi et non done */
        if (m.responsable === 'Moi' && m.statut === 'active') mSt = MISSION_STATUS.client;
        var respClass = m.responsable === 'Moi' ? 'resp-moi' : (m.responsable === 'Cabinet' ? 'resp-cabinet' : 'resp-presta');
        var isClientAction = m.responsable === 'Moi' && m.statut !== 'done';
        timelineHtml +=
          '<div class="tl-mission' + (isClientAction ? ' tl-mission-client' : '') + '">' +
            '<div class="tl-feu ' + mSt.cls + '"></div>' +
            '<div class="tl-mission-body">' +
              '<div class="tl-mission-title">' + m.title + '</div>' +
              '<div class="tl-mission-meta">' +
                '<span class="tl-resp ' + respClass + '">' + m.responsable + '</span>' +
                '<span class="tl-deadline">📅 ' + fmtDate(m.deadline) + '</span>' +
                '<span class="tl-status-badge ' + mSt.cls + '">' + mSt.label + '</span>' +
              '</div>' +
              (isClientAction ? '<div class="tl-client-nudge">Le projet attend votre action pour avancer</div>' : '') +
            '</div>' +
          '</div>';
      });
      timelineHtml += '</div>';
    }

    /* CTA Expertise si phase en a */
    if (phase.expertises && phase.expertises.length && !isLocked) {
      timelineHtml += '<div class="tl-expertises">';
      phase.expertises.forEach(function(eKey) {
        var ex = EXPERTISES[eKey];
        var isActive = p.expertisesActives[eKey];
        if (!isActive) {
          timelineHtml += '<button class="btn-expertise-cta" onclick="openExpertiseModal(\'' + eKey + '\')">' + ex.icon + ' Activer ' + ex.label + ' — ' + ex.prix + '€</button>';
        } else {
          timelineHtml += '<span class="expertise-active-badge">' + ex.icon + ' ' + ex.label + ' — Activée ✓</span>';
        }
      });
      timelineHtml += '</div>';
    }

    /* Bouton ajouter une sous-mission */
    if (!isLocked) {
      timelineHtml += '<button class="btn-add-mission" onclick="addMission(\'' + phase.id + '\')">＋ Suggérer une mission</button>';
    }

    timelineHtml += '</div>';
  });

  /* CTA Délégation Totale (à partir de P3) */
  var doneCount = p.phases.filter(function(ph){ return ph.status === 'done'; }).length;
  if (doneCount >= 2 && p.offre !== 'delegation') {
    timelineHtml += '<div class="delegation-cta-block"><div class="delegation-cta-title">Vous préférez tout déléguer ?</div><div class="delegation-cta-sub">Confiez l\'exécution complète à Home in Love. Honoraires au résultat — 3% du montant.</div><button class="btn-delegation" onclick="openDeleguerModal()">→ Activer la Délégation Totale</button></div>';
  }

  timelineHtml += '</div>';

  wrap.innerHTML = santeHtml + planHtml + timelineHtml;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET DOCUMENTS
   ═══════════════════════════════════════════════════════════════════════════ */
function renderTabDocuments() {
  var p    = proj();
  var wrap = document.getElementById('docsContent');
  if (!wrap) return;

  /* Calcul jauge CIL */
  var totalDocs = 0, recuDocs = 0;
  p.documents.forEach(function(s){ s.docs.forEach(function(d){ totalDocs++; if(d.statut==='recu') recuDocs++; }); });
  var cilPct = totalDocs > 0 ? Math.round((recuDocs/totalDocs)*100) : 0;
  var cilCircle = 2 * Math.PI * 36;
  var cilOffset = cilCircle - (cilCircle * cilPct / 100);

  var html =
    '<div class="docs-header-banner">' +
      '<div class="docs-banner-left">' +
        '<div class="docs-banner-title">📁 Votre coffre-fort de documents</div>' +
        '<div class="docs-banner-text">Cet espace constitue votre <strong>Carnet d\'Information Logement (CIL)</strong>, rendu obligatoire par les articles L126-35-2 et suivants du Code de la construction et de l\'habitation. Conservez ici tous les documents essentiels à votre projet — ils seront transmissibles lors de toute future transaction.</div>' +
        '<button class="btn-export-cil" onclick="exportCIL()">📄 Exporter mon Carnet d\'Information (PDF)</button>' +
      '</div>' +
      '<div class="docs-banner-right">' +
        '<div class="cil-gauge">' +
          '<svg width="88" height="88" viewBox="0 0 88 88">' +
            '<circle cx="44" cy="44" r="36" fill="none" stroke="var(--surf3)" stroke-width="8"/>' +
            '<circle cx="44" cy="44" r="36" fill="none" stroke="' + (cilPct >= 80 ? '#16a34a' : cilPct >= 50 ? '#1e63f0' : '#c47a00') + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + cilCircle.toFixed(1) + '" stroke-dashoffset="' + cilOffset.toFixed(1) + '" transform="rotate(-90 44 44)"/>' +
            '<text x="44" y="48" text-anchor="middle" font-size="16" font-weight="800" fill="var(--text)">' + cilPct + '%</text>' +
          '</svg>' +
          '<div class="cil-gauge-label">Conformité CIL</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  p.documents.forEach(function(section) {
    html += '<div class="docs-section"><div class="docs-section-title">' + section.section + '</div>';
    section.docs.forEach(function(doc) {
      var isRecu = doc.statut === 'recu';
      html +=
        '<div class="doc-row">' +
          '<span class="doc-check">' + (isRecu ? '✅' : '⏳') + '</span>' +
          '<span class="doc-label">' + doc.label + '</span>' +
          '<div class="doc-actions">' +
            '<span class="doc-status ' + (isRecu ? 'doc-recu' : 'doc-attente') + '">' + (isRecu ? 'Reçu' : 'En attente') + '</span>' +
            '<button class="doc-btn-upload" title="Uploader">📎</button>' +
            '<button class="doc-btn-del" title="Supprimer">✕</button>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';
  });

  html +=
    '<div class="docs-upload-zone" onclick="document.getElementById(\'fileInput\').click()">' +
      '<div class="docs-upload-icon">📎</div>' +
      '<div class="docs-upload-label">Ajouter un document</div>' +
      '<input type="file" id="fileInput" style="display:none" multiple>' +
    '</div>';

  wrap.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET PRESTATAIRES
   ═══════════════════════════════════════════════════════════════════════════ */
function renderTabPrestataires() {
  var p    = proj();
  var wrap = document.getElementById('prestContent');
  if (!wrap) return;

  var html = '<div class="prest-grid">';

  /* Prestataires réels */
  p.prestataires.forEach(function(pr) {
    html +=
      '<div class="prest-card">' +
        '<div class="prest-header">' +
          '<div class="prest-avatar">' + (pr.isHIL ? '⭐' : '🏢') + '</div>' +
          '<div>' +
            '<div class="prest-name">' + pr.nom + '</div>' +
            '<div class="prest-specialite">' + pr.specialite + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="prest-contact">' +
          '<div>✉ ' + pr.email + '</div>' +
          '<div>📞 ' + pr.tel + '</div>' +
        '</div>' +
        '<div class="prest-costs">' +
          '<div class="prest-cost-item"><div class="prest-cost-label">Coût engagé</div><div class="prest-cost-value engage">' + pr.coutEngage.toLocaleString('fr-FR') + ' €</div></div>' +
          '<div class="prest-cost-item"><div class="prest-cost-label">Prévisionnel</div><div class="prest-cost-value prev">' + pr.coutPrev.toLocaleString('fr-FR') + ' €</div></div>' +
        '</div>' +
      '</div>';
  });

  /* Cards Expertises HIL (upsell) */
  Object.keys(EXPERTISES).forEach(function(key) {
    var ex = EXPERTISES[key];
    var isActive = p.expertisesActives[key];
    if (!isActive) {
      html +=
        '<div class="prest-card prest-card-expertise">' +
          '<div class="prest-header">' +
            '<div class="prest-avatar">⭐</div>' +
            '<div>' +
              '<div class="prest-name">Home in Love</div>' +
              '<div class="prest-specialite">Accompagnement immobilier</div>' +
            '</div>' +
          '</div>' +
          '<div class="prest-expertise-badge">' +
            '<span class="expertise-icon">' + ex.icon + '</span>' +
            '<div>' +
              '<div class="expertise-name">' + ex.label + '</div>' +
              '<div class="expertise-slogan">"' + ex.slogan + '"</div>' +
            '</div>' +
          '</div>' +
          '<button class="btn-activer-expertise" onclick="openExpertiseModal(\'' + key + '\')">' +
            'Activer — ' + ex.prix + ' €' +
          '</button>' +
        '</div>';
    }
  });

  /* Card ajouter prestataire */
  html +=
    '<div class="prest-card prest-card-add" onclick="addPrestataire()">' +
      '<div class="prest-add-icon">＋</div>' +
      '<div class="prest-add-label">Ajouter un prestataire</div>' +
    '</div>';

  html += '</div>';
  wrap.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET MESSAGERIE
   ═══════════════════════════════════════════════════════════════════════════ */
function renderTabMessagerie() {
  var p    = proj();
  var wrap = document.getElementById('msgContent');
  if (!wrap) return;

  var msgs = msgMode === 'public' ? p.messages : p.notesPrivees;

  var html =
    '<div class="msg-toggle-row">' +
      '<button class="msg-toggle ' + (msgMode === 'public' ? 'active' : '') + '" onclick="switchMsgMode(\'public\')">💬 Messagerie</button>' +
      '<button class="msg-toggle ' + (msgMode === 'prive' ? 'active' : '') + '" onclick="switchMsgMode(\'prive\')">🔒 Notes privées</button>' +
    '</div>' +
    '<div class="msg-input-row">' +
      '<textarea class="msg-textarea" id="msgInput" placeholder="' + (msgMode === 'public' ? 'Écrivez un message à votre expert…' : 'Écrivez une note personnelle… (visible par vous uniquement)') + '" rows="3"></textarea>' +
      '<button class="btn-add-msg" onclick="addMessage()">＋ Ajouter</button>' +
    '</div>' +
    '<div class="msg-list">';

  if (msgs.length === 0) {
    html += '<div class="msg-empty">Aucun message pour l\'instant.</div>';
  } else {
    msgs.slice().reverse().forEach(function(m) {
      html +=
        '<div class="msg-item">' +
          '<div class="msg-meta">' +
            '<span class="msg-date">📅 ' + fmtDateTime(m.date) + '</span>' +
            (m.auteur ? '<span class="msg-auteur">' + m.auteur + '</span>' : '') +
          '</div>' +
          '<div class="msg-text">' + m.texte + '</div>' +
          '<button class="msg-del" onclick="deleteMessage(' + m.id + ')">✕</button>' +
        '</div>';
    });
  }

  html += '</div>';
  wrap.innerHTML = html;
}

function switchMsgMode(mode) {
  msgMode = mode;
  renderTabMessagerie();
}

function addMessage() {
  var input = document.getElementById('msgInput');
  if (!input || !input.value.trim()) return;
  var p = proj();
  var msg = {
    id: p.nextMsgId++,
    texte: input.value.trim(),
    date: new Date().toISOString(),
    auteur: 'Moi',
  };
  if (msgMode === 'public') {
    p.messages.push(msg);
  } else {
    p.notesPrivees.push(msg);
  }
  renderTabMessagerie();
}

function deleteMessage(id) {
  var p = proj();
  if (msgMode === 'public') {
    p.messages = p.messages.filter(function(m){ return m.id !== id; });
  } else {
    p.notesPrivees = p.notesPrivees.filter(function(m){ return m.id !== id; });
  }
  renderTabMessagerie();
}

/* ─────────────────────────────────────────────────────────────────────────
   MODALS
   ───────────────────────────────────────────────────────────────────────── */
function openExpertiseModal(key) {
  var ex = EXPERTISES[key];
  if (!ex) return;
  var modal = document.getElementById('expertiseModal');
  if (!modal) return;
  document.getElementById('expertiseModalIcon').textContent  = ex.icon;
  document.getElementById('expertiseModalTitle').textContent = ex.titre || (ex.label + ' — Risque détecté');
  document.getElementById('expertiseModalDesc').textContent  = ex.desc  || 'Notre expert a identifié un point de vigilance sur votre dossier.';
  document.getElementById('expertiseModalPrix').textContent  = ex.prix + ' €';
  var btn = document.getElementById('expertiseModalBtn');
  btn.textContent = ex.cta || ('Activer ' + ex.label + ' — ' + ex.prix + '€');
  btn.onclick = function() { activerExpertise(key); };
  modal.classList.add('open');
}

function activerExpertise(key) {
  proj().expertisesActives[key] = true;
  closeModal('expertiseModal');
  renderProject();
}

function openDeleguerModal() {
  var modal = document.getElementById('deleguerModal');
  if (modal) modal.classList.add('open');
}

function openExpertModal() {
  var modal = document.getElementById('expertModal');
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

/* ─────────────────────────────────────────────────────────────────────────
   ACTIONS DIVERSES
   ───────────────────────────────────────────────────────────────────────── */
function addMission(phaseId) {
  var title = prompt('Titre de la mission suggérée :');
  if (!title || !title.trim()) return;
  var phase = proj().phases.find(function(ph){ return ph.id === phaseId; });
  if (!phase) return;
  phase.missions.push({
    id: phaseId + '-' + Date.now(),
    title: title.trim() + ' (en attente de validation)',
    responsable: 'Moi',
    statut: 'pending',
    deadline: null,
  });
  renderTabProjet();
}

function exportCIL() {
  var p = proj();
  var recuDocs = [];
  p.documents.forEach(function(s){ s.docs.forEach(function(d){ if(d.statut==='recu') recuDocs.push(d.label); }); });
  alert('Export PDF — Carnet d\'Information Logement\n\n' + recuDocs.length + ' document(s) certifié(s) :\n• ' + recuDocs.join('\n• ') + '\n\nFonctionnalité complète disponible après connexion à Stripe & Supabase.');
}

function checkCoffreFortP7() {
  var p = proj();
  var isP7Done = p.phases.length > 0 && p.phases[p.phases.length-1].status === 'done';
  if (isP7Done && p.offre !== 'coffre-fort') {
    var modal = document.getElementById('coffreFortModal');
    if (modal) modal.classList.add('open');
  }
}

function addPrestataire() {
  var nom = prompt('Nom du prestataire :');
  if (!nom || !nom.trim()) return;
  var specialite = prompt('Spécialité :') || '';
  proj().prestataires.push({
    id: 'p_' + Date.now(),
    nom: nom.trim(),
    specialite: specialite.trim(),
    email: '—',
    tel: '—',
    coutEngage: 0,
    coutPrev: 0,
    isHIL: false,
  });
  renderTabPrestataires();
}

function openNewProject() {
  alert('Fonctionnalité disponible après connexion à Supabase.');
}

function closeModalOutside(event, id) {
  if (event.target === event.currentTarget) closeModal(id);
}

/* ─────────────────────────────────────────────────────────────────────────
   RESPONSIVE — barre mobile
   ───────────────────────────────────────────────────────────────────────── */
function initMobileBar() {
  var bar = document.getElementById('mobileProjectBar');
  var sel = document.getElementById('mobileProjectSelect');
  if (!bar || !sel) return;

  function update() {
    var isMobile = window.innerWidth <= 600;
    bar.style.display = isMobile ? 'flex' : 'none';
  }

  // Remplir le select
  allProjects.forEach(function(p, idx) {
    var cfg = PROJECT_TYPES[p.type] || {};
    var opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = (cfg.label || p.type) + ' — ' + p.adresse.split('—')[0].trim();
    sel.appendChild(opt);
  });

  sel.value = currentProjIdx;
  sel.addEventListener('change', function() {
    switchProject(parseInt(this.value));
    sel.value = currentProjIdx;
  });

  update();
  window.addEventListener('resize', update);
}

// Patch switchProject pour sync le select mobile
var _origSwitchProject = switchProject;
switchProject = function(idx) {
  _origSwitchProject(idx);
  var sel = document.getElementById('mobileProjectSelect');
  if (sel) sel.value = currentProjIdx;
};

// Init au chargement
document.addEventListener('DOMContentLoaded', function() {
  // Légèrement différé pour que allProjects soit prêt
  setTimeout(initMobileBar, 100);
});

/* ─────────────────────────────────────────────────────────────────────────
   SIDEBAR RESPONSIVE
   ───────────────────────────────────────────────────────────────────────── */
function toggleSidebar() {
  var sidebar = document.querySelector('.dash-sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  var isOpen = sidebar.classList.contains('open');
  if (isOpen) { closeSidebar(); } else { openSidebar(); }
}

function openSidebar() {
  var sidebar = document.querySelector('.dash-sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeSidebar() {
  var sidebar = document.querySelector('.dash-sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* Fermer sidebar au changement de projet sur mobile */
var _origSwitchProject = switchProject;
switchProject = function(idx) {
  _origSwitchProject(idx);
  if (window.innerWidth < 768) closeSidebar();
};

/* Ajouter les tooltips data-tooltip sur les items sidebar (écran moyen) */
function addSidebarTooltips() {
  document.querySelectorAll('.project-item').forEach(function(item) {
    var name = item.querySelector('.proj-item-name');
    if (name) item.setAttribute('data-tooltip', name.textContent);
  });
}

/* Appeler après renderSidebar */
var _origRenderSidebar = renderSidebar;
renderSidebar = function() {
  _origRenderSidebar();
  addSidebarTooltips();
};
