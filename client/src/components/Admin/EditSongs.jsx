import {
    Divider,
    Grid,
    Container,
  
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongForm from "./SongForm";
import { SongSearch } from "./NewShow";

const reducer = (state, action) => {
    switch (action.type) {
        case "fill":
            return {
                ...action.payload,
            };
        case "elcroId":
            return {
                ...state,
                elcroId: action.payload,
            };
        case "artist":
            return {
                ...state,
                artist: action.payload,
            };
        case "title":
            return {
                ...state,
                title: action.payload,
            };
        case "origTitle":
            return {
                ...state,
                origTitle: action.payload,
            };
        case "album":
            return {
                ...state,
                album: action.payload,
            };
        case "origAlbum":
            return {
                ...state,
                origAlbum: action.payload,
            };
        case "albumImageLoc":
            return {
                ...state,
                albumImageLoc: action.payload,
            };
        case "addGenre":
            return {
                ...state,
                genres: [...state.genres, ...action.payload],
            };
        case "removeGenre":
            return {
                ...state,
                genres: state.genres.filter(
                    (genre) => genre !== action.payload
                ),
            };
        case "addSongReleaseLoc":
            return {
                ...state,
                songReleaseLoc: [...state.songReleaseLoc, action.payload],
            };
        case "removeSongReleaseLoc":
            return {
                ...state,
                songReleaseLoc: state.songReleaseLoc.filter(
                    (release) => release.link !== action.payload
                ),
            };
        case "specialNote":
            return {
                ...state,
                specialNote: action.payload,
            };
        case "duration":
            return {
                ...state,
                duration: action.payload,
            };
        case "submit":
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
            };
        default:
            return state;
    }
};

const EditSongs = () => {
    const [editSong, dispatch] = useReducer(reducer, {
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
    });
    const setError = useContext(ErrorContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("/api/editSong", { songData: editSong }).then((res) => {
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
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <SongForm songData={editSong}
                            dispatch={dispatch}
                            type="edit"
                            submit={handleSubmit}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SongSearch dispatch={dispatch} parent="Edit Songs" />
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

// export const SongSearch = ({ dispatch }) => {
//     const [searchResults, setSearchResults] = useState([]);
//     const setError = useContext(ErrorContext);
//     const searchDebounced = useDebouncedCallback((query) => {
//         console.log(query);
//         if (query === "") {
//             setSearchResults([]);
//             return;
//         }
//         axios
//             .get("/api/search", { params: { query } })
//             .then((res) => {
//                 if (res.data.success === false) {
//                     setError(res.data.message);

//                     return;
//                 }
//                 console.log(res.data);
//                 setSearchResults(res.data.searchResults);
//             })
//             .catch((err) => {
//                 setError(err.message);
//             });
//     }, 500);
//     return (
//         <Container>
//             <TextField
//                 label="Search"
//                 onChange={(e) => searchDebounced(e.target.value)}
//                 fullWidth
//                 sx={{ mt: 1 }}
//             />
//             <Stack spacing={1} sx={{ mt: 2 }} direction={"column"}>
//                 {searchResults.length > 0 ? (
//                     searchResults.map((song) => (
//                         <SongSearchCard
//                             song={song}
//                             dispatch={dispatch}
//                             key={song._id}
//                         />
//                     ))
//                 ) : (
//                     <Typography>No results</Typography>
//                 )}
//             </Stack>
//         </Container>
//     );
// };

// const SongSearchCard = ({ song, dispatch }) => {
//     const setError = useContext(ErrorContext);
//     return (
//         <Card
//             sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 flexDirection: "column",
//                 backgroundColor: "rgba(22, 22, 22, 0.1)",
//                 WebkitBackdropFilter: "blur(3px)",
//                 backdropFilter: "blur(3px)",
//             }}
//         >
//             <Box
//                 sx={{
//                     display: "flex",
//                     flexWrap: "nowrap",
//                 }}
//             >
//                 <CardMedia
//                     component={"img"}
//                     image={song.albumImageLoc}
//                     sx={{
//                         width: "125px",
//                         height: "125px",
//                         objectFit: "cover",
//                         padding: "8px",
//                         borderRadius: "10%",
//                     }}
//                 />

//                 <CardContent
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "start",
//                         overflow: "hidden",
//                         justifyContent: "space-between",
//                         overflowX: "auto",

//                         // paddingTop: "4px !important",
//                         // paddingBottom: "4px !important",
//                     }}
//                 >
//                     <Typography variant="h6">{song.title}</Typography>

//                     <Typography variant="body1">{song.artist}</Typography>
//                     <Typography variant="body2" sx={{ fontStyle: "italic" }}>
//                         {song.album}
//                     </Typography>
//                 </CardContent>
//             </Box>
//             <CardActions>
//                 <Button
//                     onClick={() => {
//                         delete song._id;
//                         dispatch({
//                             type: "fill",
//                             payload: song,
//                         });
//                         setError("Song filled", "success");
//                     }}
//                 >
//                     Edit
//                 </Button>
//             </CardActions>
//         </Card>
//     );
// };

export default EditSongs;
