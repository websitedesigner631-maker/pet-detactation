'use client';

import {
  initializeFirebase,
  FirebaseProvider,
  type FirebaseServices,
} from '@/firebase/provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

let firebase: FirebaseServices | null = null;

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!firebase) {
    firebase = initializeFirebase();
  }
  return (
    <FirebaseProvider {...firebase}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </FirebaseProvider>
  );
}
