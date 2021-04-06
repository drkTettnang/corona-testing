import { createMuiTheme } from "@material-ui/core";
import { red, grey } from "@material-ui/core/colors";
import shadows from "./shadows";

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: grey,
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: shadows['light'] as any,
  overrides: {
    MuiCard: {
      root: {
        boxShadow: (shadows['light'][25] as any).z16,
        borderRadius: 16,
        position: 'relative',
        zIndex: 0
      }
    },
    MuiCardHeader: {
      root: {
        padding: 24,
        paddingBottom: 0,
      }
    },
    MuiCardContent: {
      root: {
        padding: 24,
      }
    }
  }
});

export default theme;