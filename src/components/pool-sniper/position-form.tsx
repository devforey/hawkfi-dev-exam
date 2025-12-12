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
  Avatar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { POSITION_PRESETS, SOL_LOGO_URL } from "@/lib/constants";
import { PoolSniperFormValues } from "./schema";
import { PriceInput, TokenInfo } from "@/components/common";
import { calculateNumberOfBins } from "@/utils/dlmm";
import { useWalletBalance } from "@/hooks/useWalletBalance";

const DEPOSIT_OPTIONS = ["0.5", "1", "5", "CUSTOM"] as const;
const QUICK_PRESETS = POSITION_PRESETS.slice(0, 3); // HFL, HFL Turbo, MCU

interface PositionFormProps {
  baseTokenInfo?: TokenInfo | null;
}

export const PositionForm = ({ baseTokenInfo }: PositionFormProps) => {
  const theme = useTheme();
  const { control, setValue, getValues } =
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
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "background.default",
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
          variant="sectionLabel"
          sx={{ color: "custom.textTertiary", mb: 1 }}
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
                backgroundColor: "custom.inputBackground",
                color: "text.primary",
                border: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: alpha(
                    theme.palette.custom.inputBackground,
                    0.8,
                  ),
                  boxShadow: "none",
                },
                textTransform: "none",
                minWidth: "100px",
                fontWeight: 800,
                py: 1,
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
              <FormControl size="small" sx={{ minWidth: 220, maxWidth: 228 }}>
                <Select
                  value={field.value ?? ""}
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "inherit", opacity: 0.5 }}>
                          Select HawkFi preset
                        </span>
                      );
                    }
                    const preset = POSITION_PRESETS.find((p) => p.id === value);
                    return preset ? `${preset.code} - ${preset.name}` : null;
                  }}
                  onChange={(e) => {
                    const presetId = e.target.value as number;
                    const preset = POSITION_PRESETS.find(
                      (p) => p.id === presetId,
                    );
                    if (preset) {
                      applyPreset(preset);
                    }
                  }}
                >
                  {POSITION_PRESETS.map((preset) => (
                    <MenuItem key={preset.id} value={preset.id}>
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
          variant="sectionLabel"
          sx={{ color: "custom.textTertiary", mb: 1 }}
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
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid transparent !important",
                  "&:not(:first-of-type)": {
                    marginLeft: 0,
                  },
                },
              }}
            >
              {DEPOSIT_OPTIONS.map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    py: 1.5,
                    px: 2,
                    border: "1px solid transparent !important",
                    borderRadius: "8px !important",
                    backgroundColor: "custom.inputBackground",
                    opacity: 0.5,
                    "&.Mui-selected": {
                      border: "1px solid #C4CAC8 !important",
                      backgroundColor: "custom.inputBackground",
                      opacity: 1,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "custom.inputBackground",
                    },
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.custom.inputBackground,
                        0.8,
                      ),
                    },
                  }}
                >
                  {option === "CUSTOM" ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {baseTokenInfo?.logoURI && (
                        <Avatar
                          src={baseTokenInfo.logoURI}
                          sx={{ width: 20, height: 20 }}
                        />
                      )}
                      <Typography
                        sx={{
                          mx: 0.5,
                          fontSize: "10px",
                          color: "text.secondary",
                        }}
                      >
                        +
                      </Typography>
                      <Avatar
                        src={SOL_LOGO_URL}
                        sx={{ width: 20, height: 20 }}
                      />
                    </Box>
                  ) : (
                    <Avatar src={SOL_LOGO_URL} sx={{ width: 20, height: 20 }} />
                  )}
                  <Typography
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 800,
                      fontSize: "12px",
                      lineHeight: "140%",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.primary",
                    }}
                  >
                    {option === "CUSTOM" ? "CUSTOM" : `${option} SOL`}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        {/* Balance Display */}
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: "warning.main",
              "& .MuiAlert-icon": {
                color: "warning.main",
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
              variant="sectionLabel"
              sx={{ color: "custom.textTertiary" }}
            >
              MIN PRICE
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
                baseToken={baseTokenInfo?.symbol}
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
              variant="sectionLabel"
              sx={{ color: "custom.textTertiary" }}
            >
              MAX PRICE
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
                baseToken={baseTokenInfo?.symbol}
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
          backgroundColor: "#1A1E1C",
          borderRadius: "8px",
          p: 1.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "12px",
            lineHeight: "140%",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#EFF0F0",
          }}
        >
          {quoteToken}/{baseTokenInfo?.symbol ?? "-"}
        </Typography>
        <Button
          size="small"
          onClick={resetPriceRange}
          startIcon={<span>↻</span>}
          sx={{
            fontWeight: 800,
            fontSize: "12px",
            lineHeight: "140%",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#C4CAC8",
            "&:hover": {
              backgroundColor: alpha("#C4CAC8", 0.1),
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
          backgroundColor: "#0F1411",
          border: "1px solid #1A1E1C",
          borderRadius: "4px",
          px: 1.5,
          py: 0.75,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "100%",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#8B948F",
          }}
        >
          NUMBER OF BINS
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "13px",
            lineHeight: "140%",
            letterSpacing: "0",
            color: "#EFF0F0",
          }}
        >
          {numberOfBins}
        </Typography>
      </Box>
    </Box>
  );
};
