"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData, type FirestoreError } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface UseDocOptions {
  // Options like listenToMetadataChanges can be added here
}

export const useDoc = <T extends DocumentData>(
  ref: DocumentReference<T> | null,
  options?: UseDocOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() } as T);
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError(err);
        setLoading(false);

        // Create and emit a contextual error for debugging
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        }, err);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
};
