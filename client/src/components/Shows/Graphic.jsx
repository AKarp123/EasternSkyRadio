import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { AutoTextSize } from "auto-text-size";
import {
    Container,
    Grid,
    Typography,
    Divider,
    Card,
    CardMedia,
    CardContent,
    Box,
    Tooltip,
    Chip,
    Stack,
    Button,
} from "@mui/material";

const Graphic = () => {
    const { showId } = useParams();
    const [showData, setShowData] = useState(null);
    const [offset, setOffset] = useState(1);
    const [songsList, setSongsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const setError = useContext(ErrorContext);

    useEffect(() => {
        axios
            .get("/api/getShowData/", { params: { showId } })
            .then((res) => {
                setShowData(res.data.showData);
                let tempSongList = [];
                for (let i = 6 * (offset - 1); i < 6 * offset; i++) {
                    if (i < res.data.showData.songsList.length) {
                        tempSongList.push(res.data.showData.songsList[i]);
                    }
                }
                setSongsList(tempSongList);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError("Error loading show data");
            });
    }, []);

    const handleNext = () => {
        setOffset(offset + 1);
        let tempSongList = [];
        let tOffset = offset + 1;
        for (let i = 6 * (tOffset - 1); i < 6 * tOffset; i++) {
            if (i < showData.songsList.length) {
                tempSongList.push(showData.songsList[i]);
                console.log(i);
            }
        }
        setSongsList(tempSongList);
    };

    const handlePrev = () => {
        setOffset(offset - 1);
        let tempSongList = [];
        let tOffset = offset - 1;
        for (let i = 6 * (tOffset - 1); i < 6 * tOffset; i++) {
            if (i < showData.songsList.length) {
                tempSongList.push(showData.songsList[i]);
            }
        }
        setSongsList(tempSongList);
    };

    if (loading) {
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

            <Container maxWidth={"md"}
            
            
            >
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
                                    <Grid item xs={12} sm={6} key={song._id}>
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

const SetListItem = ({ song }) => {
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
                    variant="body"
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

const SetListCard = ({ song }) => {
    return (
        <Card
            sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                flexDirection: "column",
                backgroundColor: "rgba(22, 22, 22, 0.1)",
                WebkitBackdropFilter: "blur(3px)",
                backdropFilter: "blur(3px)",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                }}
            >
                <CardMedia
                    component={"img"}
                    image={song.albumImageLoc}
                    sx={{
                        width: "125px",
                        height: "125px",
                        objectFit: "cover",
                        padding: "8px",
                        borderRadius: "10%",
                    }}
                />

                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        textAlign: "left",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        overflowX: "auto",
                        // paddingBottom: "0px !important",
                        paddingTop: "12px !important",
                        paddingBottom: "12px !important",
                    }}
                >
                    <Tooltip
                        title={
                            "Original Title: " +
                            (song.origTitle === undefined ||
                            song.origTitle === ""
                                ? "N/A"
                                : song.origTitle)
                        }
                        placement="top"
                        arrow
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "DogicaPixel, Roboto",
                                fontSize:
                                    song.title.length > 24
                                        ? song.title.length > 48
                                            ? "0.7rem !important"
                                            : "0.8rem !important "
                                        : "1rem !important",
                            }}
                        >
                            {song.title}
                        </Typography>
                    </Tooltip>

                    <Typography variant="body1">{song.artist}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {song.album}
                    </Typography>
                </CardContent>
            </Box>
            <Divider variant="middle">Genres</Divider>

            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    justifyContent: "center",

                    overflowY: "hidden",
                    paddingTop: "8px !important",
                    paddingBottom: "12px !important",
                    width: "100%",
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        //center vertically
                    }}
                >
                    {song.genres.map((genre) => {
                        return (
                            <Chip
                                key={genre}
                                label={genre}
                                size="small"
                                sx={{ margin: "2px" }}
                            />
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Graphic;
