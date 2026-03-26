// ─── SALARIE PAGE LOGIC ───────────────────────────────────────────────────────

const COVERED_COMPANIES = [
  'veolia', 'edf', 'sncf', 'orange', 'total', 'engie', 'bnp', 'société générale',
  'axa', 'air france', 'renault', 'psa', 'stellantis', 'michelin', 'bouygues',
  'danone', 'l\'oréal', 'loreal', 'sanofi', 'schneider', 'saint-gobain',
];

// ─── COVERAGE CHECKER ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  const input  = document.getElementById('coverageInput');
  const btn    = document.getElementById('checkCoverage');
  const result = document.getElementById('coverageResult');

  function checkCoverage() {
    const val = input.value.toLowerCase().trim();
    if (val.length < 2) return;

    const isCovered = COVERED_COMPANIES.some(c => val.includes(c));
    result.hidden = false;
    result.innerHTML = '';
    result.className = 'coverage-result ' + (isCovered ? 'covered' : 'not-covered');

    if (isCovered) {
      result.innerHTML = `
        <span class="coverage-result-icon">🎉</span>
        <div class="coverage-result-body">
          <p class="coverage-result-title">Votre entreprise est adhérente !</p>
          <p class="coverage-result-sub">Premier appel expert offert + accompagnement mobilité pris en charge.</p>
        </div>
        <button class="btn btn-primary" onclick="openModal('rdv')">Réserver →</button>
      `;
    } else {
      result.innerHTML = `
        <span class="coverage-result-icon">👋</span>
        <div class="coverage-result-body">
          <p class="coverage-result-title">Votre entreprise n'est pas encore partenaire.</p>
          <p class="coverage-result-sub">
            Premier appel à 49 € — ou
            <a href="entreprise.html">suggérez Timonia à votre DRH</a>.
          </p>
        </div>
        <button class="btn btn-primary" onclick="openModal('rdv')">Réserver 49 €</button>
      `;
    }
  }

  btn.addEventListener('click', checkCoverage);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkCoverage();
  });

  // "Prendre RDV" in nav
  const navRdv = document.getElementById('openRdvModal');
  if (navRdv) navRdv.addEventListener('click', () => openModal('rdv'));

  // Form submissions
  setupForm('formRdv',  'successRdv',  'rdv');
  setupForm('formPack', 'successPack', 'pack');
});

// ─── MODAL HELPERS ────────────────────────────────────────────────────────────
function openModal(name) {
  const map = { rdv: 'modalRdv', pack: 'modalPack', demo: 'modalDemo' };
  const el = document.getElementById(map[name]);
  if (el) {
    el.hidden = false;
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(name) {
  const map = { rdv: 'modalRdv', pack: 'modalPack', demo: 'modalDemo' };
  const el = document.getElementById(map[name]);
  if (el) {
    el.hidden = true;
    document.body.style.overflow = '';
  }
}

function setupForm(formId, successId, modalName) {
  const form    = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    success.hidden = false;
    // Auto-close after 3 seconds
    setTimeout(function () {
      closeModal(modalName);
      form.style.display = '';
      success.hidden = true;
      form.reset();
    }, 3000);
  });
}
