'use client';

import { useUser, useFirestore } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

const AUTH_ROUTES = ['/login', '/signup', '/welcome'];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

export function useAuthGuard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  useEffect(() => {
    if (loading) return;

    const handleRedirect = async () => {
      if (user) {
        if (isAuthRoute(pathname)) {
          if (firestore) {
            try {
              const userDocRef = doc(firestore, 'users', user.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists() && userDoc.data().vetId) {
                router.replace('/veterinarian/bookings');
              } else {
                router.replace('/dashboard');
              }
            } catch (e) {
              console.error("Redirection failed:", e);
              router.replace('/dashboard'); // Fallback on error
            }
          } else {
            router.replace('/dashboard');
          }
        }
      } else {
        if (!isAuthRoute(pathname) && pathname !== '/') {
          router.replace('/login');
        }
      }
    };

    handleRedirect();
  }, [user, loading, router, pathname, firestore]);

  return { user, loading };
}
