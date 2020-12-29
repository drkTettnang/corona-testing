import { createMuiTheme } from "@material-ui/core";
import { red, grey } from "@material-ui/core/colors";

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
  });

export default theme;