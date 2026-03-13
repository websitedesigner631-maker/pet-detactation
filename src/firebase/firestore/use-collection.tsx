'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  type DocumentData,
  type Query,
  type Unsubscribe,
  type FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type UseCollectionOptions = {
  where?: [string, '==', any];
  orderBy?: [string, 'desc' | 'asc'];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
  limitToLast?: number;
};

export function useCollection<T extends DocumentData>(
  path: string,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const queryMemo = useMemo(() => {
    if (!firestore) return null;

    let q: Query = collection(firestore, path);
    if (options?.where) q = query(q, where(...options.where));
    if (options?.orderBy) q = query(q, orderBy(...options.orderBy));
    if (options?.limit) q = query(q, limit(options.limit));
    if (options?.startAfter) q = query(q, startAfter(options.startAfter));
    if (options?.endBefore) q = query(q, endBefore(options.endBefore));
    if (options?.limitToLast) q = query(q, limitToLast(options.limitToLast));

    return q;
  }, [firestore, path, options]);

  useEffect(() => {
    if (!queryMemo) {
      return;
    }

    setLoading(true);

    const unsubscribe: Unsubscribe = onSnapshot(
      queryMemo,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryMemo, path]);

  return { data, loading, error };
}
