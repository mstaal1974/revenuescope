/**
 * @fileOverview A utility for extracting a JSON object from a string.
 */

/**
 * Extracts a JSON object from a string. It first tries to parse the whole string,
 * and if that fails, it looks for the first occurrence of a JSON object or array.
 * @param text The text to parse.
 * @returns The parsed JSON object.
 * @throws An error if JSON parsing fails.
 */
export function extractJson(text: string): unknown {
  try {
    // First, try to parse the entire string.
    return JSON.parse(text);
  } catch (e) {
    // If that fails, find the first and last curly brace or square bracket.
    const firstBracket = text.indexOf('{');
    const lastBracket = text.lastIndexOf('}');
    const firstSquare = text.indexOf('[');
    const lastSquare = text.lastIndexOf(']');

    let start = -1;
    let end = -1;

    // Determine if we are dealing with an object or an array
    if (firstBracket !== -1 && (firstSquare === -1 || firstBracket < firstSquare)) {
      // It's likely an object
      start = firstBracket;
      end = lastBracket;
    } else if (firstSquare !== -1) {
      // It's likely an array
      start = firstSquare;
      end = lastSquare;
    }

    if (start !== -1 && end !== -1 && end > start) {
      const jsonString = text.substring(start, end + 1);
      try {
        // Try parsing the extracted substring.
        return JSON.parse(jsonString);
      } catch (innerError) {
        throw new Error(
          `Failed to parse extracted JSON substring: ${
            innerError instanceof Error ? innerError.message : String(innerError)
          }\nSubstring: "${jsonString}"`
        );
      }
    }
  }

  throw new Error("Failed to find or parse JSON object in the provided text.");
}
