// =========================================
// 🔥 FIREBASE CONFIGURATION - FINAL
// =========================================
// Configuração central do Firebase para MyImoMate 2.0
// Versão ÚNICA em JavaScript - Remove config.ts duplicado

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// =========================================
// 📊 CONFIGURAÇÃO DO PROJETO
// =========================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar configuração
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingVars.length > 0) {
  console.error('🚨 Variáveis de ambiente Firebase em falta:', missingVars);
  console.error('📝 Copie .env.example para .env.local e preencha as credenciais');
}

// =========================================
// 🚀 INICIALIZAÇÃO DOS SERVIÇOS
// =========================================

// Inicializar Firebase App
const app = initializeApp(firebaseConfig);

// Inicializar serviços Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// =========================================
// 🔧 CONFIGURAÇÃO DE DESENVOLVIMENTO
// =========================================

const isDevelopment = import.meta.env.MODE === 'development';
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (isDevelopment && useEmulators) {
  console.log('🔧 Configurando Firebase Emulators...');
  
  try {
    // Auth emulator (porta 9099)
    connectAuthEmulator(auth, 'http://localhost:9099', { 
      disableWarnings: true 
    });
    
    // Firestore emulator (porta 8080)
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Storage emulator (porta 9199)
    connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log('✅ Firebase Emulators conectados com sucesso');
  } catch (error) {
    console.warn('⚠️ Aviso: Erro ao conectar emuladores Firebase:', error.message);
    console.log('💡 Usando Firebase produção em modo desenvolvimento');
  }
} else {
  console.log('🔥 Firebase inicializado em modo produção');
}

// =========================================
// 📊 CONSTANTES DE COLEÇÕES
// =========================================

export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients', 
  LEADS: 'leads',
  TASKS: 'tasks',
  DEALS: 'deals',
  COMMUNICATIONS: 'communications',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics'
};

export const STORAGE_PATHS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars', 
  IMAGES: 'images',
  TEMP: 'temp',
  EXPORTS: 'exports'
};

// =========================================
// 🎯 HELPER FUNCTIONS
// =========================================

/**
 * Obter caminho da coleção do utilizador
 * @param {string} userId - ID do utilizador
 * @param {string} collection - Nome da coleção
 * @returns {string} Caminho da coleção
 */
export const getUserCollection = (userId, collection) => {
  if (!userId || !collection) {
    throw new Error('userId e collection são obrigatórios');
  }
  return `users/${userId}/${collection}`;
};

/**
 * Obter caminho do storage do utilizador  
 * @param {string} userId - ID do utilizador
 * @param {string} path - Caminho no storage
 * @returns {string} Caminho completo do storage
 */
export const getUserStoragePath = (userId, path) => {
  if (!userId || !path) {
    throw new Error('userId e path são obrigatórios');
  }
  return `users/${userId}/${path}`;
};

/**
 * Verificar se Firebase está configurado corretamente
 * @returns {boolean} True se configurado
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
 * Log das configurações para debug
 */
export const logFirebaseConfig = () => {
  console.log('🔥 Firebase Configuration:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    configured: isFirebaseConfigured(),
    emulators: isDevelopment && useEmulators,
    mode: import.meta.env.MODE
  });
};

/**
 * Verificar conectividade com Firebase
 * @returns {Promise<boolean>} True se conectado
 */
export const testFirebaseConnection = async () => {
  try {
    // Teste simples de conectividade
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('❌ Erro de conectividade Firebase:', error);
    return false;
  }
};

// =========================================
// 🛡️ REGRAS DE SEGURANÇA (REFERÊNCIA)
// =========================================

/*
FIRESTORE SECURITY RULES:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users podem acessar apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcoleções do utilizador (clients, leads, etc)
      match /{collection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Permitir leitura de configurações públicas (se necessário)
    match /public/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}

STORAGE SECURITY RULES:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users podem acessar apenas seus próprios arquivos
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId &&
                           resource.size < 10 * 1024 * 1024; // 10MB max
    }
    
    // Arquivos temporários (com TTL)
    match /temp/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
*/

// =========================================
// 🔄 INICIALIZAÇÃO FINAL
// =========================================

// Log de inicialização
if (isDevelopment) {
  logFirebaseConfig();
}

// Verificar configuração na inicialização
if (!isFirebaseConfigured()) {
  console.error('🚨 Firebase não está configurado corretamente!');
  console.log('📋 Verifique se o arquivo .env.local existe e contém todas as variáveis necessárias');
}

// Export da app para casos especiais
export default app;