export type SecurityRuleContext = {
  path: string;
  operation: "get" | "list" | "create" | "update" | "delete";
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission-denied errors.
 * This class enhances the standard Firebase error by adding rich,
 * structured context about the failed request, which is invaluable for debugging Security Rules.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  public originalError?: Error;

  constructor(context: SecurityRuleContext, originalError?: Error) {
    const formattedContext = JSON.stringify(
      {
        auth: "Signed-in user (see server logs for details)", // Placeholder for client
        ...context,
      },
      null,
      2
    );

    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${formattedContext}`;
    
    super(message);
    this.name = "FirestorePermissionError";
    this.context = context;
    this.originalError = originalError;

    // This is to make the error readable in the Next.js development overlay
    this.stack = ``;
  }
}
