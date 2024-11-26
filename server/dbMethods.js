import SongEntry from "./models/SongEntry.js";
import ShowEntry from "./models/ShowEntry.js";
import Increment from "./models/IncrementModel.js";
import SiteData from "./models/SiteData.js";
import * as sD from "./sampleData.js";
import mongoose from "mongoose";
import User from "./models/UserModel.js";

export const addSong = async (songData) => {
    const nextSongId = await Increment.findOneAndUpdate(
        { model: "SongEntry" },
        { $inc: { counter: 1 } },
        { new: true }
    );
    const newSong = new SongEntry({ ...songData, songId: nextSongId.counter });
    try {
        const song = await newSong.save();

        return song;
    } catch (err) {
        console.log(
            "Error Adding Song: %s - %s",
            newSong.artist,
            newSong.title
        );
        await Increment.findOneAndUpdate(
            { model: "SongEntry" },
            { $inc: { counter: -1 } }
        );
        throw new Error(err, "Error adding song");
    }
    // console.log("New song added: %s - %s", newSong.artist, newSong.title);
};

export const addShow = async (showData, songsList) => {
    const nextShowId = await Increment.findOneAndUpdate(
        { model: "ShowEntry" },
        { $inc: { counter: 1 } },
        { new: true }
    );
    const newShow = new ShowEntry({
        ...showData,
        songsList: songsList,
        showId: nextShowId.counter,
    });
    try {
        await newShow.save();
    } catch (err) {
        console.log("Error Adding Show: %s", newShow.showDescription);
    }
    // console.log("New show added! id: " + newShow.showId);
};

export const findSong = async (songName) => {
    return SongEntry.findOne({ title: { $regex: songName, $options: "i" } });
};

export const initializeCounters = async () => {
    let increment = new Increment({ model: "SongEntry" });
    await increment.save();
    increment = new Increment({ model: "ShowEntry" });
    await increment.save();
    // console.log("Counters Initialized!");
};

export const addSongToShow = async (showId, songId) => {
    const show = await ShowEntry.findOne({ showId: showId });
    show.songsList.push(songId);
    return await show.save();
};

const createAdminAccount = async () => {
    const user = new User({ username: "admin" });
    User.register(user, process.env.ADMIN_PASSWORD, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User created");
        }
    });
};

export const removeMissingShows = async () => {
    try {
        // Get all shows sorted by showId
        const shows = await ShowEntry.find().sort({ showId: "asc" });

        // Update showIds to be sequential starting from 1
        for (let i = 0; i < shows.length; i++) {
            shows[i].showId = i + 1;
            await shows[i].save();
        }
        await Increment.findOneAndUpdate(
            { model: "ShowEntry" },
            { $set: { counter: shows.length } }
        );

        console.log("Show IDs updated successfully.");
    } catch (error) {
        console.error("Error updating show IDs:", error);
    }
};

export const generateStats = async () => {
    const data = {
        totalShows: 0,
        totalSongs: 0,
        uniqueSongs: 0,
        uniqueArtists: 0,
        uniqueAlbums: 0,
    };

    const shows = await ShowEntry.find();
    data.totalShows = shows.length;
    data.totalSongs = shows.reduce((acc, show) => {
        return acc + show.songsList.length;
    }, 0);

    const uniqueArtists = {};
    const uniqueAlbums = {};
    const songs = await SongEntry.find();

    songs.forEach((song) => {
        if (uniqueArtists[song.artist] === undefined) {
            uniqueArtists[song.artist] = 1;
        } else {
            uniqueArtists[song.artist]++;
        }
        if (uniqueAlbums[song.album] === undefined) {
            uniqueAlbums[song.album] = 1;
        } else {
            uniqueAlbums[song.album]++;
        }
    });
    data.uniqueArtists = Object.keys(uniqueArtists).length;
    data.uniqueAlbums = Object.keys(uniqueAlbums).length;

    data.uniqueSongs = songs.length;

    return data;
};

const resetData = async () => {
    mongoose.connection.dropDatabase();
    await new SiteData({ showDay: 2, showHour: 0, onBreak: false }).save();
    await createAdminAccount();
    await initializeCounters();
    console.log("Data reset!");
};

export const updateShowTimes = async () => {
    let shows = await ShowEntry.find();
    shows.forEach((show) => {
        let tempDate = new Date(show.showDate);
        tempDate.setHours(tempDate.getHours() + 5); // Convert to EST
        show.showDate = tempDate;
        show.save();
    });
};

const addLastPlayed = async () => {
    const allShows = await ShowEntry.find().sort({ showId: "desc"}).populate("songsList");
 
    allShows.forEach((show) => {
        show.songsList.forEach(async (song) => {
            if(song.lastPlayed === undefined) {
                song.lastPlayed = show.showDate;
                await song.save();
            }
        })

    })

    console.log("Last played added!");
}

// addLastPlayed();

export const updateLastPlayed = async (songsList, date) =>  {

    songsList.forEach(async (song) => {
        await SongEntry.findOneAndUpdate({ _id: song }, { lastPlayed: date }, { new: true });
    })
}

// addLastPlayed();


export const initializeTestData = async () => {
    // mongoose.connection.dropCollection("users")
    // createAdminAccount();
    // await resetData();
    // const song = await addSong(sD.sampleSong);
    // const song2 = await addSong(sD.sampleSong2);
    // for(let i = 0; i< 3; i++) {

    //     await addShow(sD.sampleShow);
    // }

    // const allSongs = await SongEntry.find();

    // allSongs.forEach(async (song) => {
    //     song.genres = song.genres.map((genre) => {
    //         genre.split(" ").map((word) => {
    //             return word.charAt(0).toUpperCase() + word.slice(1);
    //         }
    //         ).join(" ");
    //     })
    //     song.save();
    // });

    


    // for(let i = 0; i< 5; i++) {

    //     await addSongToShow(1, song)
    //     await addSongToShow(1, song2)
    // }

    console.log("Test data initialized!");
};
