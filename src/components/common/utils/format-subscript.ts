const SUBSCRIPT_DIGITS = "₀₁₂₃₄₅₆₇₈₉";

/**
 * Converts a number with leading zeros to subscript notation.
 * Example: 0.0000484 → "0.0₄484"
 *
 * The subscript digit represents the count of zeros after the decimal point.
 */
export function formatSubscript(num: number): string {
  if (num === 0) return "0";
  if (num >= 1 || num < 0) return num.toString();

  const str = num.toString();

  // Match pattern: 0.000...XXX (zeros followed by significant digits)
  const match = str.match(/^0\.(0+)(\d+)$/);
  if (!match) return str;

  const zeroCount = match[1].length;
  const significand = match[2];

  // Convert zero count to subscript characters
  const subscript = String(zeroCount)
    .split("")
    .map((d) => SUBSCRIPT_DIGITS[+d])
    .join("");

  return `0.0${subscript}${significand}`;
}

/**
 * Parses a subscript notation string back to a number.
 * Example: "0.0₄484" → 0.0000484
 */
export function parseSubscript(str: string): number {
  // Check if it contains subscript digits
  const subscriptMatch = str.match(/0\.0([₀₁₂₃₄₅₆₇₈₉]+)(\d+)/);
  if (!subscriptMatch) {
    return parseFloat(str) || 0;
  }

  // Convert subscript digits back to number
  const zeroCount = subscriptMatch[1]
    .split("")
    .map((char) => SUBSCRIPT_DIGITS.indexOf(char))
    .join("");

  const significand = subscriptMatch[2];
  const zeros = "0".repeat(parseInt(zeroCount, 10));

  return parseFloat(`0.${zeros}${significand}`);
}
