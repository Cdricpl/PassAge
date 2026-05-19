const STORAGE_KEY = 'passage-admin-fiches';
const defaultDisclaimer = 'Cette fiche est un repère général. Elle ne remplace pas l’avis d’un service compétent.';
const defaultSource = 'Source à vérifier';
const defaultLastChecked = 'Mai 2026';
const defaultStatus = 'à relire';

const ficheForm = document.getElementById('ficheForm');
const fichesList = document.getElementById('fichesList');
const listEmpty = document.getElementById('listEmpty');
const editorTitle = document.getElementById('editorTitle');
const messageEl = document.getElementById('message');
const importFile = document.getElementById('importFile');

const newBtn = document.getElementById('newBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const saveBtn = document.getElementById('saveBtn');
const archiveBtn = document.getElementById('archiveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const resetBtn = document.getElementById('resetBtn');

let fiches = [];
let selectedId = null;

function loadFiches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    fiches = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(fiches)) fiches = [];
  } catch (error) {
    fiches = [];
  }
}

function saveFiches() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fiches, null, 2));
}

function createId() {
  return 'fiche-' + Math.random().toString(36).slice(2, 11);
}

function showMessage(text) {
  messageEl.textContent = text;
  setTimeout(() => {
    if (messageEl.textContent === text) {
      messageEl.textContent = '';
    }
  }, 3200);
}

function getFieldValue(name) {
  const field = ficheForm.elements.namedItem(name);
  return field ? field.value.trim() : '';
}

function setFieldValue(name, value) {
  const field = ficheForm.elements.namedItem(name);
  if (!field) return;
  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
  } else {
    field.value = value || '';
  }
}

function renderFicheList() {
  fichesList.innerHTML = '';
  const sorted = [...fiches].sort((a, b) => {
    if (a.archived !== b.archived) return a.archived ? 1 : -1;
    return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
  });

  if (sorted.length === 0) {
    listEmpty.style.display = 'block';
    return;
  }

  listEmpty.style.display = 'none';

  sorted.forEach((fiche) => {
    const item = document.createElement('li');
    item.className = 'fiche-item';
    const title = document.createElement('p');
    title.className = 'fiche-title';
    title.textContent = fiche.title || 'Sans titre';

    const description = document.createElement('p');
    description.className = 'fiche-description';
    description.textContent = fiche.summary || 'Aucun résumé';

    const meta = document.createElement('div');
    meta.className = 'fiche-meta';
    meta.innerHTML = `
      <span>${fiche.category || 'non catégorisée'}</span>
      <span class="fiche-status">${fiche.status || defaultStatus}</span>
      <span>${fiche.archived ? 'archivée' : 'active'}</span>
    `;

    const actions = document.createElement('div');
    actions.style.display = 'grid';
    actions.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
    actions.style.gap = '0.5rem';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Modifier';
    editBtn.addEventListener('click', () => selectFiche(fiche.id));
    actions.appendChild(editBtn);

    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(meta);
    item.appendChild(actions);
    fichesList.appendChild(item);
  });
}

function resetForm() {
  ficheForm.reset();
  selectedId = null;
  setFieldValue('id', '');
  setFieldValue('source', defaultSource);
  setFieldValue('lastChecked', defaultLastChecked);
  setFieldValue('disclaimer', defaultDisclaimer);
  setFieldValue('status', defaultStatus);
  setFieldValue('archived', false);
  editorTitle.textContent = 'Ajouter une fiche';
  archiveBtn.textContent = 'Archiver';
  archiveBtn.disabled = true;
  deleteBtn.disabled = true;
  saveBtn.textContent = 'Enregistrer';
  showMessage('Formulaire réinitialisé.');
}

function selectFiche(id) {
  const fiche = fiches.find((item) => item.id === id);
  if (!fiche) return;
  selectedId = id;
  setFieldValue('id', fiche.id);
  setFieldValue('title', fiche.title);
  setFieldValue('category', fiche.category);
  setFieldValue('summary', fiche.summary);
  setFieldValue('content', fiche.content);
  setFieldValue('source', fiche.source);
  setFieldValue('lastChecked', fiche.lastChecked);
  setFieldValue('disclaimer', fiche.disclaimer);
  setFieldValue('status', fiche.status);
  setFieldValue('reviewedBy', fiche.reviewedBy);
  setFieldValue('updatedBy', fiche.updatedBy);
  setFieldValue('internalNotes', fiche.internalNotes);
  setFieldValue('archived', fiche.archived);

  editorTitle.textContent = `Modifier la fiche : ${fiche.title}`;
  archiveBtn.textContent = fiche.archived ? 'Désarchiver' : 'Archiver';
  archiveBtn.disabled = false;
  deleteBtn.disabled = false;
  saveBtn.textContent = 'Mettre à jour';
  showMessage(`Fiche sélectionnée : ${fiche.title}`);
}

function getFormData() {
  return {
    id: getFieldValue('id') || createId(),
    title: getFieldValue('title'),
    category: getFieldValue('category'),
    summary: getFieldValue('summary'),
    content: getFieldValue('content'),
    source: getFieldValue('source') || defaultSource,
    lastChecked: getFieldValue('lastChecked') || defaultLastChecked,
    disclaimer: getFieldValue('disclaimer') || defaultDisclaimer,
    status: getFieldValue('status') || defaultStatus,
    reviewedBy: getFieldValue('reviewedBy'),
    updatedBy: getFieldValue('updatedBy'),
    internalNotes: getFieldValue('internalNotes'),
    archived: ficheForm.elements.namedItem('archived').checked,
  };
}

function saveForm(event) {
  event.preventDefault();
  const fiche = getFormData();
  if (!fiche.title || !fiche.category || !fiche.status) {
    showMessage('Le titre, la catégorie et le statut sont obligatoires.');
    return;
  }
  const existingIndex = fiches.findIndex((item) => item.id === fiche.id);
  if (existingIndex >= 0) {
    fiches[existingIndex] = fiche;
    showMessage('Fiche mise à jour.');
  } else {
    fiches.push(fiche);
    showMessage('Fiche ajoutée.');
  }
  saveFiches();
  renderFicheList();
  selectFiche(fiche.id);
}

function toggleArchive() {
  if (!selectedId) return;
  const fiche = fiches.find((item) => item.id === selectedId);
  if (!fiche) return;
  fiche.archived = !fiche.archived;
  saveFiches();
  renderFicheList();
  selectFiche(fiche.id);
  showMessage(fiche.archived ? 'Fiche archivée.' : 'Fiche désarchivée.');
}

function removeFiche() {
  if (!selectedId) return;
  const fiche = fiches.find((item) => item.id === selectedId);
  if (!fiche) return;
  const confirmed = window.confirm(`Supprimer définitivement « ${fiche.title} » ?`);
  if (!confirmed) return;
  fiches = fiches.filter((item) => item.id !== selectedId);
  saveFiches();
  renderFicheList();
  resetForm();
  showMessage('Fiche supprimée.');
}

function exportJson() {
  const json = JSON.stringify(fiches, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'passage-fiches.json';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  link.remove();
  showMessage('Export JSON prêt.');
}

function importJsonFile() {
  importFile.click();
}

function handleImportFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) {
        throw new Error('Format invalide. Le fichier doit contenir un tableau d’objets.');
      }
      fiches = imported.map((item) => ({
        id: item.id || createId(),
        title: item.title || '',
        category: item.category || '',
        summary: item.summary || '',
        content: item.content || '',
        source: item.source || defaultSource,
        lastChecked: item.lastChecked || defaultLastChecked,
        disclaimer: item.disclaimer || defaultDisclaimer,
        status: item.status || defaultStatus,
        reviewedBy: item.reviewedBy || '',
        updatedBy: item.updatedBy || '',
        internalNotes: item.internalNotes || '',
        archived: Boolean(item.archived),
      }));
      saveFiches();
      renderFicheList();
      resetForm();
      showMessage('Importation réussie.');
    } catch (error) {
      showMessage('Erreur d’import : fichier JSON invalide.');
    }
  };
  reader.readAsText(file, 'utf-8');
  event.target.value = '';
}

function init() {
  loadFiches();
  renderFicheList();
  resetForm();

  ficheForm.addEventListener('submit', saveForm);
  newBtn.addEventListener('click', resetForm);
  archiveBtn.addEventListener('click', toggleArchive);
  deleteBtn.addEventListener('click', removeFiche);
  resetBtn.addEventListener('click', resetForm);
  exportBtn.addEventListener('click', exportJson);
  importBtn.addEventListener('click', importJsonFile);
  importFile.addEventListener('change', handleImportFile);
}

init();
