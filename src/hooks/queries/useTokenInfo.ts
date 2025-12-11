"use client";

import { useQuery } from "@tanstack/react-query";
import { jupiterService, TokenInfo } from "@/services";

/**
 * Validates if a string is a valid Solana mint address
 * Solana addresses are base58 encoded and typically 32-44 characters
 */
export function isValidMintAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

interface UseTokenInfoOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch token information by mint address
 */
export function useTokenInfo(
  mintAddress: string,
  options: UseTokenInfoOptions = {}
) {
  const shouldFetch = isValidMintAddress(mintAddress);

  return useQuery<TokenInfo, Error>({
    queryKey: ["token", mintAddress],
    queryFn: () => jupiterService.searchToken(mintAddress),
    enabled: shouldFetch && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false,
  });
}
