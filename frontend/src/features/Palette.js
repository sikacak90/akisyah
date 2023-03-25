import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#409FFF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#11cb5f",
    },
    gray: {
      main: "#F2F2F2",
    },
    darkGray: {
      main: "#44566C",
      contrastText: "#FFFFFF",
    },
    buttonGray: {
      main: "#64707C3D",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Poppins",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
});

export default function Palette({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
