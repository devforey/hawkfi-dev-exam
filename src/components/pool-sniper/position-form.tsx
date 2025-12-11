"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Alert,
} from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { POSITION_PRESETS } from "@/lib/constants";
import { PoolSniperFormValues } from "./schema";
import { PriceInput } from "@/components/common";
import { calculateNumberOfBins } from "@/utils/dlmm";
import { useWalletBalance } from "@/hooks/useWalletBalance";

const DEPOSIT_OPTIONS = ["0.5", "1", "5", "CUSTOM"] as const;
const QUICK_PRESETS = POSITION_PRESETS.slice(0, 3); // HFL, HFL Turbo, MCU

export const PositionForm = () => {
  const { control, watch, setValue, getValues } =
    useFormContext<PoolSniperFormValues>();
  const { balance, isLoading: isBalanceLoading } = useWalletBalance();

  // Watch pool and position values for reactive updates
  const initialPrice = useWatch({ control, name: "pool.initialPrice" });
  const binStep = useWatch({ control, name: "pool.binStep" });
  const quoteToken = useWatch({ control, name: "pool.quoteToken" });
  const minPrice = useWatch({ control, name: "position.minPrice" });
  const maxPrice = useWatch({ control, name: "position.maxPrice" });
  const depositAmount = useWatch({ control, name: "position.depositAmount" });

  // Auto-initialize price range when initialPrice is set and prices are at default
  useEffect(() => {
    const currentMin = getValues("position.minPrice");
    const currentMax = getValues("position.maxPrice");

    // Only auto-set if currently at defaults (0)
    if (initialPrice > 0 && currentMin === 0 && currentMax === 0) {
      setValue("position.minPrice", initialPrice * 0.9);
      setValue("position.maxPrice", initialPrice * 1.1);
    }
  }, [initialPrice, getValues, setValue]);

  // Calculate number of bins
  const numberOfBins = useMemo(() => {
    if (minPrice > 0 && maxPrice > 0 && binStep) {
      return calculateNumberOfBins(minPrice, maxPrice, binStep);
    }
    return 0;
  }, [minPrice, maxPrice, binStep]);

  // Calculate percentage offset from initial price
  const minPriceOffset = useMemo(() => {
    if (initialPrice > 0 && minPrice > 0) {
      return ((minPrice - initialPrice) / initialPrice) * 100;
    }
    return -10;
  }, [initialPrice, minPrice]);

  const maxPriceOffset = useMemo(() => {
    if (initialPrice > 0 && maxPrice > 0) {
      return ((maxPrice - initialPrice) / initialPrice) * 100;
    }
    return 10;
  }, [initialPrice, maxPrice]);

  // Apply preset
  const applyPreset = useCallback(
    (preset: (typeof POSITION_PRESETS)[0]) => {
      const currentInitialPrice = getValues("pool.initialPrice");
      if (currentInitialPrice > 0) {
        const newMinPrice =
          currentInitialPrice * (1 - preset.lowerPercentage / 100);
        const newMaxPrice =
          currentInitialPrice * (1 + preset.upperPercentage / 100);

        setValue("position.presetId", preset.id);
        setValue("position.minPrice", newMinPrice);
        setValue("position.maxPrice", newMaxPrice);
        setValue("position.depositAmount", preset.solAmount);

        // Update deposit option to match preset
        const matchingOption = DEPOSIT_OPTIONS.find(
          (opt) => opt === String(preset.solAmount),
        );
        if (matchingOption) {
          setValue("position.depositOption", matchingOption);
        } else {
          setValue("position.depositOption", "CUSTOM");
        }
      }
    },
    [getValues, setValue],
  );

  // Reset price range to ±10% of initial price
  const resetPriceRange = useCallback(() => {
    const currentInitialPrice = getValues("pool.initialPrice");
    if (currentInitialPrice > 0) {
      setValue("position.minPrice", currentInitialPrice * 0.9);
      setValue("position.maxPrice", currentInitialPrice * 1.1);
    }
  }, [getValues, setValue]);

  // Handle deposit option change
  const handleDepositOptionChange = useCallback(
    (newOption: (typeof DEPOSIT_OPTIONS)[number]) => {
      setValue("position.depositOption", newOption);
      if (newOption !== "CUSTOM") {
        setValue("position.depositAmount", parseFloat(newOption));
      }
    },
    [setValue],
  );

  // Check if deposit exceeds balance
  const showBalanceWarning =
    balance !== null && balance !== undefined && depositAmount > balance;

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
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#46EB80",
          color: "#070D0A",
          px: 1.5,
          py: 0.5,
          borderRadius: "4px",
          fontWeight: "bold",
          fontSize: "0.75rem",
          alignSelf: "flex-start",
        }}
      >
        NEW POSITION
      </Box>

      {/* Preset Section */}
      <Box>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          PRESET (OPTIONAL)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* Quick Preset Buttons */}
          {QUICK_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="contained"
              size="small"
              onClick={() => applyPreset(preset)}
              sx={{
                backgroundColor: "rgba(70, 235, 128, 0.15)",
                color: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(70, 235, 128, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(70, 235, 128, 0.25)",
                },
                textTransform: "none",
                minWidth: "80px",
              }}
            >
              {preset.shortName}
            </Button>
          ))}

          {/* Preset Dropdown */}
          <Controller
            name="position.presetId"
            control={control}
            render={({ field }) => (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={field.value ?? ""}
                  displayEmpty
                  onChange={(e) => {
                    const presetId = e.target.value as number;
                    const preset = POSITION_PRESETS.find(
                      (p) => p.id === presetId,
                    );
                    if (preset) {
                      applyPreset(preset);
                    }
                  }}
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
                      Select HawkFi preset
                    </Typography>
                  </MenuItem>
                  {POSITION_PRESETS.map((preset) => (
                    <MenuItem
                      key={preset.id}
                      value={preset.id}
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
                      {preset.code} - {preset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </Box>

      {/* Deposit Amount Section */}
      <Box>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          DEPOSIT AMOUNT
        </Typography>
        <Controller
          name="position.depositOption"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_, value) => {
                if (value !== null) {
                  handleDepositOptionChange(
                    value as (typeof DEPOSIT_OPTIONS)[number],
                  );
                }
              }}
              size="small"
              sx={{ flexWrap: "wrap" }}
            >
              {DEPOSIT_OPTIONS.map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(70, 235, 128, 0.3)",
                    px: 3,
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
                  {option === "CUSTOM" ? "CUSTOM" : `${option} SOL`}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        {/* Balance Display */}
        <Box sx={{ mt: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Wallet Balance:{" "}
            {isBalanceLoading
              ? "Loading..."
              : balance !== null && balance !== undefined
              ? `${balance.toFixed(4)} SOL`
              : "Not connected"}
          </Typography>
        </Box>

        {/* Balance Warning */}
        {showBalanceWarning && (
          <Alert
            severity="warning"
            sx={{
              mt: 1,
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              color: "#ffb74d",
              "& .MuiAlert-icon": {
                color: "#ffb74d",
              },
            }}
          >
            Deposit amount exceeds wallet balance
          </Alert>
        )}
      </Box>

      {/* Price Range Section */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Min Price */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              MIN PRICE
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {minPriceOffset >= 0 ? "+" : ""}
              {minPriceOffset.toFixed(1)}%
            </Typography>
          </Box>
          <Controller
            name="position.minPrice"
            control={control}
            render={({ field, fieldState }) => (
              <PriceInput
                value={field.value}
                onChange={field.onChange}
                quoteToken={quoteToken}
                max={maxPrice > 0 ? maxPrice : undefined}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Max Price */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              MAX PRICE
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {maxPriceOffset >= 0 ? "+" : ""}
              {maxPriceOffset.toFixed(1)}%
            </Typography>
          </Box>
          <Controller
            name="position.maxPrice"
            control={control}
            render={({ field, fieldState }) => (
              <PriceInput
                value={field.value}
                onChange={field.onChange}
                quoteToken={quoteToken}
                min={minPrice > 0 ? minPrice : 0}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Token Pair Label and Reset Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
          {quoteToken}/{watch("pool.baseToken") ? "TOKEN" : "-"}
        </Typography>
        <Button
          size="small"
          onClick={resetPriceRange}
          startIcon={<span>↻</span>}
          sx={{
            color: "#46EB80",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(70, 235, 128, 0.1)",
            },
          }}
        >
          RESET PRICE RANGE
        </Button>
      </Box>

      {/* Number of Bins Display */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(7, 13, 10, 0.8)",
          border: "1px solid rgba(70, 235, 128, 0.2)",
          borderRadius: "8px",
          p: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
          NUMBER OF BINS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          {numberOfBins}
        </Typography>
      </Box>
    </Box>
  );
};
