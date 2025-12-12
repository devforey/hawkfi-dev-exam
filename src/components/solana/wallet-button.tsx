"use client";

import { Button } from "@mui/material";
import { useWallet, useUnifiedWalletContext } from "@jup-ag/wallet-adapter";

export const WalletButton = () => {
  const { connected, connecting, disconnect } = useWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setShowModal(true);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        backgroundColor: "primary.main",
        color: "background.default",
        "&:hover": {
          backgroundColor: "primary.dark",
        },
        borderRadius: "12px",
        px: 4,
        py: 2,
        fontWeight: "bold",
        fontSize: "1.1rem",
      }}
    >
      {connecting
        ? "Connecting..."
        : connected
          ? "Disconnect"
          : "Connect Wallet"}
    </Button>
  );
};
