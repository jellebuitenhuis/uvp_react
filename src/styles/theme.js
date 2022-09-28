import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#31a836',
        },
        secondary: {
            main: '#e9510e',
        },
        type: 'dark',
        mode: 'dark',
        background: {
            // default: '#005a9b',
        },
        text: {
            primary: '#ffffff',
            secondary: '#31a836',
        },
    },
    components: {
        MuiList: {
            styleOverrides: {
                root: {
                    backgroundColor: '#004e9b',
                    color: 'black',
                    text: 'black'
                },
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                panelWrapper: {
                    backgroundColor: '#004e9b',
                    color: 'black',
                    text: 'black'
                },
            }
        }
    }
});
