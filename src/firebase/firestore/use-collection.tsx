"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, type Query, type DocumentData, type FirestoreError } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface UseCollectionOptions {
  // Add any options here, like listening for metadata changes
}

export const useCollection = <T extends DocumentData>(
  q: Query<T> | null,
  options?: UseCollectionOptions
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError(err);
        setLoading(false);
        
        // Create and emit a contextual error for debugging
        const permissionError = new FirestorePermissionError({
            path: (q as any)._path?.toString(), // Internal property, but useful
            operation: 'list',
        }, err);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
};
