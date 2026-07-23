// Données par défaut si aucune donnée personnalisée n'est sauvegardée dans Firestore / LocalStorage
const DEFAULT_SITE_CONTENT = {
  siteName: "Institut Supérieur de Technologie & Management",
  siteSlogan: "Formez votre Avenir avec des Experts Métier",
  logoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300",
  phone: "+261 34 00 000 00",
  email: "contact@istm-edu.mg",
  address: "Campus Ankorondrano, Antananarivo",
  heroes: [
    {
      title: "Formez votre Avenir avec des Experts Métier",
      subtitle: "Diplômes d'État, stages garantis et campus connecté. Rejoignez une communauté académique d'excellence.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
      ctaText: "S'inscrire",
      ctaLink: "#inscription"
    }
  ],
  formations: [
    {
      title: "Génie Informatique & Développement Web",
      desc: "Formation intensive couvrant le développement Fullstack, l'Intelligence Artificielle et la Cybersécurité.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500",
      contact: "+261340000000"
    },
    {
      title: "Management & Commerce Digital",
      desc: "Maîtrisez les stratégies marketing, le leadership d'entreprise et le pilotage des projets digitaux.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500",
      contact: "+261340000000"
    },
    {
      title: "Sciences & Électronique Appliquée",
      desc: "Conception de systèmes embarqués, domotique et ingénierie des réseaux industriels.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500",
      contact: "contact@istm-edu.mg"
    }
  ],
  teachers: [
    {
      name: "Dr. Alson Randria",
      title: "Docteur en Intelligence Artificielle",
      desc: "Plus de 15 ans d'expérience en encadrement d'ingénieurs et recherche logicielle.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      contact: "https://wa.me/261340000000"
    },
    {
      name: "Mme Sarah Rakoto",
      title: "Directrice des Programmes Management",
      desc: "Ex-Consultante internationale en stratégie d'entreprise et gestion d'actifs.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
      contact: "contact@istm-edu.mg"
    }
  ],
  programmes: [
    {
      title: "Activités & FabLab de l'École",
      desc: "Projets collectifs, Hackathons annuels et accès 24/7 au FabLab d'innovation du campus.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=500",
      contact: "+261340000000"
    }
  ],
  tarifs: [
    {
      title: "Licence Professionnelle",
      desc: "Formation sur 3 ans avec stage obligatoire chaque année. Payable en 10 mensualités.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500",
      contact: "https://wa.me/261340000000"
    },
    {
      title: "Master Spécialisé",
      desc: "Formation de haut niveau BAC+5 avec projets de recherche appliquée en entreprise.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500",
      contact: "contact@istm-edu.mg"
    }
  ],
  temoignages: [
    {
      name: "Andry V.",
      title: "Promo 2023 - Développeur Lead",
      desc: "L'ISTM m'a permis de décrocher mon premier emploi avant même la remise de mon diplôme. La pédagogie pratique fait toute la différence.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400",
      contact: "+261340000000"
    }
  ],
  faqs: [
    {
      q: "Quels sont les critères d'admission à l'ISTM ?",
      a: "L'admission se fait sur étude de dossier (BAC général ou technique) suivie d'un entretien de motivation avec le secrétariat académique."
    },
    {
      q: "Est-il possible de payer la scolarité par tranches ?",
      a: "Oui, nous proposons un échelonnement jusqu'à 10 mensualités par année académique pour faciliter les paiements."
    }
  ],
  customSections: []
};

let currentContent = { ...DEFAULT_SITE_CONTENT };

// Fonction de chargement des données publiques depuis Firestore ou LocalStorage
async function loadSiteContent() {
  try {
    if (window.db) {
      const doc = await window.db.collection('app_data').doc('site_content').get();
      if (doc.exists) {
        currentContent = { ...DEFAULT_SITE_CONTENT, ...doc.data() };
      }
    } else {
      const local = localStorage.getItem('site_content');
      if (local) currentContent = { ...DEFAULT_SITE_CONTENT, ...JSON.parse(local) };
    }
  } catch (err) {
    console.warn("Chargement fallback LocalStorage:", err);
    const local = localStorage.getItem('site_content');
    if (local) currentContent = { ...DEFAULT_SITE_CONTENT, ...JSON.parse(local) };
  }

  renderUI();
}

// Rendu dynamique de l'interface utilisateur
function renderUI() {
  // Nom & Slogan
  const nameElem = document.getElementById('site-name-display');
  if (nameElem) nameElem.textContent = currentContent.siteName || "ISTM ACADEMY";
  
  const sloganElem = document.getElementById('site-slogan-display');
  if (sloganElem) sloganElem.textContent = currentContent.siteSlogan || "Technologie & Management";

  const logoImg = document.getElementById('site-logo-img');
  if (logoImg && currentContent.logoUrl) logoImg.src = currentContent.logoUrl;

  // Champs CMS textuels
  document.querySelectorAll('[data-cms="site-phone"]').forEach(el => el.textContent = currentContent.phone || '+261 34 00 000 00');
  document.querySelectorAll('[data-cms="site-email"]').forEach(el => el.textContent = currentContent.email || 'contact@istm-edu.mg');
  document.querySelectorAll('[data-cms="site-address"]').forEach(el => el.textContent = currentContent.address || 'Campus Ankorondrano');

  // Multi-Hero Slider
  renderHero();

  // Grilles d'éléments avec bouton d'action sous chaque photo
  renderCardGrid('formations-grid', currentContent.formations);
  renderCardGrid('enseignants-grid', currentContent.teachers);
  renderCardGrid('programmes-grid', currentContent.programmes);
  renderCardGrid('tarifs-grid', currentContent.tarifs);
  renderCardGrid('temoignages-grid', currentContent.temoignages);

  // FAQ Accordion
  renderFAQ();

  // Sections Sur-mesure Dynamiques
  renderCustomSections();
}

// Rendu Hero Multi-Diapositives
function renderHero() {
  const heroes = currentContent.heroes || DEFAULT_SITE_CONTENT.heroes;
  if (!heroes.length) return;
  const hero = heroes[0]; // Active slide
  
  const titleEl = document.getElementById('hero-title-display');
  if (titleEl) titleEl.innerHTML = hero.title || "Formez votre Avenir avec des <span class='text-gradient'>Experts Métier</span>";
  
  const subEl = document.getElementById('hero-subtitle-display');
  if (subEl) subEl.textContent = hero.subtitle || "";

  const imgEl = document.getElementById('hero-image-display');
  if (imgEl && hero.imageUrl) imgEl.src = hero.imageUrl;
}

// Générateur universel de cartes avec image et bouton de contact/action sous l'image
function renderCardGrid(elementId, items) {
  const container = document.getElementById(elementId);
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="text-slate-500 text-xs italic col-span-full">Aucun élément à afficher pour le moment.</p>';
    return;
  }

  container.innerHTML = items.map(item => {
    const contactVal = item.contact || currentContent.phone || '';
    let buttonHtml = '';
    
    if (contactVal.includes('@')) {
      buttonHtml = `<a href="mailto:${contactVal}" class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition border border-emerald-500/30 w-full justify-center mt-3"><i class="fa-solid fa-envelope"></i> Envoyer E-mail</a>`;
    } else if (contactVal.startsWith('http')) {
      buttonHtml = `<a href="${contactVal}" target="_blank" class="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition border border-teal-500/30 w-full justify-center mt-3"><i class="fa-solid fa-arrow-up-right-from-square"></i> En savoir plus / Contact</a>`;
    } else {
      const cleanPhone = contactVal.replace(/[^0-9+]/g, '');
      buttonHtml = `<a href="https://wa.me/${cleanPhone}" target="_blank" class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition border border-emerald-500/30 w-full justify-center mt-3"><i class="fa-brands fa-whatsapp"></i> Contacter sur WhatsApp</a>`;
    }

    return `
      <div class="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
        <div>
          <div class="relative aspect-video bg-slate-900 overflow-hidden">
            <img src="${item.image || item.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400'}" alt="${item.title || item.name}" class="w-full h-full object-cover hover:scale-105 transition duration-500">
          </div>
          <div class="p-6">
            <h4 class="text-lg font-bold text-white mb-2">${item.title || item.name}</h4>
            ${item.title && item.name ? `<p class="text-xs font-medium text-emerald-400 mb-2">${item.title}</p>` : ''}
            <p class="text-xs text-slate-400 leading-relaxed mb-3">${item.desc || item.description || ''}</p>
          </div>
        </div>
        <div class="px-6 pb-6 pt-0">
          ${buttonHtml}
        </div>
      </div>
    `;
  }).join('');
}

// FAQ Accordion
function renderFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  const faqs = currentContent.faqs || DEFAULT_SITE_CONTENT.faqs;

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden">
      <button onclick="toggleFAQ(${idx})" class="w-full p-5 text-left font-bold text-white flex justify-between items-center hover:text-emerald-400 transition text-sm">
        <span>${faq.q}</span>
        <i id="faq-icon-${idx}" class="fa-solid fa-chevron-down text-xs transition-transform duration-300"></i>
      </button>
      <div id="faq-ans-${idx}" class="hidden p-5 pt-0 text-xs text-slate-400 border-t border-slate-700/40 leading-relaxed">
        ${faq.a}
      </div>
    </div>
  `).join('');
}

window.toggleFAQ = function(idx) {
  const ans = document.getElementById(`faq-ans-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (ans) ans.classList.toggle('hidden');
  if (icon) icon.classList.toggle('rotate-180');
};

// Affichage des sections personnalisées ajoutées via l'Admin
function renderCustomSections() {
  const container = document.getElementById('custom-sections-container');
  if (!container) return;
  const customSecs = currentContent.customSections || [];
  
  if (customSecs.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = customSecs.map((sec) => `
    <section class="py-20 border-t border-slate-800 ${sec.bgStyle === 'dark' ? 'bg-slate-950' : 'bg-slate-900'}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-4">
            <h3 class="text-3xl font-extrabold text-white">${sec.title}</h3>
            <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-line">${sec.content}</p>
          </div>
          ${sec.image ? `
            <div class="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src="${sec.image}" alt="${sec.title}" class="w-full h-auto object-cover">
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `).join('');
}

// Boutons "Lire la suite" pour les paragraphes longs
document.addEventListener('click', (e) => {
  if (e.target.closest('.read-more-btn')) {
    const btn = e.target.closest('.read-more-btn');
    const hiddenPara = btn.parentElement.querySelector('.hidden-paragraph');
    if (hiddenPara) {
      hiddenPara.classList.toggle('hidden');
      const span = btn.querySelector('span');
      const icon = btn.querySelector('i');
      if (hiddenPara.classList.contains('hidden')) {
        if (span) span.textContent = 'Lire la suite';
        if (icon) icon.className = 'fa-solid fa-chevron-down text-xs transition-transform';
      } else {
        if (span) span.textContent = 'Réduire';
        if (icon) icon.className = 'fa-solid fa-chevron-up text-xs transition-transform';
      }
    }
  }
});

// Formulaire de pré-inscription
const regForm = document.getElementById('registration-form');
if (regForm) {
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      fullname: document.getElementById('reg-fullname').value,
      email: document.getElementById('reg-email').value,
      phone: document.getElementById('reg-phone').value,
      field: document.getElementById('reg-field').value,
      timeSlot: document.getElementById('reg-time').value
    };

    if (window.registerAppUser) {
      const res = await window.registerAppUser(userData);
      if (res.success) {
        document.getElementById('registration-success').classList.remove('hidden');
        regForm.reset();
      } else {
        alert(res.error);
      }
    } else {
      alert('Demande enregistrée.');
    }
  });
}

// Menu Mobile Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// PWA Installation Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.classList.remove('hidden');
    installBtn.classList.add('inline-flex');
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        installBtn.classList.add('hidden');
      });
    });
  }
});

// Enregistrement du Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
  loadSiteContent();
});