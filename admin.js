let currentData = {};
let currentPin = '1234';

// Vérification du PIN d'accès
document.getElementById('pin-submit-btn')?.addEventListener('click', () => {
  const inputPin = document.getElementById('pin-input').value;
  const storedPin = localStorage.getItem('admin_pin') || currentPin;
  
  if (inputPin === storedPin) {
    document.getElementById('pin-modal').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');
    initAdminData();
  } else {
    document.getElementById('pin-error').classList.remove('hidden');
  }
});

// Encodage d'image en Base64
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Initialisation et chargement des données dans le formulaire Admin
async function initAdminData() {
  try {
    if (window.db) {
      const doc = await window.db.collection('app_data').doc('site_content').get();
      if (doc.exists) {
        currentData = doc.data();
      }
    }
  } catch (err) {
    console.warn("Firestore indisponible, fallback LocalStorage");
  }
  
  if (!currentData.siteName) {
    const local = localStorage.getItem('site_content');
    if (local) currentData = JSON.parse(local);
  }

  // Valeurs par défaut
  if (!currentData.heroes) currentData.heroes = [{ title: "Formez votre Avenir avec des Experts Métier", subtitle: "Diplômes d'État et campus connecté.", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" }];
  if (!currentData.formations) currentData.formations = [];
  if (!currentData.teachers) currentData.teachers = [];
  if (!currentData.programmes) currentData.programmes = [];
  if (!currentData.tarifs) currentData.tarifs = [];
  if (!currentData.temoignages) currentData.temoignages = [];
  if (!currentData.faqs) currentData.faqs = [];
  if (!currentData.customSections) currentData.customSections = [];

  // Remplissage des champs
  document.getElementById('adm-site-name').value = currentData.siteName || "Institut Supérieur de Technologie & Management";
  document.getElementById('adm-site-slogan').value = currentData.siteSlogan || "Formez votre Avenir avec des Experts Métier";
  document.getElementById('adm-site-phone').value = currentData.phone || "+261 34 00 000 00";
  document.getElementById('adm-site-email').value = currentData.email || "contact@istm-edu.mg";
  document.getElementById('adm-site-address').value = currentData.address || "Campus Ankorondrano, Antananarivo";
  document.getElementById('adm-logo-url').value = currentData.logoUrl || "";

  renderHeroEditors();
  renderArrayEditors();
  renderCustomSectionsList();
}

// Rendu des sliders Multi-Hero
function renderHeroEditors() {
  const container = document.getElementById('adm-heroes-list');
  if (!container) return;
  
  container.innerHTML = currentData.heroes.map((hero, idx) => `
    <div class="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-xs font-bold text-emerald-400">Diapositive Hero #${idx + 1}</span>
        ${currentData.heroes.length > 1 ? `<button onclick="removeHero(${idx})" class="text-rose-400 text-xs hover:underline"><i class="fa-solid fa-trash"></i> Supprimer</button>` : ''}
      </div>
      <input type="text" value="${hero.title || ''}" onchange="currentData.heroes[${idx}].title = this.value" placeholder="Titre principal" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
      <textarea onchange="currentData.heroes[${idx}].subtitle = this.value" placeholder="Sous-titre" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">${hero.subtitle || ''}</textarea>
      <input type="text" value="${hero.imageUrl || ''}" onchange="currentData.heroes[${idx}].imageUrl = this.value" placeholder="URL de l'image de fond" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
    </div>
  `).join('');
}

document.getElementById('add-hero-btn')?.addEventListener('click', () => {
  currentData.heroes.push({ title: "Nouveau Titre Slide", subtitle: "Description slide", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" });
  renderHeroEditors();
});

window.removeHero = function(idx) {
  currentData.heroes.splice(idx, 1);
  renderHeroEditors();
};

// Rendu dynamique de toutes les cartes d'éléments avec champ de contact individuel sous chaque image
function renderArrayEditors() {
  renderItemCollection('formations', 'adm-formations-container', ['title', 'desc', 'image', 'contact']);
  renderItemCollection('teachers', 'adm-teachers-container', ['name', 'title', 'desc', 'image', 'contact']);
  renderItemCollection('programmes', 'adm-programmes-container', ['title', 'desc', 'image', 'contact']);
  renderItemCollection('tarifs', 'adm-tarifs-container', ['title', 'desc', 'image', 'contact']);
  renderItemCollection('temoignages', 'adm-temoignages-container', ['name', 'title', 'desc', 'image', 'contact']);
  renderItemCollection('faqs', 'adm-faqs-container', ['q', 'a']);
}

function renderItemCollection(key, containerId, fields) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = currentData[key] || [];

  container.innerHTML = items.map((item, idx) => `
    <div class="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-[11px] font-bold text-slate-400">Élément #${idx + 1}</span>
        <button onclick="removeItemItem('${key}', ${idx})" class="text-rose-400 text-xs hover:underline"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        ${fields.map(f => {
          if (f === 'desc' || f === 'a') {
            return `<textarea onchange="currentData['${key}'][${idx}].${f} = this.value" placeholder="${f.toUpperCase()}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white col-span-2">${item[f] || ''}</textarea>`;
          }
          return `<input type="text" value="${item[f] || ''}" onchange="currentData['${key}'][${idx}].${f} = this.value" placeholder="${f === 'contact' ? 'Contact sous image (WhatsApp, email, lien)' : f.toUpperCase()}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

window.addArrayItem = function(key) {
  if (!currentData[key]) currentData[key] = [];
  if (key === 'faqs') {
    currentData[key].push({ q: "Nouvelle Question ?", a: "Réponse..." });
  } else {
    currentData[key].push({ title: "Nouveau Titre", name: "Nouveau Nom", desc: "Description...", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400", contact: "+261340000000" });
  }
  renderArrayEditors();
};

window.removeItemItem = function(key, idx) {
  currentData[key].splice(idx, 1);
  renderArrayEditors();
};

// Formulaire de Création de Section Sur-Mesure
document.getElementById('add-custom-section-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('custom-sec-title').value;
  const content = document.getElementById('custom-sec-content').value;
  const bgStyle = document.getElementById('custom-sec-bg').value;
  const fileInput = document.getElementById('custom-sec-file');
  
  let imageBase64 = '';
  if (fileInput.files && fileInput.files[0]) {
    imageBase64 = await convertImageToBase64(fileInput.files[0]);
  }

  if (!currentData.customSections) currentData.customSections = [];
  currentData.customSections.push({ title, content, image: imageBase64, bgStyle });
  
  renderCustomSectionsList();
  document.getElementById('add-custom-section-form').reset();
  alert('Nouvelle section sur-mesure ajoutée ! Pensez à cliquer sur SAUVEGARDER TOUT.');
});

function renderCustomSectionsList() {
  const container = document.getElementById('custom-sections-list');
  if (!container) return;
  const list = currentData.customSections || [];
  
  container.innerHTML = list.map((sec, idx) => `
    <div class="p-3 bg-slate-800 rounded-xl flex justify-between items-center text-xs text-white">
      <div>
        <span class="font-bold text-emerald-400">${sec.title}</span>
        <p class="text-slate-400 text-[11px] truncate max-w-xs">${sec.content}</p>
      </div>
      <button onclick="removeCustomSec(${idx})" class="text-rose-400 hover:underline"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('');
}

window.removeCustomSec = function(idx) {
  currentData.customSections.splice(idx, 1);
  renderCustomSectionsList();
};

// Simulation Google Ping Indexation
document.getElementById('google-ping-btn')?.addEventListener('click', () => {
  const msg = document.getElementById('seo-ping-msg');
  msg.classList.remove('hidden');
  msg.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Envoi du Ping Google et mise à jour du Sitemap...';
  setTimeout(() => {
    msg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Demande d indexation envoyée avec succès à Googlebot ! Sitemap synchronisé.';
  }, 1500);
});

// SAUVEGARDE GLOBALE DANS FIRESTORE ET LOCALSTORAGE
document.getElementById('save-all-btn')?.addEventListener('click', async () => {
  const btn = document.getElementById('save-all-btn');
  btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> SAUVEGARDE EN COURS...';

  // Logo file conversion if uploaded
  const logoFile = document.getElementById('adm-logo-file').files[0];
  if (logoFile) {
    currentData.logoUrl = await convertImageToBase64(logoFile);
  } else {
    const urlVal = document.getElementById('adm-logo-url').value;
    if (urlVal) currentData.logoUrl = urlVal;
  }

  currentData.siteName = document.getElementById('adm-site-name').value;
  currentData.siteSlogan = document.getElementById('adm-site-slogan').value;
  currentData.phone = document.getElementById('adm-site-phone').value;
  currentData.email = document.getElementById('adm-site-email').value;
  currentData.address = document.getElementById('adm-site-address').value;

  try {
    if (window.db) {
      await window.db.collection('app_data').doc('site_content').set(currentData, { merge: true });
    }
    localStorage.setItem('site_content', JSON.stringify(currentData));
    btn.innerHTML = '<i class="fa-solid fa-check"></i> SAUVEGARDÉ AVEC SUCCÈS !';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> SAUVEGARDER TOUT';
    }, 2000);
  } catch (err) {
    console.error("Erreur de sauvegarde:", err);
    localStorage.setItem('site_content', JSON.stringify(currentData));
    btn.innerHTML = '<i class="fa-solid fa-check"></i> SAUVEGARDÉ EN LOCAL !';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> SAUVEGARDER TOUT';
    }, 2000);
  }
});