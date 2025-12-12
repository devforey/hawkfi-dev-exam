"use client";

import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { CrosshairSimple, X } from "@phosphor-icons/react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { WalletButton } from "@/components/solana/wallet-button";
import {
  PoolSniperForm,
  PoolSniperFormRef,
} from "@/components/pool-sniper/pool-sniper-form";
import { PositionList } from "@/components/pool-sniper/position-list";
import Link from "next/link";
import { colors } from "@/theme/tokens/colors";

export default function PoolSniper() {
  const { connected, publicKey } = useWallet();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenPair, setTokenPair] = useState({ baseToken: "", quoteToken: "" });
  const [formValidation, setFormValidation] = useState({
    poolValid: false,
    positionValid: false,
  });

  const handleTokenChange = useCallback(
    (baseToken: string, quoteToken: string) => {
      setTokenPair({ baseToken, quoteToken });
    },
    [],
  );

  const handleValidationChange = useCallback(
    (poolValid: boolean, positionValid: boolean) => {
      setFormValidation({ poolValid, positionValid });
    },
    [],
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const formRef = useRef<PoolSniperFormRef>(null);
  const baseTokenInputRef = useRef<HTMLInputElement>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = useCallback(async () => {
    if (!formRef.current) return;

    setIsSubmitting(true);
    showSnackbar("Creating position...", "info");

    try {
      const result = await formRef.current.submitForm();
      if (result.success) {
        showSnackbar(
          `Position created! Pool: ${result.poolAddress?.slice(0, 8)}...`,
          "success",
        );
        handleClose();
      } else {
        showSnackbar(result.error || "Failed to create position", "error");
      }
    } catch {
      showSnackbar("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [showSnackbar]);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              HawkFi Dev Exam
            </Typography>
          </Link>
          <Typography
            variant="h6"
            sx={{
              color: "custom.textTertiary",
            }}
          >
            / Pool Sniper
          </Typography>
        </Box>

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
            Pool Sniper
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              mb: 4,
            }}
          >
            {connected
              ? "Wallet connected! Click below to open the pool sniper form."
              : "Connect your wallet to use the pool sniper."}
          </Typography>

          {connected ? (
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                bgcolor: "primary.main",
                color: "background.default",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                borderRadius: "12px",
                px: 4,
                py: 2,
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Open Pool Sniper
            </Button>
          ) : (
            <Box sx={{ mt: 3 }}>
              <WalletButton />
            </Box>
          )}
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        SlideProps={{
          onEntered: () => {
            baseTokenInputRef.current?.focus();
          },
        }}
        PaperProps={{
          sx: {
            maxWidth: "600px",
            width: "100%",
            mx: "auto",
            height: "90vh",
            maxHeight: "90vh",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            flexDirection: "column",
            bgcolor: "custom.backgroundOverlay",
            overflow: "hidden",
          },
        }}
      >
        <AppBar
          sx={{
            position: "relative",
            bgcolor: "custom.backgroundOverlay",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CrosshairSimple size={24} color="#FCFCFC" />
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk"',
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "150%",
                  color: "#FCFCFC",
                }}
              >
                Snipe
                {tokenPair.baseToken && tokenPair.quoteToken
                  ? ` ${tokenPair.baseToken}-${tokenPair.quoteToken}`
                  : ""}
              </Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ color: "#FCFCFC" }}
            >
              <X size={24} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            bgcolor: "custom.backgroundOverlay",
            flex: 1,
            overflow: "auto",
            p: 0,
          }}
        >
          <PoolSniperForm
            ref={formRef}
            onTokenChange={handleTokenChange}
            onValidationChange={handleValidationChange}
            baseTokenInputRef={baseTokenInputRef}
          />
        </Box>
        <Box
          sx={{
            bgcolor: "custom.backgroundOverlay",
            borderTop: `1px solid ${colors.neutral[700]}`,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: "#46E1EB",
              textTransform: "none",
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "145%",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formValidation.poolValid ||
              !formValidation.positionValid
            }
            sx={{
              flex: 1,
              height: "40px",
              bgcolor: "#46E1EB",
              color: "#06220D",
              textTransform: "none",
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "145%",
              px: "20px",
              py: "10px",
              borderRadius: "12px",
              border: "2px solid #46E1EB",
              "&:hover": {
                bgcolor: "#3bc8d4",
                borderColor: "#3bc8d4",
              },
              "&.Mui-disabled": {
                bgcolor: "#46E1EB",
                color: "#06220D",
                borderColor: "#46E1EB",
                opacity: 0.5,
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#06220D" }} />
            ) : !formValidation.poolValid ? (
              "Input new pool details"
            ) : !formValidation.positionValid ? (
              "Input new position details"
            ) : (
              `Confirm create new ${tokenPair.baseToken}-${tokenPair.quoteToken} pool and position`
            )}
          </Button>
        </Box>
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Position List outside dialog */}
      <PositionList />
    </Box>
  );
}
