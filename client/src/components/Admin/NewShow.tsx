import {
	Tab,
	Tabs,
	Container,
	Divider,
	Grid,
	Stack,
	TextField,
	Typography,
	Button,
	Box,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { reducer } from "../../reducers/NewShowReducer";
import SongForm from "./SongForm";
import SongSearch from "./SongSearch";
import { NewShowActionType, NewShowState } from "../../types/pages/admin/NewShow";

const InitialState : NewShowState = {
	showDate: new Date(Date.now()).toISOString().split("T")[0],
	showDescription: "",
	songsList: [], // always include song object id
    
};

const NewShow = () => {
	const setError = useContext(ErrorContext);
	const [state, dispatch] = useReducer(reducer, InitialState);

	useEffect(() => {
		let showState = localStorage.getItem("showState");
		if (showState) {
			dispatch({ type: NewShowActionType.Load, payload: JSON.parse(showState) });
		}
	}, []);

	const [tab, setTab] = useState(0);

	const addShow = () => {
		axios
			.post("/api/show", { showData: state })
			.then((res) => {
				if (res.data.success === false) {
					setError(res.data.message);
					return;
				}
				setError("Show added successfully", "success");
				dispatch({ type: NewShowActionType.Reset });
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	return (
		<PageBackdrop>
			<PageHeader title="New Show Log" />
			<Divider sx={{ mb: 2 }} />
			<Box
				sx={{
					flex: 1,
					overflowY: { xs: "auto", md: "hidden" },
				}}
			>
				<Container>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<TextField
								label="Show Date"
								type="date"
								value={state.showDate}
								onChange={(e) =>
									dispatch({
										type: NewShowActionType.ShowDate,
										payload: e.target.value,
									})
								}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label="Show Description"
								value={state.showDescription}
								onChange={(e) =>
									dispatch({
										type: NewShowActionType.ShowDescription,
										payload: e.target.value,
									})
								}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Tabs
								value={tab}
								onChange={(e, value) => setTab(value)}
								centered
								sx={{ mb: 2 }}
							>
								<Tab label="New Song" />
								<Tab label="Search Song" />
							</Tabs>
							{tab === 1 ? (
								<Box
									sx={{
										flex: 1,
										height: "50vh",
										overflowY: "auto",
										overflowX: "hidden",
									}}
								>
									<SongSearch
										dispatch={dispatch}
										parent="New Show"
									/>
								</Box>
							) : (
								<Box
									sx={{
										flex: 1,
										overflowY: "auto",
										overflowX: "hidden",
										height: "50vh",
										pr: 2,
									}}
								>
									<SongForm
										type="add"
										parentDispatch={dispatch}
									/>
								</Box>
							)}
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography
								variant="h6"
								sx={{ alignItems: "center" }}
							>
                                Songs List
							</Typography>
							<Stack spacing={1}>
								{state.songsList.map((song) => (
									<Typography
										onClick={(e) => {
											e.preventDefault();
											dispatch({
												type: NewShowActionType.RemoveSong,
												payload: song,
											});
										}}
									>
										{song.artist} - {song.title}
									</Typography>
								))}
								<Button onClick={addShow}>Add Show</Button>
							</Stack>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</PageBackdrop>
	);
};

export default NewShow;


export {default as SongSearch} from "./SongSearch";