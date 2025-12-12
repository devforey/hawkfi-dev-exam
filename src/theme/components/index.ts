import { Components, Theme } from "@mui/material/styles";
import button from "./button";
import input from "./input";
import select from "./select";
import menu from "./menu";

const components: Components<Omit<Theme, "components">> = {
  ...button,
  ...input,
  ...select,
  ...menu,
};

export default components;
