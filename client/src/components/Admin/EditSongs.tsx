import { Divider, Grid, Container, Box } from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongForm from "./SongForm";
import { SongSearch } from "./NewShow";
import { SongEntry, SongEntryForm } from "../../types/Song";

const reducer = (state: SongEntry, action: { type: string; payload?: any }) => {
	switch (action.type) {
		case "fill": {
			return {
				...action.payload,
			};
		}
		case "submit": {
			return {
				songId: -1,
				elcroId: "",
				artist: "",
				title: "",
				origTitle: "",
				album: "",
				origAlbum: "",
				albumImageLoc: "",
				genres: [],
				specialNote: "",
				songReleaseLoc: [],
				duration: "",
			};
		}
		default: {
			return state;
		}
	}
};

const EditSongs = () => {
	const [editSong, dispatch] = useReducer(reducer, {
		_id: "",
		songId: -1,
		elcroId: "",
		artist: "",
		title: "",
		origTitle: "",
		album: "",
		origAlbum: "",
		albumImageLoc: "",
		genres: [],
		specialNote: "",
		songReleaseLoc: [],
		duration: 0,
	});
	const setError = useContext(ErrorContext);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, songData: SongEntryForm) => {
		e.preventDefault();

		axios.post("/api/editSong", { songData }).then((res) => {
			if (res.data.success === false) {
				setError(res.data.message);
				return;
			} 
			setError("Song edited successfully", "success");
			dispatch({ type: "submit" });
		});
	};

	return (
		<PageBackdrop>
			<PageHeader title="Edit Songs" />
			<Divider sx={{ mb: 2 }} />
			<Box
				sx={{
					flex: 1,
					overflowY: {
						sm: "auto",
						md: "hidden",
					},
				}}
			>
				<Container>
					<Grid container spacing={2}>
						<Grid item sm={12} md={6}>
							<Box
								sx={{
									flex: 1,
									height: "80%",
									overflowY: "auto",
									overflowX: "hidden",
									pr: 2,
								}}
							>
								<SongForm
									songData={editSong}
									parentDispatch={dispatch}
									type="edit"
									submit={handleSubmit}
								/>
							</Box>
						</Grid>
						<Grid item sm={12} md={6}>
							<SongSearch
								dispatch={dispatch}
								parent="Edit Song"
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</PageBackdrop>
	);
};

export default EditSongs;
