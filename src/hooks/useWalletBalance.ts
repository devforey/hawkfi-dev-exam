"use client";

import { useWallet, useConnection } from "@jup-ag/wallet-adapter";
import { useQuery } from "@tanstack/react-query";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const useWalletBalance = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["walletBalance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !connection) return null;
      const lamports = await connection.getBalance(publicKey);
      return lamports / LAMPORTS_PER_SOL;
    },
    enabled: connected && !!publicKey && !!connection,
    staleTime: 30 * 1000, // Refresh every 30 seconds
    refetchInterval: 30 * 1000,
  });

  return {
    balance,
    isLoading,
    error,
    refetch,
    connected,
  };
};
