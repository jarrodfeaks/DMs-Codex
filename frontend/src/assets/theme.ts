import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#1F1F1F",
            paper: "#1F1F1F"
        },
        primary: {
            main: "#B3334E"
        },
        secondary: {
            main: "#70E6CC"
        }
    }
});

export default theme;
