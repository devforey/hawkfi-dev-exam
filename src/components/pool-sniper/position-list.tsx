"use client";

import { Box, Typography, Button } from "@mui/material";
import { useMockPositionsStore } from "@/store/mockPositionsStore";

export const PositionList = () => {
  const positions = useMockPositionsStore((state) => state.positions);
  const clearPositions = useMockPositionsStore((state) => state.clearPositions);

  if (positions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#070D0AE5",
        borderTop: "1px solid rgba(70, 235, 128, 0.2)",
        p: 3,
        maxHeight: "40vh",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#46EB80", fontWeight: "bold" }}
        >
          Mock Positions ({positions.length})
        </Typography>
        <Button
          size="small"
          onClick={clearPositions}
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
              color: "#ff6363",
              backgroundColor: "rgba(255, 99, 99, 0.1)",
            },
          }}
        >
          Clear All
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {positions.map((position) => (
          <Box
            key={position.id}
            sx={{
              p: 2,
              border: "1px solid rgba(70, 235, 128, 0.2)",
              borderRadius: "8px",
              backgroundColor: "rgba(7, 13, 10, 0.5)",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Pool Address
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {position.poolAddress.slice(0, 8)}...
                  {position.poolAddress.slice(-8)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Position Address
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {position.positionAddress.slice(0, 8)}...
                  {position.positionAddress.slice(-8)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Price Range
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {position.minPrice.toFixed(6)} - {position.maxPrice.toFixed(6)}{" "}
                  {position.quoteToken}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Deposit
                </Typography>
                <Typography
                  sx={{
                    color: "#46EB80",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {position.depositAmount} SOL
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Number of Bins
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {position.numberOfBins}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block" }}
                >
                  Created
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.875rem",
                  }}
                >
                  {new Date(position.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
