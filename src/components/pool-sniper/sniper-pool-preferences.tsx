"use client";

import { Box, Divider, Typography } from "@mui/material";
import { PencilSimple } from "@phosphor-icons/react";
import { colors } from "@/theme/tokens/colors";

interface PreferenceItemProps {
  label: string;
  value: string;
}

function PreferenceItem({ label, value }: PreferenceItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        flex: 1,
        py: 1.5,
        px: 2,
      }}
    >
      <Typography
        variant="preferencesLabel"
        sx={{ color: colors.gray[500] }}
      >
        {label}
      </Typography>
      <Typography
        variant="preferencesValue"
        sx={{ color: colors.gray[400] }}
      >
        {value}
      </Typography>
      <PencilSimple size={14} color={colors.gray[500]} />
    </Box>
  );
}

export interface SniperPoolPreferencesProps {
  priorityFee?: string;
  depositSlippage?: string;
}

export function SniperPoolPreferences({
  priorityFee = "FAST",
  depositSlippage = "0.5%",
}: SniperPoolPreferencesProps) {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid",
        borderColor: colors.neutral[700],
        borderRadius: "8px",
        backgroundColor: "transparent",
      }}
    >
      <PreferenceItem label="PRIORITY FEE" value={priorityFee} />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: colors.neutral[700] }}
      />
      <PreferenceItem label="DEPOSIT SLIPPAGE" value={depositSlippage} />
    </Box>
  );
}
