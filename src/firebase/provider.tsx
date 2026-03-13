'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

export type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseServices | null>(null);

export const initializeFirebase = (): FirebaseServices => {
  const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
};

export function FirebaseProvider({
  children,
  ...services
}: {
  children: ReactNode;
} & FirebaseServices) {
  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = (): FirebaseServices | null => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = (): FirebaseApp | null => {
  const services = useFirebase();
  return services ? services.firebaseApp : null;
};

export const useAuth = (): Auth | null => {
  const services = useFirebase();
  return services ? services.auth : null;
};

export const useFirestore = (): Firestore | null => {
  const services = useFirebase();
  return services ? services.firestore : null;
};
