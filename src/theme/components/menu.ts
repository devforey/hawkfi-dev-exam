import { Components, Theme, alpha } from "@mui/material/styles";

const menu: Components<Omit<Theme, "components">> = {
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
        "&.Mui-selected": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      }),
    },
  },
};

export default menu;
