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
import { useTokenInfo, isValidMintAddress } from "@/hooks/queries";
import { TokenInfo } from "@/services";

export type { TokenInfo };

export interface BaseTokenInputProps {
  value: string;
  onChange: (value: string) => void;
  onTokenFetched?: (token: TokenInfo | null) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}

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
  } = useTokenInfo(inputValue);

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
            {isLoading && (
              <CircularProgress size={20} sx={{ color: "#46EB80" }} />
            )}
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
