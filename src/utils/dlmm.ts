import { BASIS_POINT_MAX } from "@/lib/constants";
import Decimal from "decimal.js";

/**
 * Calculate the bin ID from a price
 * Formula: binId = log(price) / log(1 + binStep/10000)
 *
 * @param price - The price to convert to bin ID
 * @param binStep - Bin step in basis points (e.g., 25 for 0.25%)
 * @param min - If true, floor the result; if false, ceil the result
 * @returns The bin ID
 */
export function getBinIdFromPrice(
  price: string | number | Decimal,
  binStep: number,
  min: boolean
): number {
  const priceDecimal = new Decimal(price);

  if (priceDecimal.lte(0)) {
    return 0;
  }

  // binStep is in basis points, convert to decimal (e.g., 25 -> 0.0025)
  const binStepDecimal = new Decimal(binStep).div(BASIS_POINT_MAX);
  const base = new Decimal(1).plus(binStepDecimal);

  // Calculate: log(price) / log(base)
  const binId = Decimal.ln(priceDecimal).div(Decimal.ln(base));

  return min ? Math.floor(binId.toNumber()) : Math.ceil(binId.toNumber());
}

/**
 * Calculate the number of bins for a price range
 * Formula: numberOfBins = upperBinId - lowerBinId + 1
 *
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param binStep - Bin step in basis points (e.g., 25 for 0.25%)
 * @returns Number of bins (rounded to integer)
 */
export function calculateNumberOfBins(
  minPrice: number | string | Decimal,
  maxPrice: number | string | Decimal,
  binStep: number
): number {
  const min = new Decimal(minPrice);
  const max = new Decimal(maxPrice);

  if (min.lte(0) || max.lte(0) || min.gte(max) || binStep <= 0) {
    return 0;
  }

  const lowerBinId = getBinIdFromPrice(min, binStep, true); // floor for min
  const upperBinId = getBinIdFromPrice(max, binStep, false); // ceil for max

  const numberOfBins = upperBinId - lowerBinId + 1;

  return Math.max(0, numberOfBins);
}
