"use client";

import { useQuery } from "@tanstack/react-query";
import { jupiterService } from "@/services";
import { QUOTE_TOKEN_MINTS } from "@/lib/constants";

interface UseMarketPriceOptions {
  baseTokenMint?: string;
  quoteToken: string;
}

/**
 * Hook to fetch market price ratio between base and quote tokens
 * Returns the price of base token in terms of quote token (basePrice / quotePrice)
 */
export function useMarketPrice({
  baseTokenMint,
  quoteToken,
}: UseMarketPriceOptions) {
  const quoteTokenMint = QUOTE_TOKEN_MINTS[quoteToken];

  return useQuery<number | null, Error>({
    queryKey: ["marketPrice", baseTokenMint, quoteToken],
    queryFn: async () => {
      if (!baseTokenMint || !quoteTokenMint) return null;

      const data = await jupiterService.getTokenPrices([
        quoteTokenMint,
        baseTokenMint,
      ]);

      const quotePrice = data[quoteTokenMint]?.usdPrice;
      const basePrice = data[baseTokenMint]?.usdPrice;

      if (!quotePrice || !basePrice) return null;

      return basePrice / quotePrice;
    },
    enabled: !!baseTokenMint && !!quoteTokenMint,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}
