const firebaseConfig = {
  apiKey: "AIzaSyAmo7pHIas2xuu05px8UvN_9m3J7XY_G4M",
  authDomain: "gen-lang-client-0592969130.firebaseapp.com",
  projectId: "gen-lang-client-0592969130",
  storageBucket: "gen-lang-client-0592969130.firebasestorage.app",
  appId: "1:327917182728:web:ef8d364929afc7bc35d6bd"
};

if (typeof firebase !== 'undefined') {
  if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  const dbId = "ai-studio-kindlogickreator-865cf4c0-5872-4edb-89e9-b90d755d5d2c";
  try {
    window.db = (dbId && dbId !== "(default)") ? firebase.app().firestore(dbId) : firebase.firestore();
  } catch (e) {
    try { window.db = firebase.firestore(); } catch(err) { window.db = null; }
  }
  try { window.auth = firebase.auth(); } catch(e) { window.auth = null; }
}

// Gestionnaire d'enregistrement d'utilisateur avec limite des 200 comptes (Plan gratuit)
window.registerAppUser = async function(userData) {
  const maxUsersAllowed = 200;
  const PROJECT_ID = "proj_1784824376121";
  try {
    let currentUsersCount = 0;
    if (window.db) {
      const snapshot = await window.db.collection("app_users")
        .where("projectId", "==", PROJECT_ID)
        .get();
      currentUsersCount = snapshot.size;
    } else {
      const localUsers = JSON.parse(localStorage.getItem('istm_app_users') || '[]');
      currentUsersCount = localUsers.length;
    }

    if (currentUsersCount >= maxUsersAllowed) {
      throw new Error("❌ Limite de 200 utilisateurs atteinte pour le plan gratuit. Le propriétaire du site doit souscrire au Plan PRO pour un nombre d'utilisateurs illimité.");
    }

    const newUser = {
      ...userData,
      projectId: PROJECT_ID,
      user_number: currentUsersCount + 1,
      createdAt: new Date().toISOString()
    };

    if (window.db) {
      await window.db.collection("app_users").add(newUser);
    } else {
      const localUsers = JSON.parse(localStorage.getItem('istm_app_users') || '[]');
      localUsers.push(newUser);
      localStorage.setItem('istm_app_users', JSON.stringify(localUsers));
    }
    return { success: true, user: newUser };
  } catch (err) {
    return { success: false, error: err.message };
  }
};