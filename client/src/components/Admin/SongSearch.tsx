import React, { useState, useContext, Key, useRef, useEffect} from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import ErrorContext from "../../providers/ErrorContext";
import { SongEntry } from "../../types/Song";
import { StandardResponse } from "../../types/global";
import { createContext } from "react";
import { Flex, Text } from "@radix-ui/themes";
import DisplayTooltip from "../Util/Tooltip";
import { ScrollArea, Spinner } from "@radix-ui/themes";
import Input from "../Util/Input";

type SongSearchProperties = {
	dispatch: React.Dispatch<any>;
	parent?: "New Show" | "Set Planner" | "Edit Song";
};

const DispatchContext = createContext<React.Dispatch<any>>(() => {});
const SongSearch = ({ dispatch, parent }: SongSearchProperties) => {
	parent = parent === undefined ? "New Show" : parent;
	const [searchResults, setSearchResults] = useState<SongEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState<string>("");
	const setError = useContext(ErrorContext);
	const searchDebounced = useDebouncedCallback((query) => {
		setLoading(true)
		if (query === "") {
			setSearchResults([]);
			setLoading(false)
			return;
		}
		axios
			.get<StandardResponse<"searchResults", SongEntry[]>>(
				"/api/search",
				{ params: { query } }
			)
			.then((res) => {
				if (res.data.success === false) {
					if (res.data.message) {
						setError(res.data.message);
					}
					return;
				}
				setSearchResults(res.data.searchResults);
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, 100);

	const heightMap: Record<string, string> = {
		"New Show": "50vh",
		"Set Planner": "70vh",
		"Edit Song": "60vh",
	};
	const height = heightMap[parent] || "60vh";

	return (
		<>
			<DispatchContext.Provider value={dispatch}>
				<Input
					placeholder="Search"
					value={searchText}
					onChange={(e) =>{

						setSearchText(e.target.value)
						searchDebounced(e.target.value.trim())
					}
					}
					className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none w-full"
				/>
				<ScrollArea type="scroll" scrollbars="vertical" style={{ height }} >
					<Flex className="w-full h-full flex-col gap-3 mt-1">
						{searchResults.length > 0 ? (
							searchResults.map((song) => (
								<SongSearchCard
									song={song}
									parent={parent}
									key={song._id as Key}
								/>
							))
						) : (
							loading ? <Spinner className="mx-auto"/> : <Text size="4" className="font-pixel text-center mt-4">No results</Text>
						)}
					</Flex>
				</ScrollArea>
			</DispatchContext.Provider>
		</>
	);
};

type SongSearchCardProperties = {
	song: SongEntry;
	parent: string;
};
const SongSearchCard = ({ song, parent }: SongSearchCardProperties) => {

	const titleRef = useRef<HTMLDivElement>(null);
	const albumRef = useRef<HTMLDivElement>(null);
	const [isOverflowTitle, setIsOverflowTitle] = useState(false);
	const [isOverflowAlbum, setIsOverflowAlbum] = useState(false);

	useEffect(() => {
		setIsOverflowTitle(titleRef.current ? titleRef.current.scrollHeight > titleRef.current.clientHeight+1 : false)
		setIsOverflowAlbum(albumRef.current ? albumRef.current.scrollHeight > albumRef.current.clientHeight+1 : false)
		window.addEventListener("resize", () => {
			setIsOverflowTitle(titleRef.current ? titleRef.current.scrollHeight > titleRef.current.clientHeight+1 : false)
		});
		window.addEventListener("resize", () => {
			setIsOverflowAlbum(albumRef.current ? albumRef.current.scrollHeight > albumRef.current.clientHeight+1 : false)
		});
	}, []);
	const lastPlayed = song.lastPlayed
		? new Date(song.lastPlayed)
		: new Date("Invalid Date");


	

	return (
		<Flex className="border rounded-md flex-col backdrop-blur-[3px]">
			<Flex className="flex-row flex-nowrap p-2 items-center relative">
				<img src={song.albumImageLoc} alt={`${song.title} album art`} className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] rounded-md"/>
				<Flex className="flex flex-col ml-4 overflow-hidden" style={{
					lineHeight: "0"
				}}>
					<div
						ref={titleRef}
						className="line-clamp-1 pt-1 mb-2"
					>
						<DisplayTooltip content={isOverflowTitle? `${song.artist} - ${song.title}` : null}>
							<Text size="5" className="font-pixel text-ellipsis" trim={"start"} style={{lineHeight: "1"}}>{song.artist} - {song.title} </Text>
						</DisplayTooltip>
					</div>
					<div
						ref={albumRef}
						className="line-clamp-1"
					>
						<DisplayTooltip content={isOverflowAlbum ? song.album : null}>
							<Text size="5" className="font-pixel italic" trim={"start"}>{song.album}</Text>
						</DisplayTooltip>
					</div>
						
				</Flex>
			</Flex>
			<Flex className="flex-row items-center mb-0.5 mr-2 gap-2" justify={"between"}>
				<Buttons parent={parent} song={song} />
				<Text size="3" className="font-pixel items-center ">
					Last Played:{" "}
					{Number.isNaN(lastPlayed.getTime())
						? "Never"
						: lastPlayed.toLocaleDateString()}
				</Text>
			</Flex>
		</Flex>
	);
};

type ButtonProperties = {
	parent: string;
	song: SongEntry;
};
const Buttons = ({ parent, song }: ButtonProperties) => {
	const dispatch = useContext(DispatchContext);


	const Add = () => 
		(<button
			className="text-white font-pixel text-md focus:outline-none focus:shadow-outline cursor-pointer HoverButtonStyles rounded-md px-2 "
			onClick={() => dispatch({ type: "addSong", payload: song })}
		>
			Add
		</button>)
	

	const Fill = () => (
		<button
			className="text-white font-pixel text-md focus:outline-none focus:shadow-outline cursor-pointer HoverButtonStyles rounded-md px-2 "
			onClick={() => dispatch({ type: "fill", payload: song })}
		>
			Fill
		</button>
	);


	switch (parent) {
		case "New Show": {
			return (
				<>
					<Add />
				</>
			);
		}
		case "Edit Song": {
			return (
				<Fill />
			);
		}
		case "Set Planner": {
			return (
				<Add />
			);
		}
	// No default
	}
};

export default SongSearch;
