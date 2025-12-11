"use client";

import { Box, Typography } from "@mui/material";

export const PositionForm = () => {
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid rgba(70, 235, 128, 0.2)",
        borderRadius: "12px",
        backgroundColor: "rgba(7, 13, 10, 0.5)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#46EB80",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Position Form
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        Position form placeholder content
      </Typography>
    </Box>
  );
};
