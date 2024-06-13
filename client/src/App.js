import logo from "./logo.svg";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import ShowPage from "./components/Shows/ShowPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

import ErrorContext from "./providers/ErrorContext";
import StarParticles from "./components/StarParticles";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#27282b",
        },
    },
});

function App() {
    const [error, setError] = useState(null);

    const displayError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <StarParticles />
            <ErrorContext.Provider value={displayError}>
                <div className="App">
                    {error && (
                        <Snackbar
                            open={error}
                            autoHideDuration={2000}
                            onClose={() => setError(null)}
                        >
                            <Alert
                                severity="error"
                                onClose={() => setError(null)}
                            >
                                {error}
                            </Alert>
                        </Snackbar>
                    )}
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/shows" component={ShowPage} />
                    </Switch>
                </div>
            </ErrorContext.Provider>
        </ThemeProvider>
    );
}

export default App;
