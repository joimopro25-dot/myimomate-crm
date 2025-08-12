// =========================================
// 🔥 FIREBASE CONFIGURATION
// =========================================
// Configuração central do Firebase para o projeto
// Inclui Auth, Firestore e Storage

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// =========================================
// 📊 CONFIGURAÇÃO
// =========================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// =========================================
// 🚀 INICIALIZAÇÃO
// =========================================

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// =========================================
// 🔧 CONFIGURAÇÃO DE DESENVOLVIMENTO
// =========================================

const isDevelopment = import.meta.env.MODE === 'development';
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (isDevelopment && useEmulators) {
  // Conectar aos emuladores do Firebase se estivermos em desenvolvimento
  try {
    // Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    
    // Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log('🔧 Firebase Emulators conectados');
  } catch (error) {
    console.warn('⚠️ Erro ao conectar emuladores Firebase:', error);
  }
}

// =========================================
// 📊 COLEÇÕES E CONSTANTES
// =========================================

export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  LEADS: 'leads',
  TASKS: 'tasks',
  DEALS: 'deals',
  COMMUNICATIONS: 'communications',
  DOCUMENTS: 'documents'
};

export const STORAGE_PATHS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  TEMP: 'temp'
};

// =========================================
// 🎯 HELPER FUNCTIONS
// =========================================

/**
 * Obter referência de coleção do utilizador
 */
export const getUserCollection = (userId, collection) => {
  return `users/${userId}/${collection}`;
};

/**
 * Obter path do storage do utilizador
 */
export const getUserStoragePath = (userId, path) => {
  return `users/${userId}/${path}`;
};

/**
 * Verificar se Firebase está configurado
 */
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

/**
 * Log de configuração para debug
 */
export const logFirebaseConfig = () => {
  console.log('🔥 Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    configured: isFirebaseConfigured(),
    emulators: isDevelopment && useEmulators
  });
};

// =========================================
// 🛡️ REGRAS DE SEGURANÇA (REFERÊNCIA)
// =========================================

/*
Firestore Security Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users podem acessar apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcoleções do utilizador
      match /{collection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}

Storage Security Rules:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users podem acessar apenas seus próprios arquivos
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

export default app;