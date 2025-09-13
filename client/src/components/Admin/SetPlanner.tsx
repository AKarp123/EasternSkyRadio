import {
	Container,
	Divider,
	Grid,

	Paper,
	Typography,
	Tab,
	Button,
	Dialog,
	TextField,
	DialogTitle,
	DialogContent,
	DialogActions,

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
import { Flex, Separator, Text, ScrollArea} from "@radix-ui/themes";
import { Tabs } from "radix-ui";
import Tooltip from "../Util/Tooltip";

const SetPlanner = () => {
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


	useEffect(() => {
		axios
			.get<Sync<SetPlannerItem[]>>("/api/sync", { params: { type: "SetPlanner" } })
			.then((res) => {
				let data = res.data;
				if (
					res.data.success === false
				) {
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
		<PageBackdrop>
			<PageHeader title="Set Planner" />
			<Divider
				sx={{
					mb: 2,
				}}
			/>
			<Container
				sx={{
					height: "100%",
					overflow: { xs: "auto", lg: "hidden" },
				}}
			>
				<Grid container spacing={2} sx={{ height: { md: "100%" } }}>
					<Grid
						item
						xs={12}
						lg={8}
						sx={{
							height: { sm: "70vh", lg: "100%" },
							width: {
								xs: "100%",
							},
							display: "flex",
							flexDirection: "column",
							overflowY: "hidden",
						}}
					>
						<div className="flex justify-center gap-2.5 items-center">
							<Text size="6" className="font-pixel">Set Planner</Text>
							<Text size="4" className="font-pixel text-gray-500">
								{state.syncStatus}
							</Text>
						</div>

						<ScrollArea scrollbars="vertical">
							{state.songsList.map((entry, index) => (
								<div key={index} className="mb-1">
									<SetPlannerCard
										entry={entry}
										state={state}
										dispatch={dispatch}
										durationAtPoint={duration[index]}
										key={index}
										index={index}
									/>
								</div>
							))}
						</ScrollArea>

						<Button
							onClick={() => {
								dispatch({
									type: SetPlannerActionType.ClearList,
								});
							}}
						>
							Clear List
						</Button>
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
					</Grid>
					<Grid item xs={12} lg={4} sx={{}}>
						<Text size="6" className="font-pixel mb-2 text-center">Add</Text>
						<Tabs.Root>
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
								{state.toggleNewSongForm && (
									<Dialog
										open={state.toggleNewSongForm}
										sx={{
											overflow: "hidden",
										}}
									>
										<DialogTitle>Add New Song</DialogTitle>
										<DialogContent>
											<SongForm
												parentDispatch={dispatch}
												type="add"
											/>
										</DialogContent>
										<DialogActions>
											<Button
												onClick={() =>
													dispatch({
														type: SetPlannerActionType.ToggleNewSongForm,
													})
												}
											>
												Cancel
											</Button>
										</DialogActions>
									</Dialog>
								)}
								<SetPlannerButtons dispatch={dispatch} />

							</Tabs.Content>
							<Tabs.Content value="searchSong">
								<SongSearch
									dispatch={dispatch}
									parent="New Show"
								/>
							</Tabs.Content>
							</Tabs.Root>
						
					</Grid>
				</Grid>
			</Container>
		</PageBackdrop>
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
			<Paper sx={{}}>
				<Container
					sx={{
						display: "flex",
						backgroundColor: "rgba(65, 65, 65, 0.5)",
						borderRadius: "3px",
						alignItems: "center",
					}}
				>
					<Typography>{entry.item.label}</Typography>

					<Typography>({entry.item.duration}min)</Typography>
					<Typography
						sx={{
							// put it at the right end
							marginLeft: "auto",
						}}
					>
						{durationAtPoint.toFixed(2)}min
					</Typography>
					<Button
						onClick={() =>
							dispatch({
								type: SetPlannerActionType.RemoveSong,
								payload: index,
							})
						}
					>
						Remove
					</Button>
					<Flex direction="column">
						<Button
							onClick={() => {
								dispatch({
									type: SetPlannerActionType.SwapUp,
									payload: index,
								});
							}}
							disabled={index === 0}
						>
							Up
						</Button>
						<Button
							onClick={() => {
								dispatch({
									type: SetPlannerActionType.SwapDown,
									payload: index,
								});
							}}
							disabled={index === state.songsList.length - 1}
						>
							Down
						</Button>
					</Flex>
				</Container>
			</Paper>
		);
	}
	return (
		<Flex direction={"column"} gap={"10px"} className="p-2 border rounded-md">
			<div className="flex flex-row">
				<img
					src={entry.item.albumImageLoc}
					className="w-[75px] h-[75px] min-w-[75px] min-h-[75px] rounded-md
					"
				/>
				<Flex direction={"column"} className="ml-4 justify-center gap-1 my-auto">
					<Tooltip content={entry.item.origTitle || "" }>
						<Text size="5" className="font-pixel">{entry.item.artist} - {entry.item.title}</Text>
					</Tooltip>
					<Text size="4" className="font-pixel italic">{entry.item.album}</Text>
				</Flex>
			</div>
			<div className="flex flex-row items-center">
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
			<TextField
				label="Duration"
				value={duration}
				onChange={(e) => setDuration(e.target.value)}
				fullWidth
			/>
			<Button
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					editSong();
				}}
			>
				Set Duration
			</Button>
			<Button
				onClick={() =>
					dispatch({
						type: SetPlannerActionType.RemoveSong,
						payload: index,
					})
				}
			>
				Cancel
			</Button>
		</form>
	);
};


type DurationFormProperties = {
	state: SetPlannerState;
	dispatch: React.Dispatch<SetPlannerAction>;
}
function DurationForm({ state, dispatch }: DurationFormProperties) {
	return (
		<Dialog open={state.toggleDurationForm}>
			<DialogTitle>{state.label} Duration</DialogTitle>
			<form>
				<DialogContent>
					<TextField
						label="Duration"
						type="number"
						value={state.duration}
						onChange={(e) =>
							dispatch({
								type: SetPlannerActionType.SetDuration,
								payload: e.target.value,
							})
						}
						sx={{
							mt: 2,
							mb: 2,
							"input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
                                {
                                	webkitAppearance: "none",
                                	margin: 0,
                                },
							"input[type=number]": {
								MozAppearance: "textfield",
							},
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() =>
							dispatch({
								type: SetPlannerActionType.ToggleDurationForm,
							})
						}
					>
						Cancel
					</Button>
					<Button
						onClick={(e) => {
							e.preventDefault();
							dispatch({
								type: SetPlannerActionType.AddBreak,
							});
							dispatch({
								type: SetPlannerActionType.ResetDurationForm,
							});
						}}
						type="submit"
					>
						Add
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default SetPlanner;
