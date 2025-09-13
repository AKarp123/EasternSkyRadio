import {
	Divider,


	Paper,
	Typography,
	Tab,
	Button,


} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useEffect, useContext, useState } from "react";
import SongSearch from "./SongSearch";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongForm from "./SongForm";
import { reducer } from "../../reducers/SetPlannerReducer";
import { SetPlannerActionType, SetPlannerItem, SetPlannerAction, SetPlannerState } from "../../types/pages/admin/SetPlanner";
import { Sync } from "../../types/global";
import { Flex, Separator, Text, ScrollArea, Container, Grid, Spinner} from "@radix-ui/themes";
import { Tabs } from "radix-ui";
import Tooltip from "../Util/Tooltip";
import Dialog from "../Util/Dialog";
import Input from "../Util/Input";

const SetPlanner = () => {
	const setError = useContext(ErrorContext);
	const [state, dispatch] = useReducer(reducer, {
		songsList: [], //includes events such as mic breaks, announcements, etc. (too lazy to rename everything lol)
		tabState: 0,
		label: "",
		toggleNewSongForm: false,
		toggleDurationForm: false,
		duration: "",
		syncStatus: "",
		firstLoad: true,
	});
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		axios
			.get<Sync<SetPlannerItem[]>>("/api/sync", { params: { type: "SetPlanner" } })
			.then((res) => {
				let data = res.data;
				if (
					res.data.success === false
				) {
					setLoading(false);
					if (res.data.message) {
						setError(res.data.message);
					}

					return;
				} else {
					dispatch({ type: SetPlannerActionType.LoadSync, payload: data.data });
					const timeString = new Date(res.data.lastSynced)
						.toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "numeric",
						})
						.toLowerCase()
						.replaceAll(/\s/g, "");
					setLoading(false);
					dispatch({
						type: SetPlannerActionType.SetSyncStatus,
						payload: `Last synced at ${timeString}`,
					});
				}
			});
	}, []);

	useEffect(() => {
		if (state.firstLoad) {
			return;
		}
		dispatch({ type: SetPlannerActionType.SetSyncStatus, payload: "Syncing..." });
		axios
			.post("/api/sync", { type: "SetPlanner", data: state.songsList })
			.then((res) => {
				if (res.data.success === false) {


					dispatch({
						type: SetPlannerActionType.SetSyncStatus,
						payload: "Error syncing",
					});
				}
				const timeString = new Date(res.data.timestamp)
					.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "numeric",
					})
					.toLowerCase()
					.replaceAll(/\s/g, "");
				dispatch({
					type: SetPlannerActionType.SetSyncStatus,
					payload: `Last synced at ${timeString}`,
				});
			});
	}, [state.songsList]);

	const calculateDurationAtPoint = () => {
		let array: number[] = [];
		for (let index = 0; index < state.songsList.length; index++) {
			let duration = 0;
			if (state.songsList[index].type === "Break") {
				duration = state.songsList[index].item.duration;
			} else if (state.songsList[index].type === "Song") {
				duration = state.songsList[index].item.duration;
			}
			array[index] =
				array[index - 1] === undefined
					? duration
					: array[index - 1] + duration;
		}

		return array;
	};
	// const duration = useMemo(
	//     () => calculateDurationAtPoint(),
	//     [state.songsList]
	// );

	const duration = calculateDurationAtPoint();

	return (
		<Container size="4" className="min-h-screen flex  flex-col mx-auto max-w-[85%]">
			<PageHeader title="Set Planner" />
			<Separator size='4' orientation="horizontal" className="my-0.5 w-full"/>

				<Grid columns={{ xs: "1", lg: "2" }} gap="16px">
					<div>
						<div className="flex justify-center gap-2.5 items-center">
							<Text size="8" className="font-pixel">Set Planner</Text>
							<Text size="4" className="font-pixel text-gray-500">
								{state.syncStatus}
							</Text>
						</div>
						<Separator size='4' orientation="horizontal" className="my-0.5 w-full"/>
						<ScrollArea scrollbars="vertical" className="max-h-[70vh]">
							<Flex direction={"column"} gap="16px" className="mt-2">
								{!loading && state.songsList.map((entry, index) => (
								
									<SetPlannerCard
										entry={entry}
										state={state}
										dispatch={dispatch}
										durationAtPoint={duration[index]}
										key={index}
										index={index}
									/>
								
								))}
								{loading && <Spinner className="mx-auto my-4"/>}
							</Flex>
						</ScrollArea>

						<button
							onClick={() => {
								dispatch({
									type: SetPlannerActionType.ClearList,
								});
							}}
							className="flex font-pixel HoverButtonStyles rounded-md p-2 mt-1 cursor-pointer mx-auto"
						>
							Clear List
						</button>
						{/* {state.songsList.length > 0 && (
                            <Box
                                sx={{
                                    my: 1,
                                }}
                            >
                                <Button onClick={save}>Save</Button>
                                <Button
                                    onClick={() => dispatch({ type: "reset" })}
                                >
                                    {" "}
                                    Reset
                                </Button>
                            </Box>
                        )} */}
					</div>
					<div>

						<Tabs.Root defaultValue="Insert">
							<Tabs.List className="flex flex-row gap-2 mb-2 justify-center">
								<Tabs.Trigger
									value="Insert"
									className="HoverButtonStyles p-1 rounded-md cursor-pointer data-[state=active]:border-[1px] data-[state=inactive]:m-[1px] data-[state=active]:m-0 font-pixel"
								>
									Insert
								</Tabs.Trigger>
								<Tabs.Trigger
									value="searchSong"
									className="HoverButtonStyles p-1 rounded-md cursor-pointer data-[state=active]:border-[1px] data-[state=inactive]:m-[1px] data-[state=active]:m-0 font-pixel"
								>
									Search Songs
								</Tabs.Trigger>
							</Tabs.List>
							<Separator size='4' orientation="horizontal" className="my-0.5 w-full"/>
							<Tabs.Content value="Insert">
								{state.toggleDurationForm && (
									<DurationForm
										dispatch={dispatch}
										state={state}
									/>
								)}

								<Dialog open={state.toggleNewSongForm} close onClose={() => dispatch({ type: SetPlannerActionType.ToggleNewSongForm })} title="Add New Song">
									<SongForm
										parentDispatch={dispatch}
										type="add"

									/>
								</Dialog>
								
								<SetPlannerButtons dispatch={dispatch} />

							</Tabs.Content>
							<Tabs.Content value="searchSong">
								<SongSearch
									dispatch={dispatch}
									parent="New Show"
								/>
							</Tabs.Content>
						</Tabs.Root>
					</div>
					</Grid>
					<Grid>
				</Grid>

		</Container>

	);
};

const SetPlannerButtons = ({ dispatch } : { dispatch: React.Dispatch<SetPlannerAction> }) => {
	return (
		<Flex direction={"column"} gap="10px">
			<button 
				className="font-pixel cursor-pointer HoverButtonStyles rounded-md text-xl p-2"
				onClick={() =>
					dispatch({
						type: SetPlannerActionType.ToggleNewSongForm,
					})
				}
			>
				Add New Song
			</button>
			<button 
				className="font-pixel cursor-pointer HoverButtonStyles rounded-md text-xl p-2"
				onClick={() =>{
					dispatch({
						type: SetPlannerActionType.SetLabel,
						payload: "Mic Break",
					})
					dispatch({
						type: SetPlannerActionType.ToggleDurationForm,
					})
				}
				}
			>
				Add Mic Break
			</button>
			<button 
				className="font-pixel cursor-pointer HoverButtonStyles rounded-md text-xl p-2"
				onClick={() =>{
					dispatch({
						type: SetPlannerActionType.SetLabel,
						payload: "Announcement",
					})
					dispatch({
						type: SetPlannerActionType.ToggleDurationForm,
					})
				}
				}
			>
				Add Announcement
			</button>
		</Flex>
	);
};


type SetPlannerCardProperties = {
	entry: SetPlannerItem;
	state: SetPlannerState;
	dispatch: React.Dispatch<SetPlannerAction>;
	durationAtPoint: number;
	index: number;
};
const SetPlannerCard = ({ entry, state, dispatch, durationAtPoint, index }: SetPlannerCardProperties) => {

	if (entry.type === "Song" && entry.item.duration === 0) {
		return <SetPlannerForm dispatch={dispatch} entry={entry} index={index} />;
	}
	if (entry.type === "Break") {
		return (
			<Flex direction={"column"} className="p-2 border rounded-md">
				<div className="flex flex-row justify-between">
					<Text size="5" className="font-pixel pl-2">{entry.item.label} - {entry.item.duration}min</Text>
					<Text size="4" className="font-pixel">{durationAtPoint}min</Text>
				</div>
				<div className="flex flex-row items-center justify-between">
				<div>
					<button className="HoverButtonStyles font-pixel rounded-md p-0.5 px-2 disabled:opacity-50 not-disabled:cursor-pointer"
						onClick={() => {
							dispatch({
								type: SetPlannerActionType.SwapUp,
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
								type: SetPlannerActionType.SwapDown,
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
								type: SetPlannerActionType.RemoveSong,
								payload: index,
							})
						}
					>
						Remove
					</button>
				</div>
			</div>
			</Flex>
		);
	}
	return (
		<Flex direction={"column"} gap={"10px"} className="p-2 border rounded-md">
			<div className="flex flex-row pl-1">
				<img
					src={entry.item.albumImageLoc}
					className="w-[75px] h-[75px] min-w-[75px] min-h-[75px] rounded-md
					"
				/>
				<Flex direction={"column"} className="ml-4 justify-center gap-1 my-auto">
					<Tooltip content={entry.item.origTitle || "" }>
						<Text size="5" className="font-pixel">{entry.item.artist} - {entry.item.title} ({entry.item.duration}min)</Text>
					</Tooltip>
					<Text size="4" className="font-pixel italic">{entry.item.album}</Text>
				</Flex>
			</div>
			<div className="flex flex-row items-center justify-between">
				<div>
					<button className="HoverButtonStyles font-pixel rounded-md p-0.5 px-2 disabled:opacity-50 not-disabled:cursor-pointer"
						onClick={() => {
							dispatch({
								type: SetPlannerActionType.SwapUp,
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
								type: SetPlannerActionType.SwapDown,
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
								type: SetPlannerActionType.RemoveSong,
								payload: index,
							})
						}
					>
						Remove
					</button>
				</div>
				<div>
					<Text size="4" className="font-pixel">{durationAtPoint}min</Text>
					
				</div>
			</div>
				
		</Flex>
	);
};


type SetPlannerFormProperties = {
	dispatch: React.Dispatch<SetPlannerAction>;
	entry: SetPlannerItem;
	index: number;
}
const SetPlannerForm = ({ dispatch, entry, index }: SetPlannerFormProperties) => {
	const setError = useContext(ErrorContext);
	const [duration, setDuration] = useState("");
	const editSong = () => {
		if (entry.type !== "Song" || !entry.item.songId) {
			setError("Invalid song entry");
			return;
		}
		axios
			.patch(`/api/song/${entry.item.songId}`, { songData: { ...entry.item, duration } })
			.then((res) => {
				if (res.data.success === false) {
					setError(res.data.message);
					return;
				}
			});
		dispatch({
			type: SetPlannerActionType.EditSong,
			payload: { song: { ...entry.item, duration: Number.isNaN(Number(duration)) ? 0 : Number(duration) }, index },
		});
	};
	return (
		<form>
			<Input
				placeholder="Duration"
				value={duration}
				onChange={(e) => setDuration(e.target.value)}
			/>
			<button
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					editSong();
				}}
				className="font-pixel HoverButtonStyles rounded-md p-2 mt-1 cursor-pointer"
			>
				Set Duration
			</button>
			<button
				onClick={() =>
					dispatch({
						type: SetPlannerActionType.RemoveSong,
						payload: index,
					})
				}
				className="font-pixel HoverButtonStyles rounded-md p-2 cursor-pointer"
			>
				Cancel
			</button>
		</form>
	);
};


type DurationFormProperties = {
	state: SetPlannerState;
	dispatch: React.Dispatch<SetPlannerAction>;
}
function DurationForm({ state, dispatch }: DurationFormProperties) {
	const Buttons = () => {
		return (
			<>
				<button className="font-pixel HoverButtonStyles rounded-md p-2" onClick={() => dispatch({ type: SetPlannerActionType.ToggleDurationForm })}>Close</button>
				<button className="font-pixel HoverButtonStyles rounded-md p-2" type="submit" onClick={(e) => {
					e.preventDefault();
					dispatch({ type: SetPlannerActionType.AddBreak });
					dispatch({ type: SetPlannerActionType.ResetDurationForm });
				}}>Add</button>
			</>
		);
	}

	return (
		<Dialog open={state.toggleDurationForm} title="Set Duration" buttons={<Buttons />}>
			<Text  className="font-pixel text-2xl mb-2">Adding: {state.label}</Text>
			<form onSubmit={(e) => {
				e.preventDefault();
				dispatch({ type: SetPlannerActionType.AddBreak });
				dispatch({ type: SetPlannerActionType.ResetDurationForm });
			}}>
				<Input value={state.duration} placeholder="Duration (minutes)" onChange={(e) => dispatch({ type: SetPlannerActionType.SetDuration, payload: e.target.value })} />

			</form>
		</Dialog>
	);
}

export default SetPlanner;
