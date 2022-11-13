import {createTheme} from "@mui/material";
import type {} from '@mui/x-data-grid/themeAugmentation';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#31a836',
        },
        secondary: {
            main: '#e9510e',
        },
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

declare module '@mui/styles' {
    interface DefaultTheme {
        palette: {
            primary: {
                main: string;
            },
            secondary: {
                main: string;
            },
            mode: string;
            text: {
                primary: string;
                secondary: string;
            }
        }
    }

    interface ThemeOptions {
        palette: {
            primary: {
                main: string;
            },
            secondary: {
                main: string;
            },
            mode: string;
            text: {
                primary: string;
                secondary: string;
            }
        }
    }
}
