"use client";

import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useWallet } from "@jup-ag/wallet-adapter";
import { WalletButton } from "@/components/solana/wallet-button";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "custom.backgroundOverlay",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          HawkFi Dev Exam
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {connected && (
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {publicKey?.toString().slice(0, 8)}...
              {publicKey?.toString().slice(-8)}
            </Typography>
          )}
          <WalletButton />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              fontWeight: "bold",
              color: "primary.main",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              mb: 3,
            }}
          >
            Let the exam begin. Good luck!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              mb: 4,
            }}
          >
            {connected
              ? "Wallet connected! You're ready to start building on Solana."
              : "Connect your wallet to get started with the Solana development exam."}
          </Typography>

          {!connected && (
            <Box sx={{ mt: 3 }}>
              <WalletButton />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
