"use client";

import { Box, Typography, Button } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMockPositionsStore } from "@/store/mockPositionsStore";

export const PositionList = () => {
  const theme = useTheme();
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
        backgroundColor: "custom.backgroundOverlay",
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          Mock Positions ({positions.length})
        </Typography>
        <Button
          size="small"
          onClick={clearPositions}
          sx={{
            color: "custom.textTertiary",
            "&:hover": {
              color: "error.main",
              backgroundColor: alpha(theme.palette.error.main, 0.1),
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
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: "8px",
              backgroundColor: alpha(theme.palette.background.default, 0.5),
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Pool Address
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Position Address
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Price Range
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Deposit
                </Typography>
                <Typography
                  sx={{
                    color: "primary.main",
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Number of Bins
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
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
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  Created
                </Typography>
                <Typography
                  sx={{
                    color: "custom.textTertiary",
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
