"use client";

import { useState, useEffect, forwardRef } from "react";
import {
  Box,
  OutlinedInput,
  Typography,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Close, CheckCircle } from "@mui/icons-material";
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

export const BaseTokenInput = forwardRef<HTMLInputElement, BaseTokenInputProps>(
  (
    {
      value,
      onChange,
      onTokenFetched,
      error,
      placeholder = "Enter token mint address",
      label,
    },
    ref
  ) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(value);

  const shouldFetch = isValidMintAddress(inputValue);

  const { data: tokenInfo, isLoading, isError } = useTokenInfo(inputValue);

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
            color: "custom.textMuted",
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}

      <OutlinedInput
        inputRef={ref}
        value={inputValue}
        onChange={handleInputChange}
        size="small"
        fullWidth
        error={!!showError}
        sx={{
          "& .MuiOutlinedInput-input": {
            textAlign: "right",
          },
        }}
        startAdornment={
          <InputAdornment position="start">
            {showTokenInfo ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mr: 1,
                }}
              >
                <Avatar
                  src={tokenInfo.logoURI}
                  alt={tokenInfo.symbol}
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    fontSize: "0.625rem",
                  }}
                >
                  {tokenInfo.symbol?.[0]}
                </Avatar>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {tokenInfo.symbol}
                </Typography>
              </Box>
            ) : !inputValue ? (
              <Typography
                sx={{
                  color: "text.secondary",
                  opacity: "0.8",
                  ...theme.typography.tokenInputPlaceholder,
                  pointerEvents: "none",
                }}
              >
                {placeholder}
              </Typography>
            ) : null}
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {isLoading && (
              <CircularProgress size={20} sx={{ color: "primary.main" }} />
            )}
            {showTokenInfo && !isLoading && (
              <Box
                onClick={handleClear}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "& .check-icon": {
                    display: "flex",
                  },
                  "& .close-icon": {
                    display: "none",
                  },
                  "&:hover .check-icon": {
                    display: "none",
                  },
                  "&:hover .close-icon": {
                    display: "flex",
                  },
                }}
              >
                <CheckCircle
                  className="check-icon"
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Close
                  className="close-icon"
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </Box>
            )}
            {inputValue && !isLoading && !showTokenInfo && (
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: "text.secondary" }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        }
      />

      {showError && (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
            mt: 0.5,
            display: "block",
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

BaseTokenInput.displayName = "BaseTokenInput";
