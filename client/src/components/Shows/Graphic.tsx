import { useEffect, useState, useContext, Key } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { AutoTextSize } from "auto-text-size";
import {
	Container,
	Grid,
	Typography,

	Box,

	Stack,
} from "@mui/material";
import { ShowEntry } from "../../types/Shows";
import { SongEntry } from "../../types/Song";

const Graphic = () => {
	const { showId } = useParams<{ showId: string }>();
	const [showData, setShowData] = useState<ShowEntry | null>(null);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);

	useEffect(() => {
		axios
			.get<{showData: ShowEntry}>("/api/getShowData/", { params: { showId } })
			.then((res) => {
				setShowData(res.data.showData);
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
			<Box
				maxWidth={"md"}
				//create invisible border so firefox will screenshot
				sx={{
                
					mx: "auto",
					// backdropFilter: "blur(10px)",
                
                
				}}
			>
				<Container
					maxWidth={"md"}
					sx={{
						textDecoration: "none",
						color: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						position: "relative",
					}}
				>
					<Typography
						variant="h3"
						align="center"
						sx={{
							fontFamily: "Tiny5, Roboto",
							mx: "auto",
							marginBottom: "10px",
							height: "auto",
						}}
					>
                    Show #{showId} -{" "}
						{new Date(showData.showDate).toDateString()}
					</Typography>
				</Container>

				<Container sx={{
					width: "800px"
				}}>
					<Grid container spacing={2}>
						{/* {songsList.map((song) => (
                        <Grid item xs={12} sm={6}>
                            <SetListCard song={song} key={song._id} />
                        </Grid>
                    ))} */}

						<Stack>
							{/* {showData.songsList.map((song) => (
                                <SetListItem song={song} key={song._id} />
                            ))} */}
							<Grid container spacing={0}>
								{showData.songsList.map((song) => {
									return (
										<Grid item xs={12} sm={6} key={song._id as Key}>
											<SetListItem song={song} />
										</Grid>
									);
								})}
							</Grid>
						</Stack>
					</Grid>
				</Container>
				{/* </PageBackdrop> */}
				{/* <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "10px",
                }}
            >
                <Button
                    variant="contained"
                    onClick={handlePrev}
                    disabled={offset === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={6 * offset >= showData.songsList.length}
                >
                    Next
                </Button>
            </Container> */}
			</Box>
		</>
	);
};

const SetListItem = ({ song } : {song: SongEntry}) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "start",
			}}
		>
			<Box
				sx={{
					height: "75px",
					width: "75px",
				}}
			>
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
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<Typography
					variant="h6"
					sx={{
						fontFamily: "PixelOperator, Roboto",
						// fontSize:
						//     song.title.length + song.artist.length > 43
						//         ? song.title.length + song.artist.length > 60
						//             ? "15px !important"
						//             : "20px !important"
						//         : "25px !important",
						textAlign: "left",
						// Adjust this based on testing
					}}
				>
					<AutoTextSize
						mode="box"
						minFontSizePx={15}
						maxFontSizePx={25}
					>
						{song.artist} - {song.title}
					</AutoTextSize>
				</Typography>
				<Typography
					variant="body1"
					sx={{
						fontFamily: "PixelOperator, Roboto",
						fontSize: "20px !important",
						textAlign: "left",
						fontStyle: "italic",
					}}
				>
					<AutoTextSize
						mode="box"
						minFontSizePx={5}
						maxFontSizePx={25}
					>
						{song.album}
					</AutoTextSize>
				</Typography>
			</Box>
		</Box>
	);
};


export default Graphic;
