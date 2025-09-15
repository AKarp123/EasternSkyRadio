import PageHeader from "../PageHeader";
import { useReducer, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongForm from "./SongForm";
import SongSearch from "./SongSearch";
import { SongEntry, SongEntryForm } from "../../types/Song";
import { Container, Separator, Grid } from "@radix-ui/themes";

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
				duration: 0,
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

		axios.patch(`/api/song/${editSong.songId}`, { songData }).then((res) => {
			if (res.data.success === false) {
				setError(res.data.message);
				return;
			} 
			setError("Song edited successfully", "success");
			dispatch({ type: "submit" });
		});
	};

	return (
		<Container size="4" className="min-h-screen mx-auto items-center max-w-[85%]">
			<PageHeader title="Edit Song" />
			<Separator size='4' orientation="horizontal" className="w-full my-1"/>
			

			<Grid columns={{ xs: "1", sm: "2" }} gap="16px" className="w-full mb-4">
							
				<div>
					<SongForm
						songData={editSong}
						parentDispatch={dispatch}
						type="edit"
						submit={handleSubmit}
					/>
				</div>

				<div>
					<SongSearch
						dispatch={dispatch}
						parent="Edit Song"
					/>
				</div>

			</Grid>
				

		</Container>
	);
};

export default EditSongs;
