import "./App.css";
import { Route, Switch } from "react-router-dom";
import {
	createTheme,
	ThemeProvider,
	responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline, Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import ErrorContext from "./providers/ErrorContext";
import Home from "./components/Home/Home";
import ShowPage from "./components/Shows/ShowPage";
import StarParticles from "./components/StarParticles";
import SetList from "./components/Shows/SetList";
import BlogPage from "./components/Blog/BlogPage";
import Login from "./components/Admin/Login";
import { UserProvider } from "./providers/UserProvider";
import AdminPage from "./components/Admin/AdminPage";
import NewShow from "./components/Admin/NewShow";
import EditSongs from "./components/Admin/EditSongs";
import EditShows from "./components/Admin/EditShows";
import Graphic from "./components/Shows/Graphic";
import AuthRoute from "./AuthRoute";
import Stats from "./components/Stats";
import SetPlanner from "./components/Admin/SetPlanner";
import { ErrorVariant, DisplayError} from "./types/global";
import { Theme} from "@radix-ui/themes"

let darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#000000",
		},
	},
});

darkTheme = responsiveFontSizes(darkTheme);

function App() {
	const [error, setError] = useState<DisplayError | null>(null); 

	const displayError = (errorMessage: string, variant: ErrorVariant = "error") => {
		setError({ errorMessage, variant });
	};

    

	return (
		<ThemeProvider theme={darkTheme}>
			<Theme appearance="dark">
				<CssBaseline />
				{process.env.NODE_ENV === "production" && <StarParticles />}
				{/* <StarParticles /> */}
				<ErrorContext.Provider value={displayError}>
					<UserProvider>
						<div className="App">
							{error && (
								<Snackbar
									open={error !== undefined && error !== null}
									autoHideDuration={2000}
									onClose={() => setError(null)}
								>
									<Alert
										severity={error.variant}
										onClose={() => setError(null)}
									>
										{error.errorMessage}
									</Alert>
								</Snackbar>
							)}
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route exact path="/shows">
									<ShowPage />
								</Route>
								<Route exact path="/shows/:showId">
									<SetList />
								</Route>
								<Route exact path="/graphic/:showId">
									<Graphic />
								</Route>
								<Route exact path="/blog">
									<BlogPage />
								</Route>
								<Route exact path="/stats">
									<Stats />
								</Route>
								<Route exact path="/login">
									<Login />
								</Route>

								<AuthRoute
									exact
									path="/admin"
									component={AdminPage}
								/>
								<AuthRoute
									exact
									path="/admin/newShow"
									component={NewShow}
								/>
								<AuthRoute
									exact
									path="/admin/editsong"
									component={EditSongs}
								/>
								<AuthRoute
									exact
									path="/admin/editshow"
									component={EditShows}
								/>
								<AuthRoute
									exact
									path="/admin/SetPlanner" 
									component={SetPlanner}
								/>
							</Switch>

                        
						</div>
					</UserProvider>
				</ErrorContext.Provider>
			</Theme>
		</ThemeProvider>
	);
}

export default App;
