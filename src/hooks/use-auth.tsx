'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AUTH_ROUTES = ['/login', '/signup'];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

export function useAuthGuard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user && isAuthRoute(pathname)) {
        router.replace('/dashboard');
      }
      if (!user && !isAuthRoute(pathname) && pathname !== '/') {
        router.replace('/login');
      }
    }
  }, [user, loading, router, pathname]);

  return { user, loading };
}
