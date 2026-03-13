'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
  type FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T extends DocumentData>(path: string, docId?: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const docRefMemo = useMemo(() => {
    if (!firestore || !docId) return null;
    return doc(firestore, path, docId);
  }, [firestore, path, docId]);

  useEffect(() => {
    if (!docRefMemo) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribe: Unsubscribe = onSnapshot(
      docRefMemo,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: docRefMemo.path,
            operation: 'get'
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRefMemo]);

  return { data, loading, error };
}
