"use client";

import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { useWallet } from "@jup-ag/wallet-adapter";
import { WalletButton } from "@/components/solana/wallet-button";
import {
  PoolSniperForm,
  PoolSniperFormRef,
} from "@/components/pool-sniper/pool-sniper-form";
import { PositionList } from "@/components/pool-sniper/position-list";
import Link from "next/link";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PoolSniper() {
  const { connected, publicKey } = useWallet();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    []
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
          "success"
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
        backgroundColor: "#070D0AE5",
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
          borderBottom: "1px solid rgba(70, 235, 128, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h4"
              sx={{
                color: "#46EB80",
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
              color: "rgba(255, 255, 255, 0.6)",
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
                color: "#46EB80",
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
              color: "#46EB80",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              mb: 3,
            }}
          >
            Pool Sniper
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
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
                backgroundColor: "#46EB80",
                color: "#070D0A",
                "&:hover": {
                  backgroundColor: "#3dd16f",
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

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: "#070D0AE5",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "#070D0AE5",
            borderBottom: "1px solid rgba(70, 235, 128, 0.2)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ color: "#46EB80" }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, color: "#46EB80", fontWeight: "bold" }}
              variant="h6"
              component="div"
            >
              Pool Sniper
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent
          sx={{
            backgroundColor: "#070D0AE5",
            flex: 1,
            overflow: "auto",
            p: 0,
          }}
        >
          <PoolSniperForm ref={formRef} />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#070D0AE5",
            borderTop: "1px solid rgba(70, 235, 128, 0.2)",
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: "#46EB80",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#46EB80",
              color: "#070D0A",
              textTransform: "none",
              fontSize: "1rem",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#3dd16f",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(70, 235, 128, 0.3)",
                color: "rgba(7, 13, 10, 0.5)",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#070D0A" }} />
            ) : (
              "Input new pool details"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
