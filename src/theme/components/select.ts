import { Components, Theme } from "@mui/material/styles";

const select: Components<Omit<Theme, "components">> = {
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.inputBackground,
      }),
      icon: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
};

export default select;
