/* ═══════════════════════════════════════════════════════════════════════════
   dashboard.js — Home in Love  |  Multi-projet  |  requires auth.js
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────── CONFIG ── */
const TYPE_CONFIG = {
  'location':       { label:'Recherche Location', emoji:'🔍', color:'#1e63f0' },
  'achat':          { label:'Recherche Achat',    emoji:'🔑', color:'#0ba592' },
  'mise-location':  { label:'Mise en Location',   emoji:'🏠', color:'#c47a00' },
  'vente':          { label:'Mise en Vente',       emoji:'💰', color:'#16a34a' },
  'renovation':     { label:'Rénovation',          emoji:'🔨', color:'#7c3aed' },
  'autre':          { label:'Autre',               emoji:'📋', color:'#8494b8' },
};

const MISSION_TYPES = {
  'mission':    { label:'Mission',         color:'type-mission'    },
  'aide':       { label:'Aide financière', color:'type-aide'       },
  'subvention': { label:'Subvention',      color:'type-subvention' },
};

/* ───────────────────────────────────────────────────────── STATE ── */
let currentUser    = null;
let allProjects    = [];
let currentProjIdx = 0;
let detailOpen     = false;

/* Getter courant */
function proj() { return allProjects[currentProjIdx]; }

/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES DÉMO
   ═══════════════════════════════════════════════════════════════════════════ */
function buildDemoProjects(user) {

  /* helper : date relative à une base */
  function J(days, base) {
    base = base || '2026-01-01';
    var d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  /* helper : mission Home in Love (offerte si partenaire) */
  function accomp(date) {
    return {
      name: '🤝 Accompagnement gestion de projet Home in Love',
      type: user.partenaire ? 'subvention' : 'mission',
      date: date || '2026-01-05',
      prix: user.partenaire ? 0 : 190,
      delegation: 'timonia', delegatee: '', done: false, validated: false,
    };
  }

  /* ─── catalogue complet ─── */
  var ALL = {

    /* ── RECHERCHE LOCATION ── */
    'location': {
      type: 'location',
      description: 'Recherche d\'un T2 meublé — Lyon Part-Dieu',
      objectif: 'Trouver un logement avant ma prise de poste le 1er mars 2026',
      adresse: 'Lyon 3e / Lyon 6e — 69003, 69006',
      deadline: '2026-03-01',
      budget1Label: 'Loyer max CC', budget1: 850, budget1Suffix: '€/mois',
      budget2Label: 'Budget frais & dépôt', budget2: 2500,
      nextMissionId: 28, nextNoteId: 3,
      prestataires: [
        { id:1, nom:'Home in Love', type:'timonia', avatar:'⭐',
          email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX',
          specialite:'Accompagnement immobilier',
          missions:['Préparation dossier','Vérif. aides','Dépôt dossiers visites','Signature bail'],
          coutEngage:500, coutPrev:350 }
      ],
      notes: [
        { id:1, text:'Visite appart rue Garibaldi — très lumineux, bon état général. Propriétaire réactif. À rappeler avant vendredi.', date:'2026-01-22T14:32:00' },
        { id:2, text:'Dossier CAF envoyé. En attente confirmation sous 15 jours.', date:'2026-01-16T09:15:00' },
      ],
      missions: [
        { id:1,  name:'Définition des besoins',                             type:'mission',    date:J(0),  prix:100,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:2,  name:'Définition du budget et cahier des charges',          type:'mission',    date:J(3),  prix:100,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:3,  name:'Préparation du dossier locataire',                    type:'mission',    date:J(7),  prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:4,  name:'💰 Vérif. éligibilité Visale',                       type:'aide',       date:J(7),  prix:150,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:5,  name:'🎁 Demande Visale — Garantie loyers impayés',        type:'subvention', date:J(10), prix:0,    delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:6,  name:'💰 Vérif. éligibilité Loca-Pass',                   type:'aide',       date:J(7),  prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:7,  name:'🏦 Demande Loca-Pass — Prêt 0% dépôt garantie',     type:'subvention', date:J(10), prix:0,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:8,  name:'💰 Vérif. éligibilité APL/ALS CAF',                 type:'aide',       date:J(7),  prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:9,  name:'🎁 Demande APL/ALS auprès de la CAF',               type:'subvention', date:J(14), prix:0,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:10, name:'💰 Vérif. éligibilité prime déménagement CAF',      type:'aide',       date:J(7),  prix:150,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:11, name:'🎁 Dépôt dossier prime déménagement CAF (1 309 €)', type:'subvention', date:J(14), prix:1309, delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:12, name:'Vérification conformité bail (loi ALUR)',             type:'mission',    date:J(9),  prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:13, name:'Vérification DPE fourni par le propriétaire',         type:'mission',    date:J(9),  prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:14, name:'Recherche des logements',                             type:'mission',    date:J(7),  prix:200,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:15, name:'Dépôt des dossiers pour demande de visites',          type:'mission',    date:J(14), prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:16, name:'Visites',                                             type:'mission',    date:J(21), prix:200,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:17, name:'Dossier accepté',                                     type:'mission',    date:J(30), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:18, name:'Signature du bail',                                   type:'mission',    date:J(35), prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:19, name:'Versement caution et loyer',                          type:'mission',    date:J(35), prix:100,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:20, name:'Prise d\'une assurance habitation',                   type:'mission',    date:J(35), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:21, name:'Mise en place abonnement Enedis',                     type:'mission',    date:J(38), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:22, name:'Mise en place abonnement eau',                        type:'mission',    date:J(38), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:23, name:'Mise en place abonnement internet/box',               type:'mission',    date:J(38), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:24, name:'Entrée dans les lieux',                               type:'mission',    date:J(44), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:25, name:'État des lieux contradictoire si besoin (sous 10j)',  type:'mission',    date:J(54), prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:26, name:'Déclaration nouveau logement (impôts / CAF / Sécu)', type:'mission',    date:J(55), prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        Object.assign({ id:27 }, accomp(J(0))),
      ],
      documents: { nextDocId:18, uploaded:[], sections:[
        { title:'Documents à fournir', items:[
          { id:1,  name:'Pièce d\'identité (recto/verso)',          status:'todo'    },
          { id:2,  name:'3 derniers bulletins de salaire',           status:'done'    },
          { id:3,  name:'Dernier avis d\'imposition',                status:'done'    },
          { id:4,  name:'Contrat de travail / promesse d\'embauche', status:'done'    },
          { id:5,  name:'RIB',                                       status:'todo'    },
          { id:6,  name:'Justificatif de domicile actuel',           status:'todo'    },
          { id:7,  name:'Attestation employeur',                     status:'todo'    },
          { id:8,  name:'3 derniers relevés bancaires',              status:'todo'    },
        ]},
        { title:'Documents à recevoir', items:[
          { id:9,  name:'Bail signé',                                status:'waiting' },
          { id:10, name:'État des lieux d\'entrée',                  status:'waiting' },
          { id:11, name:'Attestation Visale',                        status:'done'    },
          { id:12, name:'Quittance dépôt de garantie',               status:'waiting' },
          { id:13, name:'DPE du logement',                           status:'waiting' },
          { id:14, name:'Règlement de copropriété',                  status:'waiting' },
          { id:15, name:'Attestation assurance habitation',          status:'waiting' },
          { id:16, name:'Confirmation APL/ALS CAF',                  status:'waiting' },
          { id:17, name:'Confirmation prime déménagement CAF',       status:'waiting' },
        ]},
      ]},
    },

    /* ── MISE EN LOCATION ── */
    'mise-location': {
      type: 'mise-location',
      description: 'Mise en location studio 35m² — Paris 11e',
      objectif: 'Louer mon bien rapidement avec un locataire fiable',
      adresse: '23 rue de la Roquette, 75011 Paris',
      deadline: '2026-03-01',
      budget1Label: null, budget1: 0,
      budget2Label: 'Budget frais & prestations', budget2: 2000,
      nextMissionId: 25, nextNoteId: 3,
      prestataires: [
        { id:1, nom:'Home in Love', type:'timonia', avatar:'⭐',
          email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX',
          specialite:'Accompagnement immobilier',
          missions:['Estimation loyer','Vérif. aides','Étude dossiers','Rédaction bail','État des lieux'],
          coutEngage:700, coutPrev:300 }
      ],
      notes: [
        { id:1, text:'Diagnostics DPE commandés. Résultat sous 5 jours. Étiquette C attendue.', date:'2026-01-15T10:00:00' },
        { id:2, text:'Annonce rédigée par Home in Love. Publication prévue lundi. Photos réalisées ce matin.', date:'2026-01-19T11:30:00' },
      ],
      missions: [
        { id:1,  name:'Estimation du loyer marché',                     type:'mission',    date:'2026-01-05', prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:2,  name:'💰 Vérif. éligibilité Loc\'Avantages',          type:'aide',       date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:3,  name:'🎁 Dépôt dossier Loc\'Avantages',              type:'subvention', date:'2026-01-19', prix:0,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:4,  name:'💰 Vérif. éligibilité conventionnement ANAH',  type:'aide',       date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:5,  name:'🎁 Dépôt dossier conventionnement ANAH',       type:'subvention', date:'2026-01-19', prix:0,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:6,  name:'Vérification conformité logement',               type:'mission',    date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:7,  name:'Préparation et home staging',                    type:'mission',    date:'2026-01-12', prix:300,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:8,  name:'Réalisation diagnostics obligatoires DPE',       type:'mission',    date:'2026-01-15', prix:400,  delegation:'other',   delegatee:'Diag Express', done:false, validated:false },
        { id:9,  name:'Rédaction annonce et photos',                    type:'mission',    date:'2026-01-19', prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:10, name:'Publication de l\'annonce',                      type:'mission',    date:'2026-01-22', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:11, name:'Sélection des candidats',                        type:'mission',    date:'2026-01-29', prix:100,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:12, name:'Visites',                                        type:'mission',    date:'2026-02-02', prix:200,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:13, name:'Vérification avis d\'imposition du candidat',    type:'mission',    date:'2026-02-09', prix:100,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:14, name:'Vérification cohérence du dossier',              type:'mission',    date:'2026-02-09', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:15, name:'Vérification des références (appel employeur)',  type:'mission',    date:'2026-02-09', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:16, name:'Étude des dossiers locataires',                  type:'mission',    date:'2026-02-09', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:17, name:'Rédaction du bail',                              type:'mission',    date:'2026-02-16', prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:18, name:'Vérification assurance habitation locataire',    type:'mission',    date:'2026-02-19', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:19, name:'État des lieux d\'entrée',                       type:'mission',    date:'2026-02-19', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:20, name:'Vérification que le loyer a bien été payé',      type:'mission',    date:'2026-02-28', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:21, name:'Remise des clés',                                type:'mission',    date:'2026-02-19', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:22, name:'Souscription assurance PNO',                     type:'mission',    date:'2026-02-19', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:23, name:'Déclaration revenus locatifs',                   type:'mission',    date:'2026-02-28', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        Object.assign({ id:24 }, accomp('2026-01-05')),
      ],
      documents: { nextDocId:15, uploaded:[], sections:[
        { title:'Documents du bien', items:[
          { id:1,  name:'Titre de propriété',               status:'done'    },
          { id:2,  name:'DPE réalisé',                      status:'waiting' },
          { id:3,  name:'DDT complet',                      status:'waiting' },
          { id:4,  name:'Attestation assurance PNO',        status:'todo'    },
          { id:5,  name:'Règlement de copropriété',         status:'done'    },
        ]},
        { title:'Documents locataire', items:[
          { id:6,  name:'Dossier locataire complet',        status:'waiting' },
          { id:7,  name:'Pièce d\'identité locataire',      status:'waiting' },
          { id:8,  name:'3 bulletins de salaire locataire', status:'waiting' },
          { id:9,  name:'Avis d\'imposition locataire',     status:'waiting' },
          { id:10, name:'Attestation employeur locataire',  status:'waiting' },
        ]},
        { title:'Documents contractuels', items:[
          { id:11, name:'Bail signé (loi ALUR)',                      status:'waiting' },
          { id:12, name:'État des lieux d\'entrée signé',             status:'waiting' },
          { id:13, name:'Attestation assurance habitation locataire', status:'waiting' },
          { id:14, name:'Quittance dépôt de garantie',                status:'waiting' },
        ]},
      ]},
    },

    /* ── MISE EN VENTE ── */
    'vente': {
      type: 'vente',
      description: 'Mise en vente appartement 65m² — Bordeaux Chartrons',
      objectif: 'Vendre avant juillet 2026 pour financer le prochain achat',
      adresse: '14 rue Notre-Dame, 33000 Bordeaux',
      deadline: '2026-07-01',
      budget1Label: null, budget1: 0,
      budget2Label: 'Budget frais & prestations', budget2: 8000,
      nextMissionId: 25, nextNoteId: 3,
      prestataires: [
        { id:1, nom:'Home in Love', type:'timonia', avatar:'⭐', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', specialite:'Accompagnement immobilier', missions:['Estimation','Diagnostics','Annonce','Suivi compromis','Coordination notaire'], coutEngage:950, coutPrev:2150 },
        { id:2, nom:'Diag Express', type:'other', avatar:'🔧', email:'contact@diagexpress.fr', tel:'05 56 XX XX XX', specialite:'Diagnostics immobiliers', missions:['Diagnostics obligatoires (DDT complet)'], coutEngage:500, coutPrev:0 },
      ],
      notes: [
        { id:1, text:'Acheteur potentiel — famille avec 2 enfants, financement en cours. Accord de principe banque reçu. RDV compromis semaine prochaine.', date:'2026-02-20T16:45:00' },
        { id:2, text:'Photos réalisées par photographe pro. Très bon résultat. Annonce mise en ligne sur SeLoger et LeBonCoin.', date:'2026-01-19T11:20:00' },
      ],
      missions: [
        { id:1,  name:'Estimation du prix de vente',                       type:'mission',    date:'2026-01-05', prix:250,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:2,  name:'Récupération du titre de propriété',                type:'mission',    date:'2026-01-05', prix:50,   delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:3,  name:'Vérification absence d\'hypothèque',                type:'mission',    date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:4,  name:'💰 Vérif. éligibilité exonération plus-value',     type:'aide',       date:'2026-01-08', prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:5,  name:'🎁 Dépôt dossier exonération plus-value (500 €)',  type:'subvention', date:'2026-02-05', prix:500,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:6,  name:'💰 Vérif. éligibilité abattement fiscal',          type:'aide',       date:'2026-01-08', prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:7,  name:'Calcul de la plus-value et impôt éventuel',         type:'mission',    date:'2026-01-08', prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:8,  name:'Préparation et home staging',                       type:'mission',    date:'2026-01-12', prix:500,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:9,  name:'Réalisation diagnostics obligatoires (DDT complet)',type:'mission',    date:'2026-01-15', prix:500,  delegation:'other',   delegatee:'Diag Express', done:true, validated:true },
        { id:10, name:'Rédaction annonce et photos pro',                   type:'mission',    date:'2026-01-19', prix:250,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:11, name:'Publication de l\'annonce',                         type:'mission',    date:'2026-01-22', prix:50,   delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:12, name:'Vérification financement avant visites',            type:'mission',    date:'2026-01-29', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:13, name:'Visites',                                           type:'mission',    date:'2026-02-02', prix:300,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:14, name:'Réception et analyse des offres',                   type:'mission',    date:'2026-02-16', prix:200,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:15, name:'Vérification financement avant acceptation offre',  type:'mission',    date:'2026-02-16', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:16, name:'Acceptation d\'une offre',                          type:'mission',    date:'2026-02-23', prix:100,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:17, name:'Signature du compromis de vente',                   type:'mission',    date:'2026-03-02', prix:900,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:18, name:'Suivi période de rétractation',                     type:'mission',    date:'2026-03-12', prix:200,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:19, name:'Coordination notaire',                              type:'mission',    date:'2026-03-17', prix:500,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:20, name:'Signature de l\'acte authentique',                  type:'mission',    date:'2026-04-05', prix:750,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:21, name:'Remise des clés',                                   type:'mission',    date:'2026-04-10', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:22, name:'Remboursement anticipé prêt si besoin',             type:'mission',    date:'2026-04-10', prix:100,  delegation:'self',    delegatee:'', done:false, validated:false },
        Object.assign({ id:23 }, accomp('2026-01-05')),
      ],
      documents: { nextDocId:15, uploaded:[], sections:[
        { title:'Documents du bien', items:[
          { id:1, name:'Titre de propriété',                       status:'done' },
          { id:2, name:'DDT complet (élec, gaz, amiante, plomb)', status:'done' },
          { id:3, name:'DPE',                                      status:'done' },
          { id:4, name:'Règlement de copropriété',                 status:'done' },
          { id:5, name:'PV AG des 3 dernières années',             status:'todo' },
          { id:6, name:'Relevé charges copropriété',               status:'todo' },
          { id:7, name:'Taxe foncière dernière année',             status:'todo' },
        ]},
        { title:'Documents financiers', items:[
          { id:8,  name:'Tableau d\'amortissement prêt en cours', status:'todo'    },
          { id:9,  name:'Attestation remboursement anticipé',      status:'waiting' },
          { id:10, name:'Calcul plus-value et impôt',              status:'waiting' },
          { id:11, name:'Attestation exonération plus-value',      status:'waiting' },
        ]},
        { title:'Documents contractuels', items:[
          { id:12, name:'Compromis de vente signé',  status:'waiting' },
          { id:13, name:'Acte authentique de vente', status:'waiting' },
          { id:14, name:'Attestation de vente notaire', status:'waiting' },
        ]},
      ]},
    },

    /* ── RÉNOVATION ── */
    'renovation': {
      type: 'renovation',
      description: 'Rénovation énergétique maison 90m² — Toulouse',
      objectif: 'Passer de l\'étiquette E à B pour mise en location LMNP',
      adresse: '8 allée des Roses, 31000 Toulouse',
      deadline: '2026-05-15',
      budget1Label: 'Budget travaux total', budget1: 25000, budget1Suffix: '€',
      budget2Label: null, budget2: 0,
      nextMissionId: 32, nextNoteId: 3,
      prestataires: [
        { id:1, nom:'Home in Love', type:'timonia', avatar:'⭐', email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX', specialite:'Accompagnement & aides', missions:['Estimation budget','Vérif. aides','Validation artisans','Suivi chantier'], coutEngage:750, coutPrev:500 },
        { id:2, nom:'Elec Martin', type:'other', avatar:'⚡', email:'martin.elec@gmail.com', tel:'06 12 34 56 78', specialite:'Électricité RGE', missions:['Travaux électricité'], coutEngage:3450, coutPrev:0 },
        { id:3, nom:'Thermo Rénov', type:'other', avatar:'🏗️', email:'contact@thermobrenov.fr', tel:'05 61 XX XX XX', specialite:'Isolation & chauffage RGE', missions:['Isolation combles','Pompe à chaleur'], coutEngage:0, coutPrev:12000 },
      ],
      notes: [
        { id:1, text:'Dossier MaPrimeRénov\' déposé en ligne. Numéro : MPR-2026-XXXXX. Délai traitement estimé : 3 semaines.', date:'2026-01-19T10:30:00' },
        { id:2, text:'Elec Martin retenu — meilleur rapport qualité/prix. Décennale vérifiée. RGE valide jusqu\'en 2027.', date:'2026-02-02T15:20:00' },
      ],
      missions: [
        { id:1,  name:'Définition du projet et des travaux',                type:'mission',    date:'2026-01-05', prix:200,   delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:2,  name:'Estimation du budget travaux',                       type:'mission',    date:'2026-01-12', prix:200,   delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:3,  name:'💰 Vérif. éligibilité MaPrimeRénov\'',             type:'aide',       date:'2026-01-12', prix:250,   delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:4,  name:'🎁 Dépôt dossier MaPrimeRénov\' (4 200 €)',        type:'subvention', date:'2026-01-19', prix:4200,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:5,  name:'💰 Vérif. éligibilité Éco-PTZ',                    type:'aide',       date:'2026-01-12', prix:250,   delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:6,  name:'🎁 Dépôt dossier Éco-PTZ (2 000 €)',               type:'subvention', date:'2026-01-26', prix:2000,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:7,  name:'💰 Vérif. éligibilité CEE',                        type:'aide',       date:'2026-01-12', prix:250,   delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:8,  name:'🎁 Dépôt dossier CEE (1 500 €)',                   type:'subvention', date:'2026-01-26', prix:1500,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:9,  name:'💰 Vérif. éligibilité Aide Action Logement travaux',type:'aide',      date:'2026-01-12', prix:250,   delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:10, name:'🎁 Dépôt dossier Aide Action Logement (500 €)',     type:'subvention', date:'2026-01-26', prix:500,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:11, name:'Prise de photos avant travaux',                      type:'mission',    date:'2026-01-19', prix:50,    delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:12, name:'Recherche artisans RGE & mise en concurrence',       type:'mission',    date:'2026-01-19', prix:300,   delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:13, name:'Vérification décennales des artisans',               type:'mission',    date:'2026-01-26', prix:150,   delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:14, name:'Obtention des devis',                                type:'mission',    date:'2026-01-26', prix:100,   delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:15, name:'Validation des artisans',                            type:'mission',    date:'2026-02-02', prix:200,   delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:16, name:'Travaux électricité — Elec Martin',                  type:'mission',    date:'2026-02-09', prix:3450,  delegation:'other',   delegatee:'Elec Martin', done:true, validated:true },
        { id:17, name:'Isolation combles & PAC — Thermo Rénov',            type:'mission',    date:'2026-03-01', prix:12000, delegation:'other',   delegatee:'Thermo Rénov', done:false, validated:true },
        { id:18, name:'Suivi du chantier',                                  type:'mission',    date:'2026-02-09', prix:500,   delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:19, name:'Suivi paiements échelonnés artisans',                type:'mission',    date:'2026-02-09', prix:150,   delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:20, name:'Paiement des artisans',                              type:'mission',    date:'2026-02-09', prix:100,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:21, name:'Réception des travaux',                              type:'mission',    date:'2026-04-25', prix:200,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:22, name:'Prise de photos après travaux',                      type:'mission',    date:'2026-04-25', prix:50,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:23, name:'Transmission justificatifs déblocage aides',         type:'mission',    date:'2026-04-30', prix:100,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:24, name:'Conservation factures (aides et garanties)',         type:'mission',    date:'2026-04-30', prix:50,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:25, name:'Levée des réserves',                                 type:'mission',    date:'2026-05-05', prix:150,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:26, name:'Mise à jour DPE après travaux',                      type:'mission',    date:'2026-05-10', prix:200,   delegation:'other',   delegatee:'', done:false, validated:false },
        { id:27, name:'Bilan final et clôture du chantier',                 type:'mission',    date:'2026-05-15', prix:100,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:28, name:'Vérification assurance dommages-ouvrage',            type:'mission',    date:'2026-02-02', prix:150,   delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:29, name:'Demande permis / déclaration préalable',             type:'mission',    date:'2026-02-02', prix:200,   delegation:'self',    delegatee:'', done:false, validated:false },
        Object.assign({ id:30 }, accomp('2026-01-05')),
      ],
      documents: { nextDocId:20, uploaded:[], sections:[
        { title:'Documents administratifs', items:[
          { id:1, name:'Titre de propriété',                          status:'done'    },
          { id:2, name:'Permis de construire / déclaration préalable',status:'waiting' },
          { id:3, name:'Autorisation copropriété si besoin',          status:'todo'    },
        ]},
        { title:'Documents artisans', items:[
          { id:4, name:'Devis Elec Martin — Électricité',             status:'done' },
          { id:5, name:'Devis Thermo Rénov — Isolation & PAC',        status:'done' },
          { id:6, name:'Attestation décennale Elec Martin',           status:'done' },
          { id:7, name:'Attestation décennale Thermo Rénov',          status:'done' },
          { id:8, name:'Factures travaux électricité',                status:'done' },
          { id:9, name:'Factures travaux isolation & PAC',            status:'waiting' },
        ]},
        { title:'Documents aides', items:[
          { id:10, name:'Dossier MaPrimeRénov\' déposé',             status:'done'    },
          { id:11, name:'Attestation MaPrimeRénov\' obtenue',         status:'waiting' },
          { id:12, name:'Dossier Éco-PTZ déposé',                    status:'waiting' },
          { id:13, name:'Dossier CEE déposé',                        status:'waiting' },
          { id:14, name:'Dossier Aide Action Logement déposé',       status:'waiting' },
        ]},
        { title:'Documents de réception', items:[
          { id:15, name:'Photos avant travaux',                       status:'done'    },
          { id:16, name:'Photos après travaux',                       status:'waiting' },
          { id:17, name:'PV de réception des travaux',                status:'waiting' },
          { id:18, name:'DPE mis à jour après travaux',               status:'waiting' },
          { id:19, name:'Attestation assurance dommages-ouvrage',     status:'waiting' },
        ]},
      ]},
    },
    /* ── RECHERCHE ACHAT ── */
    'achat': {
      type: 'achat',
      description: 'Recherche d\'un appartement 3 pièces — Bordeaux',
      objectif: 'Acheter avant fin 2026 avec un financement optimisé',
      adresse: 'Bordeaux Chartrons / Caudéran — 33000',
      deadline: '2026-12-01',
      budget1Label: 'Budget d\'achat max', budget1: 320000, budget1Suffix: '€',
      budget2Label: 'Budget frais & prestations', budget2: 5000,
      nextMissionId: 28, nextNoteId: 3,
      prestataires: [
        { id:1, nom:'Home in Love', type:'timonia', avatar:'⭐',
          email:'contact@homeinlove.fr', tel:'+33 1 XX XX XX XX',
          specialite:'Accompagnement immobilier',
          missions:['Simulation prêt','Vérif. aides','Analyse offres','Coordination notaire'],
          coutEngage:600, coutPrev:800 },
        { id:2, nom:'Crédit Conseil', type:'other', avatar:'🏦',
          email:'contact@creditconseil.fr', tel:'05 56 XX XX XX',
          specialite:'Courtier en financement',
          missions:['Dossier bancaire','Négociation taux'],
          coutEngage:0, coutPrev:1500 },
      ],
      notes: [
        { id:1, text:'Visite T3 rue Fondaudège — 68m², DPE C, charges 120€/mois. Prix demandé 295k. Potentiel de négo à 280k.', date:'2026-02-10T16:00:00' },
        { id:2, text:'Accord de principe Crédit Agricole obtenu. Taux 3,45% sur 20 ans. Mensualité estimée : 1 580€ pour 280k.', date:'2026-01-28T10:30:00' },
      ],
      missions: [
        { id:1,  name:'Définition du projet et cahier des charges',        type:'mission',    date:'2026-01-05', prix:150,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:2,  name:'Définition du budget global d\'achat',              type:'mission',    date:'2026-01-05', prix:100,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:3,  name:'Simulation de prêt et capacité d\'emprunt',         type:'mission',    date:'2026-01-08', prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:4,  name:'💰 Vérif. éligibilité PTZ (Prêt à Taux Zéro)',     type:'aide',       date:'2026-01-08', prix:200,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:5,  name:'🎁 Dossier PTZ — économie estimée 8 000 €',        type:'subvention', date:'2026-01-15', prix:8000, delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:6,  name:'💰 Vérif. éligibilité Aide Action Logement achat', type:'aide',       date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:7,  name:'🎁 Dossier Aide Action Logement achat',            type:'subvention', date:'2026-01-22', prix:0,    delegation:'self',    delegatee:'', done:false, validated:false },
        { id:8,  name:'💰 Vérif. éligibilité exonération droits mutation', type:'aide',      date:'2026-01-08', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:9,  name:'Préparation du dossier bancaire',                   type:'mission',    date:'2026-01-12', prix:250,  delegation:'timonia', delegatee:'', done:true,  validated:false },
        { id:10, name:'Mise en concurrence des banques / courtier',        type:'mission',    date:'2026-01-15', prix:300,  delegation:'other',   delegatee:'Crédit Conseil', done:true, validated:true },
        { id:11, name:'Obtention accord de principe bancaire',             type:'mission',    date:'2026-01-28', prix:100,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:12, name:'Définition des critères de recherche',              type:'mission',    date:'2026-01-08', prix:100,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:13, name:'Recherche des biens',                               type:'mission',    date:'2026-01-15', prix:300,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:14, name:'Visites',                                           type:'mission',    date:'2026-02-02', prix:200,  delegation:'self',    delegatee:'', done:true,  validated:false },
        { id:15, name:'Vérification urbanisme et servitudes',              type:'mission',    date:'2026-02-09', prix:150,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:16, name:'Vérification des charges de copropriété',          type:'mission',    date:'2026-02-09', prix:100,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:17, name:'Vérification DPE et diagnostics',                  type:'mission',    date:'2026-02-09', prix:100,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:18, name:'Négociation du prix',                               type:'mission',    date:'2026-02-16', prix:200,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:19, name:'Rédaction et dépôt de l\'offre d\'achat',          type:'mission',    date:'2026-02-23', prix:100,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:20, name:'Signature du compromis de vente',                   type:'mission',    date:'2026-03-09', prix:500,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:21, name:'Obtention de l\'offre de prêt définitive',         type:'mission',    date:'2026-03-23', prix:200,  delegation:'self',    delegatee:'', done:false, validated:false },
        { id:22, name:'Coordination notaire acheteur',                     type:'mission',    date:'2026-04-01', prix:400,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:23, name:'Signature de l\'acte authentique',                  type:'mission',    date:'2026-04-28', prix:500,  delegation:'timonia', delegatee:'', done:false, validated:false },
        { id:24, name:'Remise des clés et état des lieux',                 type:'mission',    date:'2026-04-28', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:25, name:'Souscription assurance habitation',                 type:'mission',    date:'2026-04-28', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        { id:26, name:'Déclaration changement de domicile',                type:'mission',    date:'2026-05-05', prix:50,   delegation:'self',    delegatee:'', done:false, validated:false },
        Object.assign({ id:27 }, accomp('2026-01-05')),
      ],
      documents: { nextDocId:18, uploaded:[], sections:[
        { title:'Documents personnels', items:[
          { id:1,  name:'Pièce d\'identité (recto/verso)',          status:'done'    },
          { id:2,  name:'3 derniers bulletins de salaire',           status:'done'    },
          { id:3,  name:'Dernier avis d\'imposition',                status:'done'    },
          { id:4,  name:'3 derniers relevés bancaires',              status:'done'    },
          { id:5,  name:'Contrat de travail',                        status:'done'    },
          { id:6,  name:'Justificatif de domicile actuel',           status:'done'    },
        ]},
        { title:'Documents financement', items:[
          { id:7,  name:'Accord de principe bancaire',               status:'done'    },
          { id:8,  name:'Offre de prêt définitive',                  status:'waiting' },
          { id:9,  name:'Attestation PTZ',                           status:'done'    },
          { id:10, name:'Tableau d\'amortissement prévisionnel',     status:'waiting' },
        ]},
        { title:'Documents du bien', items:[
          { id:11, name:'Compromis de vente signé',                  status:'waiting' },
          { id:12, name:'DDT complet (diagnostics)',                  status:'waiting' },
          { id:13, name:'DPE du bien',                               status:'waiting' },
          { id:14, name:'Règlement de copropriété',                  status:'waiting' },
          { id:15, name:'PV AG des 3 dernières années',              status:'todo'    },
          { id:16, name:'Relevé charges copropriété',                status:'todo'    },
        ]},
        { title:'Documents contractuels', items:[
          { id:17, name:'Acte authentique d\'achat',                 status:'waiting' },
        ]},
      ]},
    },
  };

  /* Marie Laurent → mise-location uniquement */
  if (user.email === 'marie@demo.fr') {
    return [ ALL['mise-location'] ];
  }
  return [ ALL[user.projetType] || ALL['location'] ];
}

/* ── Projet vide avec missions prédéfinies selon le type ── */
function newEmptyProject(type, description, adresse, objectif, deadline) {
  /* On clone les missions du template correspondant */
  var template = buildDemoProjects(currentUser).find(function(p){ return p.type === type; });
  if (!template) {
    /* Si pas de démo dispo pour ce type, on cherche dans le catalogue complet */
    var fakeUser = Object.assign({}, currentUser, { projetType: type });
    var found = buildDemoProjects(fakeUser);
    template = found[0] || null;
  }

  var missions   = [];
  var documents  = { sections: [], nextDocId: 1, uploaded: [] };
  var prestataires = [];
  var nextMissionId = 1;

  if (template) {
    /* Clonage profond des missions */
    missions = JSON.parse(JSON.stringify(template.missions));
    /* Remise à zéro de l'état */
    missions.forEach(function(m) { m.done = false; m.validated = false; });
    nextMissionId = template.nextMissionId;
    documents     = JSON.parse(JSON.stringify(template.documents));
    /* Réinitialise les statuts docs */
    documents.sections.forEach(function(s) {
      s.items.forEach(function(i) { i.status = 'todo'; });
    });
    documents.uploaded = [];
    prestataires = JSON.parse(JSON.stringify(template.prestataires));
  }

  return {
    type: type,
    description: description,
    objectif: objectif || '',
    adresse: adresse || '',
    deadline: deadline || '',
    budget1Label: template ? template.budget1Label : null,
    budget1: template ? template.budget1 : 0,
    budget1Suffix: template ? template.budget1Suffix : '€',
    budget2Label: template ? template.budget2Label : 'Budget frais & prestations',
    budget2: template ? template.budget2 : 0,
    nextMissionId: nextMissionId,
    nextNoteId: 1,
    prestataires: prestataires,
    notes: [],
    missions: missions,
    documents: documents,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  currentUser = authRequire();
  if (!currentUser) return;

  allProjects    = buildDemoProjects(currentUser);
  currentProjIdx = 0;

  renderNavbar();
  renderSidebar();
  loadProject(0);

  /* Ctrl+Entrée dans la zone notes */
  var ta = document.getElementById('noteInput');
  if (ta) ta.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') addNote();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   CHARGEMENT D'UN PROJET
   ═══════════════════════════════════════════════════════════════════════════ */
function loadProject(idx) {
  currentProjIdx = idx;
  detailOpen     = false;
  renderSidebar();
  renderProjectHeader();
  renderTabs();
  renderBilan();
  renderMissions();
  renderPrestataires();
  renderDocuments();
  renderNotes();
  switchTab('tab-bilan');
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════════════════ */
function renderNavbar() {
  var u = currentUser;
  document.getElementById('navAvatar').textContent  = u.avatar;
  document.getElementById('navName').textContent    = u.prenom + ' ' + u.nom;
  document.getElementById('navCompany').textContent = u.entreprise || 'Sans entreprise partenaire';
  var badge = document.getElementById('navBadge');
  badge.style.display = 'inline-flex';
  if (u.partenaire) {
    badge.textContent = '👔 Entreprise partenaire';
  } else {
    badge.textContent      = '👤 Sans partenaire';
    badge.style.background = 'rgba(132,148,184,0.1)';
    badge.style.color      = '#8494b8';
    badge.style.border     = '1px solid rgba(132,148,184,0.2)';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════════════════════ */
function renderSidebar() {
  var list = document.getElementById('sidebarProjectList');
  if (!list) return;
  list.innerHTML = '';

  allProjects.forEach(function(p, idx) {
    var cfg  = TYPE_CONFIG[p.type] || TYPE_CONFIG['autre'];
    var done = p.missions.filter(function(m){ return m.done; }).length;
    var tot  = p.missions.length;
    var pct  = tot ? Math.round(done / tot * 100) : 0;

    var item = document.createElement('div');
    item.className = 'project-item' + (idx === currentProjIdx ? ' active' : '');
    item.onclick   = function() { loadProject(idx); };
    item.innerHTML =
      '<div class="proj-type-dot" style="background:' + cfg.color + '"></div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="proj-item-name">' + cfg.emoji + ' ' + cfg.label + '</div>' +
        '<div class="proj-item-meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px" title="' + p.description + '">' + p.description + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:4px">' +
          '<div class="proj-item-status status-en-cours">En cours</div>' +
          '<span style="font-size:10px;color:var(--muted)">' + pct + '%</span>' +
        '</div>' +
      '</div>';
    list.appendChild(item);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL NOUVEAU PROJET
   ═══════════════════════════════════════════════════════════════════════════ */
function openNewProject() {
  var existing = document.getElementById('newProjModal');
  if (existing) { existing.removeAttribute('hidden'); return; }

  var m = document.createElement('div');
  m.className = 'modal-bg';
  m.id        = 'newProjModal';

  var typeOptions = Object.keys(TYPE_CONFIG).map(function(k) {
    return '<option value="' + k + '">' + TYPE_CONFIG[k].emoji + ' ' + TYPE_CONFIG[k].label + '</option>';
  }).join('');

  m.innerHTML =
    '<div class="modal-box">' +
      '<div class="modal-header">' +
        '<div>' +
          '<div class="modal-title">Nouveau projet</div>' +
          '<div class="modal-sub">Ajoutez un projet immobilier à votre espace</div>' +
        '</div>' +
        '<button class="modal-close" onclick="closeNewProject()">✕</button>' +
      '</div>' +
      '<div class="modal-form">' +
        '<div class="form-group"><label>Type de projet</label><select id="npType">' + typeOptions + '</select></div>' +
        '<div class="form-group"><label>Description</label><input type="text" id="npDesc" placeholder="Ex : Recherche T3 Paris 15e…"></div>' +
        '<div class="form-group"><label>Adresse / Zone</label><input type="text" id="npAdresse" placeholder="Ex : Paris 15e, 75015"></div>' +
        '<div class="form-group"><label>Objectif</label><input type="text" id="npObjectif" placeholder="Ex : Trouver avant le 1er juin…"></div>' +
        '<div class="form-group"><label>Deadline</label><input type="date" id="npDeadline"></div>' +
        '<button class="btn btn-primary w-full" onclick="createNewProject()" style="margin-top:8px">Créer le projet →</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(m);
  m.addEventListener('click', function(e) { if (e.target === m) closeNewProject(); });
}

function closeNewProject() {
  var m = document.getElementById('newProjModal');
  if (m) m.setAttribute('hidden', '');
}

function createNewProject() {
  var type     = document.getElementById('npType').value;
  var desc     = document.getElementById('npDesc').value.trim();
  var adresse  = document.getElementById('npAdresse').value.trim();
  var objectif = document.getElementById('npObjectif').value.trim();
  var deadline = document.getElementById('npDeadline').value;

  if (!desc) { alert('Veuillez saisir une description pour le projet.'); return; }

  allProjects.push(newEmptyProject(type, desc, adresse, objectif, deadline));
  closeNewProject();
  loadProject(allProjects.length - 1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   EN-TÊTE PROJET
   ═══════════════════════════════════════════════════════════════════════════ */
function renderProjectHeader() {
  var p   = proj();
  var cfg = TYPE_CONFIG[p.type] || TYPE_CONFIG['autre'];
  var tot = p.missions.length;
  var don = p.missions.filter(function(m){ return m.done; }).length;
  var pct = tot ? Math.round(don / tot * 100) : 0;

  document.getElementById('projBadge').textContent        = cfg.emoji + ' ' + cfg.label;
  document.getElementById('projTitle').textContent        = p.description;
  document.getElementById('projAdresse').textContent      = p.adresse   || '—';
  document.getElementById('projObjectif').textContent     = p.objectif  || '—';
  document.getElementById('projDeadline').textContent     = fmtDeadline(p.deadline);
  document.getElementById('projProgressPct').textContent  = don + '/' + tot + ' missions · ' + pct + '%';
  document.getElementById('projProgressFill').style.width = pct + '%';

  var mc = document.getElementById('missionsCount');
  if (mc) mc.textContent = tot + ' mission' + (tot > 1 ? 's' : '') + ' · ' + don + ' réalisée' + (don > 1 ? 's' : '');
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLETS
   ═══════════════════════════════════════════════════════════════════════════ */
function switchTab(tabId) {
  document.querySelectorAll('.dash-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.tab-pane').forEach(function(t){ t.classList.remove('active'); });
  var btn  = document.querySelector('[data-tab="' + tabId + '"]');
  var pane = document.getElementById(tabId);
  if (btn)  btn.classList.add('active');
  if (pane) pane.classList.add('active');
}

function renderTabs() {
  document.querySelectorAll('.dash-tab').forEach(function(btn) {
    btn.onclick = function() { switchTab(btn.dataset.tab); };
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CALCULS FINANCIERS
   ═══════════════════════════════════════════════════════════════════════════ */
function calcFinance() {
  var coutEngage = 0, coutPrev = 0;
  var economieSelf = 0, economiePrev = 0;
  var aideObtenue = 0, aidePrev = 0;
  var servicesObtained = [], servicesPrev = [];

  proj().missions.forEach(function(m) {
    if (m.type === 'subvention') {
      if (m.prix > 0) { m.done ? (aideObtenue += m.prix) : (aidePrev += m.prix); }
      else            { m.done ? servicesObtained.push(m) : servicesPrev.push(m); }
    } else {
      if (m.delegation !== 'self') { m.done ? (coutEngage += m.prix || 0) : (coutPrev += m.prix || 0); }
      else                         { m.done ? (economieSelf += m.prix || 0) : (economiePrev += m.prix || 0); }
    }
  });

  return {
    coutEngage:    coutEngage,
    coutPrev:      coutPrev,
    totalCout:     coutEngage + coutPrev,
    economieSelf:  economieSelf,
    economiePrev:  economiePrev,
    totalEconomie: economieSelf + economiePrev,
    aideObtenue:   aideObtenue,
    aidePrev:      aidePrev,
    totalAide:     aideObtenue + aidePrev,
    servicesObtained: servicesObtained,
    servicesPrev:     servicesPrev,
  };
}

function getBudget() { return (proj().budget1 || 0) + (proj().budget2 || 0); }

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET BILAN
   ═══════════════════════════════════════════════════════════════════════════ */
function renderBilan() {
  var wrap = document.getElementById('bilanContent');
  if (!wrap) return;
  if (!currentUser.partenaire) { renderLockedBilan(); return; }

  var p      = proj();
  var f      = calcFinance();
  var budget = getBudget();
  var pct    = budget > 0 ? Math.min(Math.round(f.totalCout / budget * 100), 100) : 0;
  var restant= budget - f.totalCout;

  wrap.innerHTML = '';

  /* ── Budget card ── */
  var bc = document.createElement('div');
  bc.className = 'budget-card';
  var b1 = p.budget1 > 0
    ? '<div style="margin-bottom:12px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:4px">' + p.budget1Label + '</div>'
      + '<div style="font-family:\'Lora\',serif;font-size:20px;font-weight:600;color:var(--text)">' + p.budget1.toLocaleString('fr-FR') + ' ' + (p.budget1Suffix || '€') + '</div></div>'
    : '';
  var b2 = p.budget2 > 0
    ? '<div class="budget-amount-row"><div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:4px">' + p.budget2Label + '</div>'
      + '<div class="budget-amount" id="budgetDisplay">' + p.budget2.toLocaleString('fr-FR') + ' €</div></div>'
      + '<button class="budget-edit-btn" onclick="editBudget()">✏️ Modifier</button></div>'
    : '';
  var progressHTML = budget > 0
    ? '<div style="margin-top:14px">'
      + '<div class="budget-progress-label"><span>' + pct + '% engagé</span><span>' + f.totalCout.toLocaleString('fr-FR') + ' € / ' + budget.toLocaleString('fr-FR') + ' €</span></div>'
      + '<div class="budget-progress-bar"><div class="budget-progress-fill ' + (pct < 80 ? 'green' : pct < 100 ? 'orange' : 'red') + '" style="width:' + pct + '%"></div></div>'
      + '<div class="budget-restant"><div class="budget-restant-label">Budget restant</div>'
      + '<div class="budget-restant-value" style="color:' + (restant >= 0 ? 'var(--green)' : 'var(--red)') + '">'
      + (restant >= 0 ? '' : '− ') + Math.abs(restant).toLocaleString('fr-FR') + ' € ' + (restant >= 0 ? '🟢' : '🔴') + '</div></div></div>'
    : '';
  bc.innerHTML = '<div class="budget-card-title">Budget du projet</div>' + b1 + b2 + progressHTML;
  wrap.appendChild(bc);

  /* ── Synthèse ── */
  var svcTotal = f.servicesObtained.length + f.servicesPrev.length;
  var sc = document.createElement('div');
  sc.className = 'synthese-card';
  sc.innerHTML =
    '<div class="synthese-row"><div><div class="synthese-label">Ce projet vous coûte</div><div class="synthese-sub">Missions déléguées réalisées + à venir</div></div><div class="synthese-value cost">− ' + f.totalCout.toLocaleString('fr-FR') + ' €</div></div>' +
    '<div class="synthese-row"><div><div class="synthese-label">Vous avez économisé</div><div class="synthese-sub">Missions faites vous-même</div></div><div class="synthese-value saving">+ ' + f.totalEconomie.toLocaleString('fr-FR') + ' €</div></div>' +
    '<div class="synthese-row"><div><div class="synthese-label">Vous avez bénéficié</div><div class="synthese-sub">Aides financières obtenues + à venir</div></div><div class="synthese-value benefit">+ ' + f.totalAide.toLocaleString('fr-FR') + ' €</div></div>' +
    (svcTotal > 0
      ? '<div class="services-row" onclick="toggleDetail()"><div><div class="synthese-label">Services obtenus</div><div class="synthese-sub">Garanties & facilités</div></div><div style="display:flex;align-items:center;gap:8px"><div class="services-count">' + svcTotal + '</div><span style="font-size:12px;color:var(--muted)">Voir ▼</span></div></div>'
      : '');
  wrap.appendChild(sc);

  /* ── Trophée ── */
  var gain = f.totalEconomie + f.totalAide;
  if (gain > 0) {
    var eq = getEquivalent(gain, p.type);
    var ec = document.createElement('div');
    ec.className = 'equiv-card';
    ec.innerHTML =
      '<div class="equiv-trophy">🏆</div>' +
      '<div class="equiv-title">Votre gain total estimé</div>' +
      '<div class="equiv-amount">+ ' + gain.toLocaleString('fr-FR') + ' €</div>' +
      '<div class="equiv-sub">' + eq.line1 + '<br>' + eq.line2 + '</div>' +
      (currentUser.partenaire ? '<div class="equiv-note">💡 Grâce à votre entreprise partenaire, ces aides ont été identifiées pour vous.</div>' : '');
    wrap.appendChild(ec);
  }

  /* ── Bouton détail ── */
  var tb = document.createElement('button');
  tb.className = 'detail-toggle'; tb.id = 'detailToggle';
  tb.onclick = toggleDetail; tb.textContent = '▼ Voir le détail complet';
  wrap.appendChild(tb);

  /* ── Panneau détail ── */
  var dp = document.createElement('div');
  dp.className = 'detail-panel'; dp.id = 'detailPanel';
  dp.innerHTML = buildDetailHTML(f);
  wrap.appendChild(dp);
}

function getEquivalent(amount, type) {
  var p = proj();
  if (type === 'location')   return { line1: '≈ ' + Math.round(amount / (p.budget1 || 800)) + ' mois de loyer CC économisés', line2: 'ou ' + Math.round(amount / 50) + ' mois d\'abonnements' };
  if (type === 'vente')      return { line1: '≈ économie vs agence classique à 4%', line2: 'soit ' + Math.round(amount / 2400) + ' mois de salaire net' };
  if (type === 'renovation') return { line1: '≈ aides récupérées grâce à Home in Love', line2: 'soit ' + Math.round(amount / 350) + ' mois de remboursement de prêt' };
  return { line1: '≈ ' + Math.round(amount / 50) + ' mois d\'abonnements', line2: 'économisés grâce à Home in Love' };
}

function buildDetailHTML(f) {
  var svc = f.servicesObtained.concat(f.servicesPrev);
  var html =
    '<div class="detail-section">' +
      '<div class="detail-section-title">💸 Dépenses</div>' +
      '<div class="detail-line"><div class="detail-line-name">Engagées (réalisées)<div class="detail-sub">Missions déléguées terminées</div></div><div class="detail-line-amount cost">− ' + f.coutEngage.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-line"><div class="detail-line-name">Prévisionnelles (à venir)<div class="detail-sub">Missions déléguées restantes</div></div><div class="detail-line-amount cost">− ' + f.coutPrev.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-total-line"><span>Total dépenses</span><span class="detail-line-amount cost">− ' + f.totalCout.toLocaleString('fr-FR') + ' €</span></div>' +
    '</div>' +
    '<div class="detail-section">' +
      '<div class="detail-section-title">💪 Économies (missions faites vous-même)</div>' +
      '<div class="detail-line"><div class="detail-line-name">Réalisées<div class="detail-sub">Missions "Je fais" terminées</div></div><div class="detail-line-amount saving">+ ' + f.economieSelf.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-line"><div class="detail-line-name">À venir<div class="detail-sub">Missions "Je fais" restantes</div></div><div class="detail-line-amount saving">+ ' + f.economiePrev.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-total-line"><span>Total économisé</span><span class="detail-line-amount saving">+ ' + f.totalEconomie.toLocaleString('fr-FR') + ' €</span></div>' +
    '</div>' +
    '<div class="detail-section">' +
      '<div class="detail-section-title">🎁 Aides financières</div>' +
      '<div class="detail-line"><div class="detail-line-name">Obtenues<div class="detail-sub">Aides débloquées</div></div><div class="detail-line-amount benefit">+ ' + f.aideObtenue.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-line"><div class="detail-line-name">À obtenir<div class="detail-sub">Dossiers en cours</div></div><div class="detail-line-amount benefit">+ ' + f.aidePrev.toLocaleString('fr-FR') + ' €</div></div>' +
      '<div class="detail-total-line"><span>Total aides</span><span class="detail-line-amount benefit">+ ' + f.totalAide.toLocaleString('fr-FR') + ' €</span></div>' +
    '</div>';

  if (svc.length > 0) {
    html += '<div class="detail-section"><div class="detail-section-title">✅ Services & subventions</div>';
    svc.forEach(function(s) {
      html += '<div class="detail-service-item"><div class="detail-service-icon">' + (s.done ? '✅' : '⏳') + '</div>'
        + '<div><div class="detail-service-name">' + s.name.replace(/^[🎁🏦🤝]\s*/, '') + '</div>'
        + '<div class="detail-service-desc">' + (s.done ? 'Obtenu' : 'En cours') + ' · Gratuit' + (s.delegation === 'timonia' ? ' · Home in Love' : '') + '</div></div></div>';
    });
    html += '</div>';
  }
  return html;
}

function toggleDetail() {
  detailOpen = !detailOpen;
  var panel = document.getElementById('detailPanel');
  var btn   = document.getElementById('detailToggle');
  if (panel) panel.classList.toggle('open', detailOpen);
  if (btn)   btn.textContent = detailOpen ? '▲ Masquer le détail' : '▼ Voir le détail complet';
}

function editBudget() {
  var display = document.getElementById('budgetDisplay');
  if (!display) return;
  var input = document.createElement('input');
  input.type = 'number'; input.className = 'budget-edit-input'; input.value = proj().budget2;
  input.onblur    = function() { proj().budget2 = parseFloat(input.value) || 0; renderBilan(); };
  input.onkeydown = function(e) { if (e.key === 'Enter') input.blur(); };
  display.replaceWith(input); input.focus();
}

function renderLockedBilan() {
  var f = calcFinance();
  /* Affiche la structure avec chiffres floutés */
  document.getElementById('bilanContent').innerHTML =
    '<div style="position:relative">' +
      /* Carte synthèse floue */
      '<div class="synthese-card" style="filter:blur(5px);pointer-events:none;user-select:none">' +
        '<div class="synthese-row"><div><div class="synthese-label">Ce projet vous coûte</div><div class="synthese-sub">Missions déléguées</div></div><div class="synthese-value cost">− ••• €</div></div>' +
        '<div class="synthese-row"><div><div class="synthese-label">Vous avez économisé</div><div class="synthese-sub">Missions faites vous-même</div></div><div class="synthese-value saving">+ ••• €</div></div>' +
        '<div class="synthese-row"><div><div class="synthese-label">Vous avez bénéficié</div><div class="synthese-sub">Aides financières</div></div><div class="synthese-value benefit">+ ••• €</div></div>' +
      '</div>' +
      /* Carte trophée floue */
      '<div class="equiv-card" style="filter:blur(5px);pointer-events:none;user-select:none;margin-top:16px">' +
        '<div class="equiv-trophy">🏆</div>' +
        '<div class="equiv-title">Votre gain total estimé</div>' +
        '<div class="equiv-amount">+ ••• €</div>' +
        '<div class="equiv-sub">Nos experts ont identifié des aides pour votre projet</div>' +
      '</div>' +
      /* Overlay CTA */
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;padding:32px;text-align:center;background:rgba(var(--bg-rgb,247,248,252),0.7);backdrop-filter:blur(2px);border-radius:18px">' +
        '<div style="font-size:2rem">🔒</div>' +
        '<div style="font-family:\'Lora\',serif;font-size:20px;font-weight:600;color:var(--text)">Vos chiffres sont prêts</div>' +
        '<div style="font-size:14px;color:var(--muted);max-width:340px">Nos experts ont calculé vos économies et aides financières. Déverrouillez pour voir le détail complet.</div>' +
        '<button class="btn btn-primary" onclick="alert(\'Redirection vers les offres Home in Love...\')">Voir mon bilan complet →</button>' +
        '<button class="btn btn-outline btn-sm" onclick="alert(\'Vérification partenaire...\')">💡 Mon entreprise est peut-être partenaire</button>' +
      '</div>' +
    '</div>';
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET MISSIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function renderMissions() {
  if (!currentUser.partenaire) {
    renderFreeMissions();
    return;
  }
  renderMissionList();
  renderMissionTimeline();
}

/* Non-partenaire : liste vide, saisie libre, CTA en bas */
/* ── Limites freemium ── */
var FREEMIUM_LIMITS = { missions: 5, prestataires: 3, documents: 5 };

function freemiumAtLimit(type) {
  var p = proj();
  if (type === 'missions')     return p.missions.length >= FREEMIUM_LIMITS.missions;
  if (type === 'prestataires') return p.prestataires.length >= FREEMIUM_LIMITS.prestataires;
  if (type === 'documents') {
    var total = p.documents.sections.reduce(function(acc, s){ return acc + s.items.length; }, 0);
    return total >= FREEMIUM_LIMITS.documents;
  }
  return false;
}

function freemiumLimitBanner(type, current, max) {
  var reached = current >= max;
  return '<div class="freemium-limit-bar' + (reached ? ' reached' : '') + '">' +
    '<span>' + (reached
      ? '🔒 Limite atteinte (' + max + '/' + max + ') — passez à l\'offre complète pour continuer'
      : '📊 ' + current + ' / ' + max + ' ' + type + ' utilisé' + (current > 1 ? 's' : '') + ' — limit freemium') +
    '</span>' +
    (reached
      ? '<button class="btn btn-primary btn-sm" onclick="alert(\'Offres Home in Love...\')">Débloquer →</button>'
      : '<button class="btn btn-outline btn-sm" onclick="alert(\'Offres Home in Love...\')">Voir l\'offre complète</button>') +
  '</div>';
}

function renderFreeMissions() {
  var content = document.getElementById('missionsContent');
  var p = proj();
  var max = FREEMIUM_LIMITS.missions;
  var count = p.missions.length;

  var toolbar =
    '<div class="missions-toolbar">' +
      '<div class="missions-count" id="missionsCount">' +
        (count === 0 ? 'Aucune mission pour l\'instant'
          : count + ' mission' + (count > 1 ? 's' : '') + ' ajoutée' + (count > 1 ? 's' : '')) +
      '</div>' +
    '</div>';

  var limitBar = freemiumLimitBanner('missions', count, max);

  var tableRows = count === 0
    ? '<tr><td colspan="5" style="text-align:center;padding:40px 0;color:var(--muted);font-size:14px">' +
        '📋 Commencez par ajouter vos premières missions ci-dessous.<br>' +
        '<span style="font-size:12px">Nos experts en ont identifié <strong>20 à 30</strong> pour votre type de projet.</span>' +
      '</td></tr>'
    : p.missions.slice().sort(function(a,b){
        return (a.date||'zz') > (b.date||'zz') ? 1 : -1;
      }).map(function(m) {
        var ti = MISSION_TYPES[m.type] || MISSION_TYPES['mission'];
        return '<tr class="mission-row' + (m.done ? ' done' : '') + '">' +
          '<td><div class="task-check ' + (m.done ? 'checked' : '') + '" onclick="toggleMission(' + m.id + ')">' + (m.done ? '✓' : '') + '</div></td>' +
          '<td class="mission-name"><input type="text" class="mission-name-input" value="' + m.name.replace(/"/g,'&quot;') + '" onchange="changeName(' + m.id + ',this.value)"></td>' +
          '<td><select class="type-select ' + ti.color + '" onchange="changeType(' + m.id + ',this)">' +
            Object.keys(MISSION_TYPES).map(function(k){ return '<option value="' + k + '" ' + (m.type===k?'selected':'') + '>' + MISSION_TYPES[k].label + '</option>'; }).join('') +
          '</select></td>' +
          '<td><input type="date" class="date-input" value="' + (m.date || '') + '" onchange="changeDate(' + m.id + ',this.value)"></td>' +
          '<td><button class="btn-row-delete" onclick="deleteMission(' + m.id + ')">✕</button></td>' +
        '</tr>';
      }).join('');

  var addBtn = count < max
    ? '<button class="btn-add-mission" onclick="addMissionFree()">＋ Ajouter une mission</button>'
    : '<button class="btn-add-mission" style="opacity:0.4;cursor:not-allowed" disabled>＋ Limite atteinte (' + max + '/' + max + ')</button>';

  var listView =
    '<div id="listViewWrap">' +
      '<table class="mission-table">' +
        '<thead><tr>' +
          '<th style="width:36px"></th><th>Mission</th><th>Type</th><th>Date prévue</th><th style="width:36px"></th>' +
        '</tr></thead>' +
        '<tbody id="missionBody">' + tableRows + '</tbody>' +
      '</table>' +
      addBtn +
    '</div>';

  var cta =
    '<div class="missions-free-cta">' +
      '<div class="missions-free-cta-inner">' +
        '<div class="missions-free-cta-left">' +
          '<div class="missions-free-cta-title">🚀 Vous manquez peut-être des étapes clés</div>' +
          '<div class="missions-free-cta-desc">Nos experts ont une checklist complète de <strong>20 à 30 missions</strong> pour votre projet — aides financières incluses. Un appel suffit pour tout découvrir.</div>' +
        '</div>' +
        '<div class="missions-free-cta-actions">' +
          '<button class="btn btn-primary" onclick="alert(\'Prise de RDV...\')">📞 Parler à un expert</button>' +
          '<button class="btn btn-outline" onclick="alert(\'Offres...\')">Voir les offres</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  content.innerHTML = toolbar + limitBar + listView + cta;
}

function addMissionFree() {
  if (freemiumAtLimit('missions')) {
    alert('Limite de ' + FREEMIUM_LIMITS.missions + ' missions atteinte.\nPassez à l\'offre complète pour ajouter des missions illimitées !');
    return;
  }
  var name = prompt('Nom de la mission :');
  if (!name) return;
  var keys = Object.keys(MISSION_TYPES);
  var tc   = prompt('Type (' + keys.join(' / ') + ') :', 'mission') || 'mission';
  proj().missions.push({
    id: proj().nextMissionId++,
    name: name,
    type: MISSION_TYPES[tc] ? tc : 'mission',
    date: '', prix: 0,
    delegation: 'self', delegatee: '',
    done: false, validated: false,
  });
  renderFreeMissions();
  renderProjectHeader();
}

function renderMissionList() {
  var tbody = document.getElementById('missionBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var sorted = proj().missions.slice().sort(function(a, b) {
    return (a.date || 'zz') > (b.date || 'zz') ? 1 : -1;
  });

  sorted.forEach(function(m) {
    var ti = MISSION_TYPES[m.type] || MISSION_TYPES['mission'];
    var pc = m.type === 'subvention' ? 'price-benefit' : m.delegation === 'self' ? 'price-saving' : 'price-cost';
    var tr = document.createElement('tr');
    tr.className = 'mission-row' + (m.done ? ' done' : '');
    tr.innerHTML =
      '<td><div class="task-check ' + (m.done ? 'checked' : '') + '" onclick="toggleMission(' + m.id + ')">' + (m.done ? '✓' : '') + '</div></td>' +
      '<td class="mission-name"><input type="text" class="mission-name-input" value="' + m.name.replace(/"/g, '&quot;') + '" onchange="changeName(' + m.id + ',this.value)" title="Cliquez pour modifier"></td>' +
      '<td><select class="type-select ' + ti.color + '" onchange="changeType(' + m.id + ',this)">' +
        Object.keys(MISSION_TYPES).map(function(k){ return '<option value="' + k + '" ' + (m.type === k ? 'selected' : '') + '>' + MISSION_TYPES[k].label + '</option>'; }).join('') +
      '</select></td>' +
      '<td><input type="date" class="date-input" value="' + (m.date || '') + '" onchange="changeDate(' + m.id + ',this.value)"></td>' +
      '<td><select class="deleg-select" onchange="changeDeleg(' + m.id + ',this)">' +
        '<option value="self"    ' + (m.delegation === 'self'    ? 'selected' : '') + '>✋ Je fais</option>' +
        '<option value="timonia" ' + (m.delegation === 'timonia' ? 'selected' : '') + '>⭐ Home in Love</option>' +
        '<option value="other"   ' + (m.delegation === 'other'   ? 'selected' : '') + '>👤 Autre</option>' +
      '</select></td>' +
      '<td>' +
        '<input type="text" class="deleg-input ' + (m.delegation === 'other' ? '' : 'hidden') + '" value="' + (m.delegatee || '') + '" placeholder="Qui ?" onchange="changeDelegatee(' + m.id + ',this.value)">' +
        (m.delegation === 'timonia' && !m.done ? '<span style="font-size:11px;color:var(--accent)">⭐ Home in Love</span>' : '') +
        (m.delegation === 'self'    && !m.done ? '<span style="font-size:11px;color:var(--teal)">✋ Moi</span>'      : '') +
      '</td>' +
      '<td><input type="number" class="price-input ' + (m.validated ? 'validated' : 'estimated') + ' ' + pc + '" value="' + (m.prix || 0) + '" min="0" onchange="changePrice(' + m.id + ',this.value)" title="' + (m.validated ? 'Prix validé ✅' : 'Prix estimatif 💡') + '"></td>' +
      '<td><button class="btn-row-delete" onclick="deleteMission(' + m.id + ')">✕</button></td>';
    tbody.appendChild(tr);
  });

  var mc = document.getElementById('missionsCount');
  if (mc) {
    var t = proj().missions.length;
    var d = proj().missions.filter(function(m){ return m.done; }).length;
    mc.textContent = t + ' mission' + (t > 1 ? 's' : '') + ' · ' + d + ' réalisée' + (d > 1 ? 's' : '');
  }
}

function renderMissionTimeline() {
  var wrap = document.getElementById('timelineWrap');
  if (!wrap) return;

  var sorted = proj().missions.slice().sort(function(a, b) {
    return (a.date || 'zz') > (b.date || 'zz') ? 1 : -1;
  });

  var months = {};
  sorted.forEach(function(m) {
    var k = m.date ? m.date.slice(0, 7) : 'sans-date';
    if (!months[k]) months[k] = [];
    months[k].push(m);
  });

  wrap.innerHTML = '';
  Object.keys(months).forEach(function(month) {
    var missions = months[month];
    var div      = document.createElement('div');
    div.className= 'timeline-month';
    var label    = month === 'sans-date'
      ? 'Sans date planifiée'
      : new Date(month + '-01').toLocaleDateString('fr-FR', { month:'long', year:'numeric' });
    div.innerHTML = '<div class="timeline-month-label">' + label + '</div>';

    missions.forEach(function(m, i) {
      var dc = m.type==='subvention' ? 'var(--green)' : m.type==='aide' ? 'var(--gold)' : m.delegation==='timonia' ? 'var(--accent)' : m.delegation==='self' ? 'var(--teal)' : 'var(--purple)';
      var dl = m.delegation==='timonia' ? '⭐ Home in Love' : m.delegation==='self' ? '✋ Moi' : '👤 ' + (m.delegatee || 'Autre');
      var ti = MISSION_TYPES[m.type] || MISSION_TYPES['mission'];
      div.innerHTML +=
        '<div class="timeline-item">' +
          '<div class="tl-dot-col">' +
            '<div class="tl-dot" style="background:' + dc + ';' + (m.done ? 'opacity:0.4' : '') + '"></div>' +
            (i < missions.length - 1 ? '<div class="tl-line"></div>' : '') +
          '</div>' +
          '<div class="tl-card" style="' + (m.done ? 'opacity:0.55' : '') + '">' +
            '<div class="tl-card-title" style="' + (m.done ? 'text-decoration:line-through;color:var(--muted)' : '') + '">' + (m.done ? '✓ ' : '') + m.name + '</div>' +
            '<div class="tl-card-meta">' +
              '<span>' + fmtDate(m.date) + '</span>' +
              '<span style="color:' + dc + '">' + dl + '</span>' +
              '<span class="type-badge ' + ti.color + '" style="font-size:10px">' + ti.label + '</span>' +
              (m.prix > 0 ? '<span style="font-weight:700">' + m.prix.toLocaleString('fr-FR') + ' €</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
    });
    wrap.appendChild(div);
  });
}

function switchView(view) {
  document.getElementById('listViewWrap').style.display = view === 'list' ? 'block' : 'none';
  var tl = document.getElementById('timelineWrap');
  if (tl) tl.className = 'timeline-wrap' + (view === 'timeline' ? ' active' : '');
  document.getElementById('viewListBtn').classList.toggle('active', view === 'list');
  document.getElementById('viewTlBtn').classList.toggle('active', view === 'timeline');
}

/* Actions missions */
function toggleMission(id) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) { m.done = !m.done; renderMissionList(); renderMissionTimeline(); renderBilan(); renderProjectHeader(); }
}
function changeDate(id, val) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) { m.date = val; renderMissionTimeline(); }
}
function changeDeleg(id, sel) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) { m.delegation = sel.value; renderMissionList(); renderBilan(); }
}
function changeDelegatee(id, val) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) m.delegatee = val;
}
function changePrice(id, val) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) { m.prix = parseFloat(val) || 0; m.validated = true; renderBilan(); }
}

function changeName(id, val) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m && val.trim()) { m.name = val.trim(); renderMissionTimeline(); }
}
function changeType(id, sel) {
  var m = proj().missions.find(function(x){ return x.id === id; });
  if (m) {
    m.type = sel.value;
    /* Met à jour la couleur du select */
    var ti = MISSION_TYPES[sel.value] || MISSION_TYPES['mission'];
    sel.className = 'type-select ' + ti.color;
    renderBilan();
  }
}

function deleteMission(id) {
  proj().missions = proj().missions.filter(function(x){ return x.id !== id; });
  renderMissionList(); renderMissionTimeline(); renderBilan(); renderProjectHeader();
}
function addMission() {
  var name = prompt('Nom de la mission :'); if (!name) return;
  var keys = Object.keys(MISSION_TYPES);
  var tc   = prompt('Type (' + keys.join(' / ') + ') :', 'mission') || 'mission';
  var prix = parseFloat(prompt('Prix estimatif (€) :', '0')) || 0;
  proj().missions.push({
    id: proj().nextMissionId++, name: name,
    type: MISSION_TYPES[tc] ? tc : 'mission',
    date: '', prix: prix,
    delegation: prix > 0 ? 'timonia' : 'self',
    delegatee: '', done: false, validated: false,
  });
  renderMissionList(); renderMissionTimeline(); renderBilan(); renderProjectHeader();
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOUTONS EN-TÊTE — EXPERT & TOUT DÉLÉGUER
   ═══════════════════════════════════════════════════════════════════════════ */

/* Annuaire des experts par entreprise partenaire */
var EXPERTS = {
  'Orange':            { nom:'Claire Dupont',    tel:'06 12 34 56 78', specialite:'Recherche locative & achat', avatar:'CD' },
  'Société Générale':  { nom:'Marc Lefevre',     tel:'06 23 45 67 89', specialite:'Financement & achat immobilier', avatar:'ML' },
  'SNCF':              { nom:'Sophie Arnaud',    tel:'06 34 56 78 90', specialite:'Mise en location & gestion', avatar:'SA' },
  'Airbus':            { nom:'Thomas Renard',    tel:'06 45 67 89 01', specialite:'Vente & transaction', avatar:'TR' },
  'EDF':               { nom:'Julie Martin',     tel:'06 56 78 90 12', specialite:'Rénovation énergétique & aides', avatar:'JM' },
};
var EXPERT_DEFAULT = { nom:'Équipe Home in Love',  tel:'01 XX XX XX XX', specialite:'Accompagnement immobilier', avatar:'⭐' };

function openExpertModal() {
  var expert = (currentUser.entreprise && EXPERTS[currentUser.entreprise]) ? EXPERTS[currentUser.entreprise] : EXPERT_DEFAULT;
  var isPartner = currentUser.partenaire;

  var m = document.createElement('div');
  m.className = 'modal-bg'; m.id = 'expertModal';
  m.innerHTML =
    '<div class="modal-box" style="max-width:380px;text-align:center">' +
      '<button class="modal-close" onclick="closeModal(\'expertModal\')" style="position:absolute;top:16px;right:16px">✕</button>' +
      '<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;margin:0 auto 16px">' + expert.avatar + '</div>' +
      '<div style="font-family:\'Lora\',serif;font-size:20px;font-weight:600;margin-bottom:4px">' + expert.nom + '</div>' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:20px">' + expert.specialite + '</div>' +
      (isPartner
        ? '<a href="tel:' + expert.tel.replace(/\s/g,'') + '" class="btn btn-primary w-full" style="display:block;text-decoration:none;margin-bottom:10px">📞 Appeler — ' + expert.tel + '</a>'
        : '<div style="font-size:13px;color:var(--muted);padding:14px;background:var(--surf2);border-radius:10px;margin-bottom:10px">📞 Numéro disponible avec l\'accompagnement Home in Love</div>') +
      '<button class="btn btn-outline w-full" onclick="closeModal(\'expertModal\')">Fermer</button>' +
      (isPartner ? '<div style="font-size:11px;color:var(--muted);margin-top:12px">Expert dédié à ' + (currentUser.entreprise || 'votre entreprise') + '</div>' : '') +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if (e.target === m) closeModal('expertModal'); });
}

function openDeleguerModal() {
  var missions = proj().missions.filter(function(m){ return !m.done && m.delegation !== 'timonia'; });
  var total    = missions.reduce(function(acc, m){ return acc + (m.prix || 0); }, 0);

  var m = document.createElement('div');
  m.className = 'modal-bg'; m.id = 'deleguerModal';
  m.innerHTML =
    '<div class="modal-box" style="max-width:440px">' +
      '<div class="modal-header">' +
        '<div><div class="modal-title">🤝 Tout déléguer à Home in Love</div><div class="modal-sub">Home in Love prend en charge toutes vos missions restantes</div></div>' +
        '<button class="modal-close" onclick="closeModal(\'deleguerModal\')">✕</button>' +
      '</div>' +
      '<div style="padding:20px">' +
        '<div style="background:var(--surf2);border-radius:12px;padding:16px;margin-bottom:20px">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
            '<span style="font-size:13px;color:var(--muted)">Missions à déléguer</span>' +
            '<span style="font-weight:700">' + missions.length + ' mission' + (missions.length > 1 ? 's' : '') + '</span>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between">' +
            '<span style="font-size:13px;color:var(--muted)">Coût estimé total</span>' +
            '<span style="font-weight:700;color:var(--accent)">' + total.toLocaleString('fr-FR') + ' €</span>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:13px;color:var(--muted);margin-bottom:20px">⚠️ Toutes les missions non réalisées seront basculées vers Home in Love. Vous pourrez les modifier individuellement ensuite.</div>' +
        '<button class="btn btn-primary w-full" onclick="confirmDeleguerAll()" style="margin-bottom:10px">Confirmer la délégation →</button>' +
        '<button class="btn btn-outline w-full" onclick="closeModal(\'deleguerModal\')">Annuler</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if (e.target === m) closeModal('deleguerModal'); });
}

function confirmDeleguerAll() {
  proj().missions.forEach(function(m) {
    if (!m.done) { m.delegation = 'timonia'; m.delegatee = ''; }
  });
  closeModal('deleguerModal');
  renderMissionList();
  renderMissionTimeline();
  renderBilan();
  renderProjectHeader();
  /* Petit feedback visuel */
  var banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;z-index:9999;box-shadow:0 4px 20px rgba(30,99,240,0.3)';
  banner.textContent = '✅ Toutes les missions ont été déléguées à Home in Love';
  document.body.appendChild(banner);
  setTimeout(function(){ banner.remove(); }, 3000);
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.remove();
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET PRESTATAIRES
   ═══════════════════════════════════════════════════════════════════════════ */
function renderPrestataires() {
  var wrap = document.getElementById('prestContent');
  if (!wrap) return;
  if (!currentUser.partenaire) {
    var p     = proj();
    var max   = FREEMIUM_LIMITS.prestataires;
    var count = p.prestataires.length;
    wrap.innerHTML = '<div class="prest-grid" id="prestGrid"></div>' + freemiumLimitBanner('prestataires', count, max);
    var g = document.getElementById('prestGrid');
    p.prestataires.forEach(function(pr) {
      var card = document.createElement('div'); card.className = 'prest-card';
      card.innerHTML =
        '<div class="prest-card-header"><div class="prest-avatar ' + pr.type + '">' + pr.avatar + '</div>' +
        '<div><div class="prest-name">' + pr.nom + '</div><div class="prest-type">' + pr.specialite + '</div></div></div>' +
        '<div class="prest-contacts"><div class="prest-contact">📧 ' + pr.email + '</div><div class="prest-contact">📞 ' + pr.tel + '</div></div>' +
        '<div class="prest-missions">Missions : ' + pr.missions.join(' · ') + '</div>';
      g.appendChild(card);
    });
    if (count < max) {
      var ab = document.createElement('button'); ab.className = 'btn-add-prest';
      ab.innerHTML = '<div style="font-size:1.5rem">＋</div><div>Ajouter un prestataire</div>';
      ab.onclick = function() { alert('Formulaire ajout prestataire — à développer'); };
      g.appendChild(ab);
    } else {
      var lb = document.createElement('div');
      lb.className = 'prest-locked-card';
      lb.innerHTML = '<div style="font-size:1.5rem">🔒</div><div style="font-weight:700;margin-bottom:4px">Limite atteinte</div><div style="font-size:12px;color:var(--muted)">Ajoutez jusqu\'à 20 prestataires avec l\'accompagnement Home in Love</div><button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="alert(\'Offres...\')">Débloquer →</button>';
      g.appendChild(lb);
    }
    return;
  }
  wrap.innerHTML = '<div class="prest-grid" id="prestGrid"></div>';
  var g = document.getElementById('prestGrid');

  proj().prestataires.forEach(function(p) {
    var card = document.createElement('div');
    card.className = 'prest-card';
    card.innerHTML =
      '<div class="prest-card-header">' +
        '<div class="prest-avatar ' + p.type + '">' + p.avatar + '</div>' +
        '<div><div class="prest-name">' + p.nom + '</div><div class="prest-type">' + p.specialite + '</div></div>' +
      '</div>' +
      '<div class="prest-contacts">' +
        '<div class="prest-contact">📧 <a href="mailto:' + p.email + '">' + p.email + '</a></div>' +
        '<div class="prest-contact">📞 ' + p.tel + '</div>' +
      '</div>' +
      '<div class="prest-finance">' +
        '<div class="prest-finance-item"><div class="prest-finance-label">Coût engagé</div><div class="prest-finance-value" style="color:var(--red)">' + p.coutEngage.toLocaleString('fr-FR') + ' €</div></div>' +
        '<div class="prest-finance-item"><div class="prest-finance-label">Prévisionnel</div><div class="prest-finance-value" style="color:var(--accent)">' + p.coutPrev.toLocaleString('fr-FR') + ' €</div></div>' +
      '</div>' +
      '<div class="prest-missions">Missions : ' + p.missions.join(' · ') + '</div>';
    g.appendChild(card);
  });

  var ab = document.createElement('button');
  ab.className = 'btn-add-prest';
  ab.innerHTML = '<div style="font-size:1.5rem">＋</div><div>Ajouter un prestataire</div>';
  ab.onclick   = function() { alert('Formulaire ajout prestataire — à développer'); };
  g.appendChild(ab);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET DOCUMENTS
   ═══════════════════════════════════════════════════════════════════════════ */
function renderDocuments() {
  var wrap = document.getElementById('docsContent');
  if (!wrap) return;
  if (!currentUser.partenaire) {
    var p     = proj();
    var max   = FREEMIUM_LIMITS.documents;
    var total = p.documents.sections.reduce(function(acc,s){ return acc + s.items.length; }, 0);
    wrap.innerHTML = '';

    var SC = {
      todo:    { icon:'⬜', label:'À fournir',  cls:'doc-status-todo'    },
      waiting: { icon:'⏳', label:'En attente', cls:'doc-status-waiting' },
      done:    { icon:'✅', label:'Reçu',       cls:'doc-status-done'    },
    };

    /* Affiche jusqu'à max documents au total */
    var shown = 0;
    p.documents.sections.forEach(function(section) {
      if (shown >= max) return;
      var visibleItems = section.items.slice(0, max - shown);
      shown += visibleItems.length;

      var div = document.createElement('div'); div.className = 'doc-section';
      div.innerHTML = '<div class="doc-section-title">' + section.title + '</div><div class="doc-list"></div>';
      wrap.appendChild(div);
      var list = div.querySelector('.doc-list');
      visibleItems.forEach(function(doc) {
        var cfg = SC[doc.status] || SC.todo;
        var item = document.createElement('div'); item.className = 'doc-item';
        item.innerHTML =
          '<div class="doc-item-status ' + cfg.cls + '">' + cfg.icon + '</div>' +
          '<div class="doc-item-name">' + doc.name + '</div>' +
          '<div class="doc-item-actions">' +
            '<button class="doc-action-btn" onclick="cycleDocStatus(\'' + section.title.replace(/'/g,"\\'") + '\',' + doc.id + ')">' + cfg.label + '</button>' +
          '</div>';
        list.appendChild(item);
      });
    });

    /* Barre de limite */
    var lb = document.createElement('div');
    lb.innerHTML = freemiumLimitBanner('documents', Math.min(total, max), max);
    wrap.appendChild(lb);

    if (total >= max) {
      var lockedDiv = document.createElement('div');
      lockedDiv.className = 'locked-cta'; lockedDiv.style.marginTop = '16px';
      lockedDiv.innerHTML =
        '<div class="locked-icon">🔒</div>' +
        '<div class="locked-title">Débloquez la checklist complète</div>' +
        '<div class="locked-desc">Avec l\'accompagnement Home in Love, accédez à la checklist documentaire complète et au suivi de chaque pièce.</div>' +
        '<button class="btn btn-primary" onclick="alert(\'Offres...\')">Voir l\'offre complète →</button>';
      wrap.appendChild(lockedDiv);
    }
    return;
  }
  wrap.innerHTML = '';

  var SC = {
    todo:    { icon:'⬜', label:'À fournir',  cls:'doc-status-todo'    },
    waiting: { icon:'⏳', label:'En attente', cls:'doc-status-waiting' },
    done:    { icon:'✅', label:'Reçu',       cls:'doc-status-done'    },
  };

  proj().documents.sections.forEach(function(section) {
    var div = document.createElement('div');
    div.className = 'doc-section';
    div.innerHTML = '<div class="doc-section-title">' + section.title + '</div><div class="doc-list"></div>';
    wrap.appendChild(div);
    var list = div.querySelector('.doc-list');

    section.items.forEach(function(doc) {
      var cfg  = SC[doc.status] || SC.todo;
      var item = document.createElement('div');
      item.className = 'doc-item';
      item.innerHTML =
        '<div class="doc-item-status ' + cfg.cls + '" title="' + cfg.label + '">' + cfg.icon + '</div>' +
        '<div class="doc-item-name">' + doc.name + '</div>' +
        '<div class="doc-item-actions">' +
          '<button class="doc-action-btn" onclick="cycleDocStatus(\'' + section.title.replace(/'/g, "\\'") + '\',' + doc.id + ')">' + cfg.label + '</button>' +
          '<button class="doc-action-btn" onclick="alert(\'Upload...\')">📎</button>' +
          '<button class="doc-action-btn danger" onclick="deleteDoc(\'' + section.title.replace(/'/g, "\\'") + '\',' + doc.id + ')">✕</button>' +
        '</div>';
      list.appendChild(item);
    });
  });

  /* Zone upload */
  var ud = document.createElement('div');
  ud.innerHTML =
    '<div class="doc-section">' +
      '<div class="doc-section-title">Documents uploadés</div>' +
      '<button class="btn-add-prest" style="width:100%;margin-top:0" onclick="document.getElementById(\'fileInput\').click()">' +
        '<div style="font-size:1.5rem">📎</div><div>Ajouter un document</div>' +
      '</button>' +
      '<input type="file" id="fileInput" style="display:none" onchange="handleUpload(event)">' +
      '<div id="uploadedList" style="margin-top:12px;display:flex;flex-direction:column;gap:6px"></div>' +
    '</div>';
  wrap.appendChild(ud);
  renderUploadedDocs();
}

function cycleDocStatus(sectionTitle, docId) {
  var statuses = ['todo', 'waiting', 'done'];
  var section  = proj().documents.sections.find(function(s){ return s.title === sectionTitle; });
  var doc      = section && section.items.find(function(d){ return d.id === docId; });
  if (doc) { var idx = statuses.indexOf(doc.status); doc.status = statuses[(idx + 1) % statuses.length]; renderDocuments(); }
}
function deleteDoc(sectionTitle, docId) {
  var section = proj().documents.sections.find(function(s){ return s.title === sectionTitle; });
  if (section) { section.items = section.items.filter(function(d){ return d.id !== docId; }); renderDocuments(); }
}
function handleUpload(event) {
  var file = event.target.files[0]; if (!file) return;
  proj().documents.uploaded.push({ name: file.name, date: new Date().toLocaleDateString('fr-FR') });
  renderUploadedDocs(); event.target.value = '';
}
function renderUploadedDocs() {
  var list = document.getElementById('uploadedList'); if (!list) return;
  list.innerHTML = '';
  var icons = { pdf:'📄', xlsx:'📊', xls:'📊', doc:'📝', docx:'📝', jpg:'🖼', png:'🖼', jpeg:'🖼' };
  proj().documents.uploaded.forEach(function(doc) {
    var ext = doc.name.split('.').pop().toLowerCase();
    var div = document.createElement('div'); div.className = 'doc-item';
    div.innerHTML = '<div style="font-size:1.2rem">' + (icons[ext] || '📎') + '</div><div class="doc-item-name">' + doc.name + '</div><div class="doc-item-actions"><span style="font-size:11px;color:var(--muted)">' + doc.date + '</span></div>';
    list.appendChild(div);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ONGLET NOTES
   ═══════════════════════════════════════════════════════════════════════════ */
function renderNotes() {
  var list = document.getElementById('notesList'); if (!list) return;
  list.innerHTML = '';
  if (proj().notes.length === 0) {
    list.innerHTML = '<div class="notes-empty">📝 Aucune note pour l\'instant.<br>Commencez à noter vos observations !</div>';
    return;
  }
  var sorted = proj().notes.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  sorted.forEach(function(note) {
    var card = document.createElement('div'); card.className = 'note-card anim-in';
    card.innerHTML =
      '<div class="note-header">' +
        '<div class="note-timestamp">🕐 ' + fmtDateTime(note.date) + '</div>' +
        '<button class="note-delete" onclick="deleteNote(' + note.id + ')">✕</button>' +
      '</div>' +
      '<div class="note-text">' + escHtml(note.text) + '</div>';
    list.appendChild(card);
  });
}

function addNote() {
  var ta   = document.getElementById('noteInput');
  var text = ta.value.trim(); if (!text) return;
  proj().notes.push({ id: proj().nextNoteId++, text: text, date: new Date().toISOString() });
  ta.value = ''; renderNotes();
}
function deleteNote(id) {
  proj().notes = proj().notes.filter(function(n){ return n.id !== id; });
  renderNotes();
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITAIRES
   ═══════════════════════════════════════════════════════════════════════════ */
function fmtDeadline(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { month:'long', year:'numeric' });
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });
}
function fmtDateTime(d) {
  var date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })
    + ' à ' + date.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
/* ═══════════════════════════════════════════════════════════════════════════
   MODAL — APPELER MON EXPERT
   ═══════════════════════════════════════════════════════════════════════════ */
/* Experts rattachés à chaque entreprise partenaire (démo) */
var EXPERTS_MAP = {
  'Orange':           { nom:'Camille Rousseau',  tel:'06 12 34 56 78', avatar:'CR', specialite:'Recherche Location & Achat' },
  'Société Générale': { nom:'Marc Lefebvre',     tel:'06 23 45 67 89', avatar:'ML', specialite:'Achat & Financement' },
  'SNCF':             { nom:'Isabelle Garnier',  tel:'06 34 56 78 90', avatar:'IG', specialite:'Mise en Location & Gestion' },
  'Airbus':           { nom:'Nicolas Fontaine',  tel:'06 45 67 89 01', avatar:'NF', specialite:'Vente & Négociation' },
  'EDF':              { nom:'Sophie Durand',     tel:'06 56 78 90 12', avatar:'SD', specialite:'Rénovation & Aides' },
};
var EXPERT_DEFAULT = { nom:'Équipe Home in Love', tel:'01 XX XX XX XX', avatar:'TM', specialite:'Accompagnement immobilier' };

function openExpertModal() {
  var expert = EXPERTS_MAP[currentUser.entreprise] || EXPERT_DEFAULT;
  var existing = document.getElementById('expertModal');
  if (existing) existing.remove();

  var m = document.createElement('div');
  m.className = 'modal-bg'; m.id = 'expertModal';
  m.innerHTML =
    '<div class="modal-box" style="max-width:380px;text-align:center">' +
      '<div class="modal-header" style="justify-content:flex-end;border:none;padding-bottom:0">' +
        '<button class="modal-close" onclick="document.getElementById(\'expertModal\').remove()">✕</button>' +
      '</div>' +
      '<div style="padding:8px 32px 32px">' +
        '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;margin:0 auto 16px">' + expert.avatar + '</div>' +
        '<div style="font-family:\'Lora\',serif;font-size:20px;font-weight:600;color:var(--text);margin-bottom:4px">' + expert.nom + '</div>' +
        '<div style="font-size:13px;color:var(--muted);margin-bottom:20px">' + expert.specialite + '</div>' +
        '<a href="tel:' + expert.tel.replace(/\s/g,'') + '" class="btn btn-primary w-full" style="display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-size:16px">📞 ' + expert.tel + '</a>' +
        '<div style="font-size:11px;color:var(--muted);margin-top:12px">Disponible du lundi au vendredi, 9h–18h</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if (e.target === m) m.remove(); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL — TOUT DÉLÉGUER À TIMONIA
   ═══════════════════════════════════════════════════════════════════════════ */
function openDeleguerModal() {
  var missions = proj().missions.filter(function(m){ return !m.done && m.delegation !== 'timonia'; });
  var cout = missions.reduce(function(acc, m){ return acc + (m.prix || 0); }, 0);
  var existing = document.getElementById('deleguerModal');
  if (existing) existing.remove();

  var m = document.createElement('div');
  m.className = 'modal-bg'; m.id = 'deleguerModal';
  m.innerHTML =
    '<div class="modal-box" style="max-width:420px">' +
      '<div class="modal-header">' +
        '<div><div class="modal-title">🤝 Tout déléguer à Home in Love</div><div class="modal-sub">Résumé avant confirmation</div></div>' +
        '<button class="modal-close" onclick="document.getElementById(\'deleguerModal\').remove()">✕</button>' +
      '</div>' +
      '<div style="padding:20px 28px 28px;display:flex;flex-direction:column;gap:16px">' +
        '<div style="background:var(--surf2);border-radius:12px;padding:16px;display:flex;gap:16px">' +
          '<div style="text-align:center;flex:1"><div style="font-size:24px;font-weight:800;color:var(--accent)">' + missions.length + '</div><div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em">missions</div></div>' +
          '<div style="width:1px;background:var(--border)"></div>' +
          '<div style="text-align:center;flex:1"><div style="font-size:24px;font-weight:800;color:var(--red)">− ' + cout.toLocaleString('fr-FR') + ' €</div><div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em">coût estimé</div></div>' +
        '</div>' +
        (missions.length === 0
          ? '<div style="text-align:center;color:var(--muted);padding:12px">✅ Toutes les missions restantes sont déjà déléguées à Home in Love.</div>'
          : '<div style="font-size:13px;color:var(--muted)">Les ' + missions.length + ' missions restantes seront assignées à ⭐ Home in Love. Vous pouvez modifier chaque mission individuellement après.</div>' +
            '<div style="display:flex;gap:10px">' +
              '<button class="btn btn-outline" style="flex:1" onclick="document.getElementById(\'deleguerModal\').remove()">Annuler</button>' +
              '<button class="btn btn-primary" style="flex:1" onclick="confirmDeleguerTout()">Confirmer →</button>' +
            '</div>') +
      '</div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if (e.target === m) m.remove(); });
}


