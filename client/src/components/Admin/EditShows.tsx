import {
	Divider,
	TextField,
	Container,
	Grid,
	List,
	ListItem,
	ListItemText,
	Tabs,
	Tab,
	Button,
	Stack,
	Tooltip,
	Box
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useState, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { SongSearch } from "./NewShow";
import { SongEntry } from "../../types/Song";
import { reducer } from "../../reducers/EditShowsReducer";
import { ShowEntry } from "../../types/Shows";
import { StandardResponseNoData } from "../../types/global";

const EditShows = () => {
	const [showData, dispatch] = useReducer(reducer, {
		showDate: new Date(Date.now()).toISOString().split("T")[0],
		showDescription: "",
		songsList: [], // always include song object id
	});
	const [showId, setShowId] = useState("");
	const [tab, setTab] = useState(0);
	const setError = useContext(ErrorContext);

	const fillShow = useDebouncedCallback(() => {
		if (showId === "") return;
		axios
			.get<{ showData: ShowEntry }>(`/api/show/${showId}`)
			.then((res) => {
				dispatch({ type: "fill", payload: { ...res.data.showData } });
			})
			.catch((error) => {
				console.error(error);
				dispatch({ type: "clear" });
				setError("Error loading show data");
			});
	}, 500);

	const submit = () => {
		axios.patch<{ success: boolean; message: string }>(`/api/show/${showId}`, { showData }).then((res) => {
			if (res.data.success === false) {
				setError(res.data.message);
				return;
			}
			setError("Show edited successfully", "success");
		});
	};

	const deleteShow = () => {
		axios.delete<StandardResponseNoData>(`/api/show/${showId}`).then((res) => {
			if (res.data.success === false) {
				if (res.data.message) {
					setError(res.data.message);
				}
				return;
			}
			setError("Show deleted successfully", "success");
			dispatch({ type: "clear" });
		});
	};

	const editOrder = (currentIndex: number, newIndex: number) => {
		let temporary = showData.songsList;
		let temporarySong = temporary[currentIndex];
		temporary.splice(newIndex, 0, temporarySong);
		temporary.splice(currentIndex + (currentIndex > newIndex ? 1 : 0), 1);
		dispatch({ type: "editSongsList", payload: temporary });
	};

	const removeSong = (index: number) => {
		let temporary = showData.songsList;
		temporary.splice(index, 1);
		dispatch({ type: "editSongsList", payload: temporary });
	};

	return (
		<PageBackdrop>
			<PageHeader title="Edit Show Log" />
			<Divider sx={{ mb: 2 }} />
			<Box sx={{
				flex: 1,
				overflowY: { xs: "auto", md: "hidden" },
				// Padding right in case of a scrollbar
			}}>
				<Container>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Stack direction="row" spacing={2}>
								<TextField
									label="Show ID"
									fullWidth
									value={showId}
									onChange={(e) => {
										e.preventDefault();
										setShowId(e.target.value);
										fillShow();
									}}
								/>
								<Button onClick={() => submit()}>Submit</Button>
								<Button color="error" onClick={() => deleteShow()}>
									Delete Show
								</Button>
							</Stack>
                
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Show Date"
								type="date"
								fullWidth
								value={showData.showDate.split("T")[0]}
								onChange={(e) => {
									e.preventDefault();
									dispatch({
										type: "showDate",
										payload: e.target.value,
									});
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Show Description"
								fullWidth
								value={showData.showDescription}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Tabs
								value={tab}
								onChange={(e, value) => setTab(value)}
								centered
								sx={{ mb: 2 }}
							>
								<Tab label="Add Song" />
								<Tab label="Edit Song Order" />
							</Tabs>
							{tab === 0 ? (
								<SongSearch
									dispatch={dispatch}
									parent="Edit Show"
								/>
							) : (
								<EditSongOrder editOrder={editOrder} />
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							<List
								sx={{
									width: "100%",
									overflowY: "auto",
									maxHeight: "45vh",
									border: "1.5px solid #495057",
									borderRadius: "10px",
								}}
							>
								{showData.songsList.map((song, index) => (
									<SongListItem
										song={song}
										removeSong={removeSong}
										key={index}
										index={index}
									/>
								))}
							</List>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</PageBackdrop>
	);
};

type SongListProperties = {
	song: SongEntry;
	removeSong: (index: number) => void;
	index: number;
}

const SongListItem = ({ song, removeSong, index }: SongListProperties) => (
	<Tooltip title={index + 1} placement="top">
		<ListItem key={song.songId} onClick={() => removeSong(index)}>
			<ListItemText primary={song.title} secondary={song.artist} />
		</ListItem>
	</Tooltip>
);

const EditSongOrder = ({ editOrder } : {
	editOrder: (currentIndex: number, newIndex: number) => void;
}) => {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [newIndex, setNewIndex] = useState(-1);

	return (
		<Container>
			<List>
				<ListItem>
					<ListItemText>Current Index</ListItemText>
					<TextField
						type="number"
						value={currentIndex}
						onChange={(e ) => {
							e.preventDefault();
							setCurrentIndex(Number(e.target.value));
						}}
					/>
				</ListItem>
				<ListItem>
					<ListItemText>New Index</ListItemText>
					<TextField
						type="number"
						value={newIndex}
						onChange={(e) => {
							e.preventDefault();
							setNewIndex(Number(e.target.value));
						}}
					/>
				</ListItem>
				<ListItem>
					<Button
						onClick={() => editOrder(currentIndex - 1, newIndex - 1)}
					>
						Edit Order
					</Button>
				</ListItem>
			</List>
		</Container>
	);
};
export default EditShows;
