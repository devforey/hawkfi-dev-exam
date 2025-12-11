"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  OutlinedInput,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Decimal from "decimal.js";

export interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  quoteToken?: string;
  baseToken?: string;
  incrementPercent?: number;
  min?: number;
  max?: number;
  error?: string;
  label?: string;
}

export const PriceInput = ({
  value,
  onChange,
  quoteToken = "",
  baseToken = "",
  incrementPercent = 1,
  min = 0,
  max,
  error,
  label,
}: PriceInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(value.toString());
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      const clamped = clampValue(parsed);
      onChange(clamped);
      setInputValue(clamped.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow valid numeric input including decimals
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const clampValue = (val: number): number => {
    let result = val;
    if (min !== undefined && result < min) result = min;
    if (max !== undefined && result > max) result = max;
    return result;
  };

  const handleIncrement = () => {
    const decimal = new Decimal(value);
    const multiplier = new Decimal(1 + incrementPercent / 100);
    const newValue = decimal.mul(multiplier).toNumber();
    onChange(clampValue(newValue));
  };

  const handleDecrement = () => {
    const decimal = new Decimal(value);
    const multiplier = new Decimal(1 - incrementPercent / 100);
    const newValue = decimal.mul(multiplier).toNumber();
    onChange(clampValue(newValue));
  };

  const displayValue = isEditing ? inputValue : value.toString();
  const tokenPairSuffix = quoteToken
    ? `${quoteToken}/${baseToken || "-"}`
    : "";

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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(7, 13, 10, 0.8)",
          border: `1px solid ${error ? "rgba(255, 99, 99, 0.5)" : "rgba(70, 235, 128, 0.2)"}`,
          borderRadius: "8px",
          p: 0.5,
          "&:hover": {
            borderColor: error
              ? "rgba(255, 99, 99, 0.7)"
              : "rgba(70, 235, 128, 0.4)",
          },
          "&:focus-within": {
            borderColor: error ? "#ff6363" : "#46EB80",
          },
        }}
      >
        <IconButton
          size="small"
          onClick={handleDecrement}
          disabled={value <= min}
          sx={{
            color: "#46EB80",
            "&:hover": {
              backgroundColor: "rgba(70, 235, 128, 0.1)",
            },
            "&.Mui-disabled": {
              color: "rgba(70, 235, 128, 0.3)",
            },
          }}
        >
          <Remove fontSize="small" />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          {isEditing ? (
            <OutlinedInput
              inputRef={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              size="small"
              sx={{
                backgroundColor: "transparent",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& input": {
                  color: "rgba(255, 255, 255, 0.8)",
                  fontFamily: "monospace",
                  textAlign: "center",
                  padding: "4px 8px",
                },
              }}
            />
          ) : (
            <Typography
              onClick={handleFocus}
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
                cursor: "text",
                userSelect: "none",
                py: 0.5,
                px: 1,
                "&:hover": {
                  backgroundColor: "rgba(70, 235, 128, 0.05)",
                  borderRadius: "4px",
                },
              }}
            >
              {displayValue}
            </Typography>
          )}

          {tokenPairSuffix && (
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.875rem",
              }}
            >
              {tokenPairSuffix}
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          sx={{
            color: "#46EB80",
            "&:hover": {
              backgroundColor: "rgba(70, 235, 128, 0.1)",
            },
            "&.Mui-disabled": {
              color: "rgba(70, 235, 128, 0.3)",
            },
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>

      {error && (
        <Typography
          variant="caption"
          sx={{
            color: "#ff6363",
            mt: 0.5,
            display: "block",
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
