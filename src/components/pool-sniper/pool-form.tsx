"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Button,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { BASE_FEE_OPTIONS, BIN_STEP_OPTIONS } from "@/lib/constants";
import { useMarketPrice } from "@/hooks/queries";
import { PoolSniperFormValues } from "./schema";
import { BaseTokenInput, PriceInput, TokenInfo } from "@/components/common";

export const PoolForm = () => {
  const { control, watch, setValue } = useFormContext<PoolSniperFormValues>();
  const quoteToken = watch("pool.quoteToken");
  const [baseTokenInfo, setBaseTokenInfo] = useState<TokenInfo | null>(null);

  // Fetch market price when baseTokenInfo changes
  const { data: marketPrice, isLoading: isPriceLoading } = useMarketPrice({
    baseTokenMint: baseTokenInfo?.address,
    quoteToken,
  });

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid rgba(70, 235, 128, 0.2)",
        borderRadius: "12px",
        backgroundColor: "rgba(7, 13, 10, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#46EB80",
            color: "#070D0A",
            px: 1.5,
            py: 0.5,
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        >
          NEW POOL
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.6)", mr: 1 }}
          >
            QUOTE TOKEN
          </Typography>
          <Controller
            name="pool.quoteToken"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    field.onChange(value);
                  }
                }}
                size="small"
              >
                <ToggleButton
                  value="SOL"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(70, 235, 128, 0.3)",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(70, 235, 128, 0.2)",
                      color: "#46EB80",
                      borderColor: "#46EB80",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "rgba(70, 235, 128, 0.3)",
                    },
                  }}
                >
                  SOL
                </ToggleButton>
                <ToggleButton
                  value="USDC"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(70, 235, 128, 0.3)",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(70, 235, 128, 0.2)",
                      color: "#46EB80",
                      borderColor: "#46EB80",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "rgba(70, 235, 128, 0.3)",
                    },
                  }}
                >
                  USDC
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>
      </Box>

      {/* Base Token Input */}
      <Controller
        name="pool.baseToken"
        control={control}
        render={({ field }) => (
          <BaseTokenInput
            value={field.value}
            onChange={field.onChange}
            onTokenFetched={setBaseTokenInfo}
            placeholder="Input base token"
          />
        )}
      />

      {/* Base Fee and Bin Step Row */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl fullWidth size="small">
          <Controller
            name="pool.baseFee"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? ""}
                displayEmpty
                sx={{
                  backgroundColor: "rgba(7, 13, 10, 0.8)",
                  color: "rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(70, 235, 128, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(70, 235, 128, 0.4)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#46EB80",
                  },
                  "& .MuiSelect-icon": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#0a1510",
                      border: "1px solid rgba(70, 235, 128, 0.2)",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Select base fee
                  </Typography>
                </MenuItem>
                {BASE_FEE_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(70, 235, 128, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(70, 235, 128, 0.2)",
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth size="small">
          <Controller
            name="pool.binStep"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? ""}
                displayEmpty
                sx={{
                  backgroundColor: "rgba(7, 13, 10, 0.8)",
                  color: "rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(70, 235, 128, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(70, 235, 128, 0.4)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#46EB80",
                  },
                  "& .MuiSelect-icon": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#0a1510",
                      border: "1px solid rgba(70, 235, 128, 0.2)",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Select bin step
                  </Typography>
                </MenuItem>
                {BIN_STEP_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(70, 235, 128, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(70, 235, 128, 0.2)",
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>

      {/* Initial Price Section */}
      <Controller
        name="pool.initialPrice"
        control={control}
        render={({ field }) => (
          <PriceInput
            value={field.value}
            onChange={field.onChange}
            quoteToken={quoteToken}
            baseToken={baseTokenInfo?.symbol}
            label="Initial Price"
          />
        )}
      />

      {/* Market Price Box */}
      {baseTokenInfo && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(70, 235, 128, 0.05)",
            border: "1px solid rgba(70, 235, 128, 0.15)",
            borderRadius: "8px",
            p: 1.5,
            mt: -1,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
            >
              Market Price
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
              }}
            >
              {isPriceLoading
                ? "Loading..."
                : marketPrice
                  ? marketPrice.toFixed(10)
                  : "N/A"}{" "}
              {quoteToken}/{baseTokenInfo.symbol}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (marketPrice) {
                setValue("pool.initialPrice", marketPrice);
              }
            }}
            disabled={!marketPrice || isPriceLoading}
            sx={{
              color: "#46EB80",
              borderColor: "rgba(70, 235, 128, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(70, 235, 128, 0.1)",
                borderColor: "#46EB80",
              },
              "&.Mui-disabled": {
                color: "rgba(70, 235, 128, 0.3)",
                borderColor: "rgba(70, 235, 128, 0.1)",
              },
            }}
          >
            Apply market price
          </Button>
        </Box>
      )}
    </Box>
  );
};
