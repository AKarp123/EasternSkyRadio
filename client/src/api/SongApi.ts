import axios from "axios";
import { SongEntry } from "../types/Song";





export const updateSong = (songId: number, songData: Partial<SongEntry>) => {
	return axios.patch(`/api/song/${songId}`, { songData });
};