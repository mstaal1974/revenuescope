"use client";

import { FirebaseProvider, initializeFirebase } from "@/firebase/provider";
import React, { useState, useEffect } from "react";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseInstances, setFirebaseInstances] = useState<ReturnType<
    typeof initializeFirebase
  > | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !firebaseInstances) {
      setFirebaseInstances(initializeFirebase());
    }
  }, [firebaseInstances]);

  if (!firebaseInstances) {
    return null; // or a loading indicator
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstances.firebaseApp}
      auth={firebaseInstances.auth}
      firestore={firebaseInstances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
