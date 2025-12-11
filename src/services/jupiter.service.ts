import { API_ENDPOINTS } from "@/lib/constants";

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface PriceData {
  [tokenMint: string]: {
    usdPrice: number;
  };
}

/**
 * Search for a token by its mint address using Jupiter's token API
 */
export async function searchToken(mintAddress: string): Promise<TokenInfo> {
  const response = await fetch(
    `${API_ENDPOINTS.JUPITER_TOKEN_SEARCH}?query=${mintAddress}`
  );

  if (!response.ok) {
    throw new Error("Token not found");
  }

  const data = await response.json();
  const token = data.find((t: { id: string }) => t.id === mintAddress);

  if (!token) {
    throw new Error("Token not found");
  }

  return {
    address: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    logoURI: token.icon,
  };
}

/**
 * Get USD prices for multiple tokens using Jupiter's price API
 */
export async function getTokenPrices(tokenMints: string[]): Promise<PriceData> {
  const response = await fetch(
    `${API_ENDPOINTS.JUPITER_PRICE}?ids=${tokenMints.join(",")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }

  return response.json();
}

export const jupiterService = {
  searchToken,
  getTokenPrices,
};
