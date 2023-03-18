import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { createTheme } from "@material-ui/core/styles";

const palette: PaletteOptions = {
    type: "light",
    primary: {
        main: "#CDFF00",
        contrastText: "#242526",
    },
    background: {
        default: "#F4F5F6",
    },
};

const theme = createTheme({
    palette,
});

export default theme;
