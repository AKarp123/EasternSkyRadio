import PageHeader from "../PageHeader";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { reducer } from "../../reducers/NewShowReducer";
import SongForm from "./SongForm";
import SongSearch from "./SongSearch";
import { NewShowActionType, NewShowState } from "../../types/pages/admin/NewShow";
import Input, { InputDefaultClasses } from "../Util/Input";
import { Flex, Separator, Text, Container, Grid, Box } from "@radix-ui/themes";
import { Tabs } from "radix-ui"

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


			<Container size="4" className="min-h-screen justify-start items-center ">
				<PageHeader title="New Show Log" />
				<Separator size='4' orientation="horizontal" className="w-full my-1"/>
				<Grid columns={{ xs: "1", sm: "2" }} gap="16px" className="w-full mb-4">
						<Input
							type="date"
							placeholder="Date"
							label="Show Date"
							value={state.showDate}
							className={InputDefaultClasses + " flex-1"}
							onChange={(e) =>
								dispatch({
									type: NewShowActionType.ShowDate,
									payload: e.target.value,
								})
							}
							/>
						<Input
							label="Show Description"
							placeholder="Description"
							value={state.showDescription}
							className={InputDefaultClasses + " flex-1"}
							onChange={(e) =>
								dispatch({
									type: NewShowActionType.ShowDescription,
									payload: e.target.value,
								})
							}
							/>
				

	
							<Tabs.Root>
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
							<Flex direction={"column"} >
								<Text size="6" className="font-pixel mb-2">Songs List:</Text>
									{state.songsList.map((song) => (
										<Text
											size="5"
											onClick={(e) => {
												e.preventDefault();
												dispatch({
													type: NewShowActionType.RemoveSong,
													payload: song,
												});
											}}
											className="font-pixel"
										>
											{song.artist} - {song.title}
										</Text>
									))}
									<button className="font-pixel cursor-pointer HoverButtonStyles rounded-md" onClick={addShow}>Add Show</button>
							</Flex>
						</Grid>
			</Container>
	);
};

export default NewShow;

