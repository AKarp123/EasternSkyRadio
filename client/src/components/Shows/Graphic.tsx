import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { Flex, Grid, Text } from "@radix-ui/themes";
import { ShowEntry } from "../../types/Shows";
import { SongEntry } from "../../types/Song";
import { StandardResponse } from "../../types/global";

const Graphic = () => {
	const { showId } = useParams<{ showId: string }>();
	const [showData, setShowData] = useState<ShowEntry | null>(null);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);

	useEffect(() => {
		axios
			.get<StandardResponse<"show", ShowEntry>>(`/api/show/${showId}`, { params: { showId } })
			.then((res) => {
				setShowData(res.data.show);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setError("Error loading show data");
			});
	}, []);

    

	if (loading || showData === null) {
		return <div>Loading...</div>;
	}

	return (
		<>
			{/* <PageBackdrop width="70%" height="90vh"> */}
			<div className="mx-auto text-center">
				<Text
					size="8"
					weight="bold"
					className="font-tiny text-center"
				>
					Show #{showId} -{" "}
					{new Date(showData.showDate).toDateString()}
				</Text>
			</div>
			<Grid columns={{ sm: "1", md: "2" }} className="max-w-[800px] mx-auto">



				{showData.songsList.map((song) => {
					return (
						<SetListItem song={song} />
					);
				})}

			</Grid>
		</>
	);
};

const SetListItem = ({ song } : {song: SongEntry}) => {
	return (
		<Flex gap="1" align="center">
			<img
				src={song.albumImageLoc}
				alt={song.title}
				style={{
					width: "75px",
					height: "75px",
					objectFit: "cover",
					padding: "8px",
					borderRadius: "20%",
				}}
			/>
			<Flex
				direction="column"
				justify="center"
				maxWidth={"calc(100% - 100px)"}
			>
			

				<Text className="font-pixel text-left" size='5'>
					{song.artist} - {song.title}
				</Text>
				<Text
					className="font-pixel text-left italic"
					size="5"

				>
					{song.album}
				</Text>
			</Flex>
		</Flex>
	);
};


export default Graphic;
