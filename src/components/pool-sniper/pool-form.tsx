"use client";

import { useState, RefObject } from "react";
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
import { alpha, useTheme } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import { BASE_FEE_OPTIONS, BIN_STEP_OPTIONS } from "@/lib/constants";
import { useMarketPrice } from "@/hooks/queries";
import { PoolSniperFormValues } from "./schema";
import { BaseTokenInput, PriceInput, TokenInfo } from "@/components/common";

interface PoolFormProps {
  onBaseTokenInfoChange?: (info: TokenInfo | null) => void;
  baseTokenInputRef?: RefObject<HTMLInputElement | null>;
}

export const PoolForm = ({
  onBaseTokenInfoChange,
  baseTokenInputRef,
}: PoolFormProps) => {
  const theme = useTheme();
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
        backgroundColor: alpha(theme.palette.background.default, 0.5),
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
            backgroundColor: "primary.main",
            color: "background.default",
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
            sx={{
              color: "custom.textTertiary",
              fontWeight: 700,
              fontSize: "10px",
              lineHeight: "100%",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
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
                sx={{ gap: "10px" }}
              >
                <ToggleButton
                  value="SOL"
                  sx={{
                    minWidth: "29px",
                    height: "16px",
                    padding: "0 4px",
                    borderRadius: "4px !important",
                    border: `1px solid ${alpha("#8B948F", 0.5)}`,
                    borderLeft: `1px solid ${alpha("#8B948F", 0.5)} !important`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "100%",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    "&.Mui-selected": {
                      backgroundColor: "background.default",
                      color: "text.primary",
                      borderColor: "text.primary",
                      borderLeft: `1px solid ${theme.palette.text.primary} !important`,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "background.default",
                    },
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.5,
                      ),
                    },
                  }}
                >
                  SOL
                </ToggleButton>
                <ToggleButton
                  value="USDC"
                  sx={{
                    minWidth: "29px",
                    height: "16px",
                    padding: "0 4px",
                    borderRadius: "4px !important",
                    border: `1px solid ${alpha("#8B948F", 0.5)}`,
                    borderLeft: `1px solid ${alpha("#8B948F", 0.5)} !important`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "100%",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    "&.Mui-selected": {
                      backgroundColor: "background.default",
                      color: "text.primary",
                      borderColor: "text.primary",
                      borderLeft: `1px solid ${theme.palette.text.primary} !important`,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "background.default",
                    },
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.5,
                      ),
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
            ref={baseTokenInputRef}
            value={field.value}
            onChange={field.onChange}
            onTokenFetched={(info) => {
              setBaseTokenInfo(info);
              onBaseTokenInfoChange?.(info);
            }}
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
                renderValue={(value) => {
                  if (!value) {
                    return (
                      <span style={{ color: "inherit", opacity: 0.5 }}>
                        Select base fee
                      </span>
                    );
                  }
                  const option = BASE_FEE_OPTIONS.find(
                    (o) => o.value === value,
                  );
                  return option ? `Base fee ${option.label}` : null;
                }}
              >
                {BASE_FEE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
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
                renderValue={(value) => {
                  if (!value) {
                    return (
                      <span style={{ color: "inherit", opacity: 0.5 }}>
                        Select bin step
                      </span>
                    );
                  }
                  const option = BIN_STEP_OPTIONS.find(
                    (o) => o.value === value,
                  );
                  return option ? `Bin step ${option.label}` : null;
                }}
              >
                {BIN_STEP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#1A1E1C",
          borderRadius: "8px",
          p: 1.5,
          visibility: baseTokenInfo ? "visible" : "hidden",
        }}
      >
        <Box>
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
            MARKET PRICE
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "125%",
                letterSpacing: "0%",
                color: "#C4CAC8",
              }}
            >
              {isPriceLoading
                ? "Loading..."
                : marketPrice
                ? marketPrice.toFixed(10)
                : "N/A"}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "125%",
                letterSpacing: "0%",
                color: "#8B948F",
              }}
            >
              {quoteToken}/{baseTokenInfo?.symbol ?? "-"}
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          onClick={() => {
            if (marketPrice) {
              setValue("pool.initialPrice", marketPrice);
            }
          }}
          disabled={!marketPrice || isPriceLoading}
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
            "&.Mui-disabled": {
              color: alpha("#C4CAC8", 0.3),
            },
          }}
        >
          APPLY MARKET PRICE
        </Button>
      </Box>
    </Box>
  );
};
