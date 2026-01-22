"use client";

import { useEffect } from "react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

/**
 * A client component that listens for Firestore permission errors and throws them
 * to be caught by the Next.js development error overlay.
 *
 * This is ONLY for use in development to improve the debugging experience.
 * It should be rendered within a top-level layout or provider.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Throw the error so Next.js can catch it and display the overlay
      throw error;
    };

    errorEmitter.on("permission-error", handlePermissionError);

    return () => {
      errorEmitter.off("permission-error", handlePermissionError);
    };
  }, []);

  // This component does not render anything itself
  return null;
}
