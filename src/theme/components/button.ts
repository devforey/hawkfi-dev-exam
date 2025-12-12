import { Components, Theme } from "@mui/material/styles";

const button: Components<Omit<Theme, "components">> = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
  },
};

export default button;
