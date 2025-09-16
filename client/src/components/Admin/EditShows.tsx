
import PageHeader from "../PageHeader";
import { useReducer, useState, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongSearch from "./SongSearch";

import { reducer } from "../../reducers/EditShowsReducer";
import { ShowEntry } from "../../types/Shows";
import { StandardResponse, StandardResponseNoData } from "../../types/global";
import { Tabs } from "radix-ui";
import { Container, Flex, Separator, Text, Grid, ScrollArea } from "@radix-ui/themes";
import Input from "../Util/Input";
import SongForm from "./SongForm";

const EditShows = () => {
	const [state, dispatch] = useReducer(reducer, {
		showDate: new Date(Date.now()).toISOString().split("T")[0],
		showDescription: "",
		songsList: [], // always include song object id
	});
	const [showId, setShowId] = useState("");
	const setError = useContext(ErrorContext);

	const fillShow = useDebouncedCallback(() => {
		if (showId === "") return;
		axios
			.get<StandardResponse<"show", ShowEntry>>(`/api/show/${showId}`)
			.then((res) => {
				dispatch({ type: "fill", payload: { ...res.data.show } });
			})
			.catch((error) => {
				console.error(error);
				dispatch({ type: "clear" });
				setError("Error loading show data");
			});
	}, 500);

	const submit = () => {
		axios.patch<{ success: boolean; message: string }>(`/api/show/${showId}`, { showData: state }).then((res) => {
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


	return (
		<Container size="4" className="min-h-screen mx-auto items-center max-w-[85%]">
			<PageHeader title="Edit Show Log" />
			<Separator size='4' orientation="horizontal" className="w-full my-1"/>



			<div className="flex flex-row gap-2 mb-2 justify-start">
				<Input
									
					placeholder="Show ID"
					value={showId}
					onChange={(e) => {
						e.preventDefault();
						setShowId(e.target.value);
						fillShow();
					}}
				/>
				<button className="HoverButtonStyles p-1 px-2 rounded-md" onClick={() => submit()}>Edit</button>
				<button className="HoverButtonStyles p-1 px-2 rounded-md text-red-600" color="error" onClick={() => deleteShow()}>
					Delete Show
				</button>
			</div>
                
			<Grid columns={{ sm: "1", md: "2" }} gap="16px" className="w-full mb-4">

		
				<Input
					placeholder="Show Date"
					type="date"
					value={state.showDate.split("T")[0]}
					onChange={(e) => {
						e.preventDefault();
						dispatch({
							type: "showDate",
							payload: e.target.value,
						});
					}}
				/>

			
				<Input
					placeholder="Show Description"
					value={state.showDescription}
					onChange={(e) => {
						e.preventDefault();
						dispatch({
							type: "showDescription",
							payload: e.target.value,
						});
					}}
				/>


				<Tabs.Root defaultValue="newSong">
					<Tabs.List className="flex flex-row gap-2 mb-2 justify-center">
						<Tabs.Trigger
							value="newSong"
							className="HoverButtonStyles p-1 rounded-md cursor-pointer data-[state=active]:border-[1px] data-[state=inactive]:m-[1px] data-[state=active]:m-0 font-pixel"
						>
							New Song
						</Tabs.Trigger>
						<Tabs.Trigger
							value="searchSong"
							className="HoverButtonStyles p-1 rounded-md cursor-pointer data-[state=active]:border-[1px] data-[state=inactive]:m-[1px] data-[state=active]:m-0 font-pixel"
						>
							Search Songs
						</Tabs.Trigger>
					</Tabs.List>
					<Separator size='4' orientation="horizontal" className="w-full"/>
					<Tabs.Content value="newSong">
						<SongForm
							parentDispatch={dispatch}
							type="add"
						/>
					</Tabs.Content>
					<Tabs.Content value="searchSong">
						<SongSearch
							dispatch={dispatch}
							parent="New Show"
						/>
					</Tabs.Content>
				</Tabs.Root>

						
				<Flex direction={"column"} gap="8px">
					<Text size="6" className="font-pixel mb-2">Songs List</Text>
					<ScrollArea className="max-h-[60vh]">
						{state.songsList.map((song, index) => (
							<div key={index} className="flex flex-row justify-between">
								<Text
									size="5"
									className="font-pixel line-clamp-1 flex-1 min-w-0"
								>
									{song.artist} - {song.title}
								</Text>
								<div>
									<button className="HoverButtonStyles font-pixel rounded-md p-0.5 px-2 disabled:opacity-50 not-disabled:cursor-pointer"
										onClick={() => {
											dispatch({
												type: "swapUp",
												payload: index,
											});
										}}
										disabled={index === 0}
									>
										Up
									</button>
									<button className="HoverButtonStyles font-pixel rounded-md p-0.5 px-2 disabled:opacity-50 not-disabled:cursor-pointer"
										onClick={() => {
											dispatch({
												type: "swapDown",
												payload: index,
											});
										}}
										disabled={index === state.songsList.length - 1}
									>
										Down
									</button>
									<button className="HoverButtonStyles font-pixel rounded-md p-0.5 px-2 not-disabled:cursor-pointer"
										onClick={() =>
											dispatch({
												type: "removeSong",
												payload: index,
											})
										}
									>
										Remove
									</button>
								</div>
							</div>
						))}
					</ScrollArea>
				</Flex>
							
			</Grid>

		</Container>
	);
};




export default EditShows;
