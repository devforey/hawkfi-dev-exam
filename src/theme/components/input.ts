import { Components, Theme, alpha } from "@mui/material/styles";

const input: Components<Omit<Theme, "components">> = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.divider, 0.5),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.error.main, 0.5),
        },
        "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.error.main, 0.7),
        },
        "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },
      }),
      input: ({ theme }) => ({
        color: theme.palette.text.primary,
        fontSize: "13px",
        fontWeight: 600,
        "&::placeholder": {
          color: theme.palette.text.secondary,
          opacity: 1,
        },
      }),
    },
  },
};

export default input;
