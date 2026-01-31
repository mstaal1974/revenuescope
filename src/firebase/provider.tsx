"use client";

import React, { createContext, useContext } from "react";
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

// Validate Firebase configuration
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  // Throwing an error is appropriate here as the app cannot function without Firebase config.
  // This will be caught by Next.js's error overlay in development.
  throw new Error(
    "Firebase configuration is missing or incomplete. Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env.local file. You can use the .env file as a template."
  );
}


// Initialize Firebase at the module level. This ensures it's done once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const FirebaseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp: app, auth, firestore }}>
      {children}
      {process.env.NODE_ENV === "development" && <FirebaseErrorListener />}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const useFirebaseApp = (): FirebaseApp => {
  return useFirebase().firebaseApp;
};

export const useAuth = (): Auth => {
  return useFirebase().auth;
};

export const useFirestore = (): Firestore => {
  return useFirebase().firestore;
};
