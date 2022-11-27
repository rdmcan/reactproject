import { createTheme } from "@material-ui/core/styles";

export default createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "rgba(98, 113, 189, 1)",
      main: "rgba(40, 71, 140, 1)",
      dark: "rgba(14, 32, 135, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    secondary: {
      light: "rgba(64, 255, 242, 0.83)",
      main: "rgba(47, 163, 159, 0.83)",
      dark: "rgba(22, 158, 153, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
