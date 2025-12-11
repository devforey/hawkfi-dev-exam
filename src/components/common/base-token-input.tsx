"use client";

import { useState, useEffect } from "react";
import {
  Box,
  OutlinedInput,
  Typography,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface BaseTokenInputProps {
  value: string;
  onChange: (value: string) => void;
  onTokenFetched?: (token: TokenInfo | null) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}

const fetchTokenInfo = async (mintAddress: string): Promise<TokenInfo> => {
  const response = await fetch(
    `https://lite-api.jup.ag/tokens/v2/search?query=${mintAddress}`
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
};

const isValidMintAddress = (address: string): boolean => {
  // Solana addresses are base58 encoded and typically 32-44 characters
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

export const BaseTokenInput = ({
  value,
  onChange,
  onTokenFetched,
  error,
  placeholder = "Enter token mint address",
  label,
}: BaseTokenInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const shouldFetch = isValidMintAddress(inputValue);

  const {
    data: tokenInfo,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["token", inputValue],
    queryFn: () => fetchTokenInfo(inputValue),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false,
  });

  useEffect(() => {
    if (tokenInfo) {
      onTokenFetched?.(tokenInfo);
    } else if (!shouldFetch || isError) {
      onTokenFetched?.(null);
    }
  }, [tokenInfo, shouldFetch, isError, onTokenFetched]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    onTokenFetched?.(null);
  };

  const showTokenInfo = tokenInfo && !isLoading && !isError;
  const showError = isError || (error && !isLoading);
  const errorMessage = error || (isError ? "Token not found" : "");

  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}

      <OutlinedInput
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        size="small"
        fullWidth
        error={!!showError}
        endAdornment={
          <InputAdornment position="end">
            {isLoading && <CircularProgress size={20} sx={{ color: "#46EB80" }} />}
            {inputValue && !isLoading && (
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        }
        sx={{
          backgroundColor: "rgba(7, 13, 10, 0.8)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: showError
              ? "rgba(255, 99, 99, 0.5)"
              : "rgba(70, 235, 128, 0.2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: showError
              ? "rgba(255, 99, 99, 0.7)"
              : "rgba(70, 235, 128, 0.4)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: showError ? "#ff6363" : "#46EB80",
          },
          "& input": {
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "monospace",
            fontSize: "0.875rem",
          },
          "& input::placeholder": {
            color: "rgba(255, 255, 255, 0.5)",
            opacity: 1,
          },
        }}
      />

      {showError && (
        <Typography
          variant="caption"
          sx={{
            color: "#ff6363",
            mt: 0.5,
            display: "block",
          }}
        >
          {errorMessage}
        </Typography>
      )}

      {showTokenInfo && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            p: 1,
            backgroundColor: "rgba(70, 235, 128, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(70, 235, 128, 0.2)",
          }}
        >
          <Avatar
            src={tokenInfo.logoURI}
            alt={tokenInfo.symbol}
            sx={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(70, 235, 128, 0.2)",
            }}
          >
            {tokenInfo.symbol?.[0]}
          </Avatar>
          <Box>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {tokenInfo.symbol}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.75rem",
              }}
            >
              {tokenInfo.name}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.75rem",
              ml: "auto",
            }}
          >
            {tokenInfo.decimals} decimals
          </Typography>
        </Box>
      )}
    </Box>
  );
};
