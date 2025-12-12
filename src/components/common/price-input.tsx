"use client";

import { useState, useRef, useEffect } from "react";
import { Box, OutlinedInput, Typography, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
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
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleBlur = () => {
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

  const tokenPairSuffix = quoteToken ? `${quoteToken}/${baseToken || "-"}` : "";

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography
          variant="sectionLabel"
          sx={{
            color: "custom.textMuted",
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}

      <Box
        onClick={focusInput}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: "8px",
          p: 0.5,
          cursor: "pointer",
          border: "1px solid transparent",
          "&:hover": {
            borderColor: alpha(theme.palette.divider, 0.5),
          },
          "&:focus-within": {
            borderColor: theme.palette.divider,
          },
        }}
      >
        <IconButton
          size="small"
          onClick={handleDecrement}
          disabled={value <= min}
          sx={{
            color: "#8B948F",
            "&.Mui-disabled": {
              color: "rgba(139, 148, 143, 0.3)",
            },
          }}
        >
          <RemoveCircleOutline sx={{ fontSize: 16 }} />
        </IconButton>

        <OutlinedInput
          inputRef={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{
            flex: 1,
            backgroundColor: "transparent",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& input": {
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "125%",
              letterSpacing: "0%",
              textAlign: "right",
              color: "#C4CAC8",
              padding: "4px 8px",
            },
          }}
          endAdornment={
            tokenPairSuffix ? (
              <Typography
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "125%",
                  letterSpacing: "0%",
                  textAlign: "right",
                  color: "#8B948F",
                  whiteSpace: "nowrap",
                }}
              >
                {tokenPairSuffix}
              </Typography>
            ) : undefined
          }
        />

        <IconButton
          size="small"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          sx={{
            color: "#8B948F",
            "&.Mui-disabled": {
              color: "rgba(139, 148, 143, 0.3)",
            },
          }}
        >
          <AddCircleOutline sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {error && (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
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
