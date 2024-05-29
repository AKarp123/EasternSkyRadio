import  SongEntry  from './models/SongEntry.js';
import ShowEntry  from './models/ShowEntry.js';
import Increment from './models/IncrementModel.js';

const addSong = async(songData) => {


    const newSong = new SongEntry(songData);
    try {
        await newSong.save();

    }
    catch(err) {
        throw new Error(err);
    }
    console.log("New song added: %s - %s", newSong.artist, newSong.title);
}

const addShow = async(showData, songsList) => {
    const nextShowId = await Increment.findOneAndUpdate({model: "ShowEntry"}, {$inc: {counter: 1}}, {new: true});
    const newShow = new ShowEntry({...showData, songsList: songsList, showId: nextShowId.counter});
    try {
        await newShow.save();
    }
    catch(err) {
        throw new Error(err);
        
    }
    console.log("New show added! id: " + newShow.showId);
}

const findSong = async (songName) => {
    return SongEntry.findOne({title: { $regex: songName, $options: 'i' }});
}

const initializeCounters = async () => {
    let increment = new Increment({ model: "SongEntry" });
    await increment.save();
    increment = new Increment({ model: "ShowEntry" });
    await increment.save();
    console.log("Counters Initialized!");
};

const addSongToShow = async (showId, songId) => {
    const show = await ShowEntry.findOne({showId: showId});
    show.songsList.push(songId);
    return (await show.save());
}

export { addSong, initializeCounters, addShow, findSong, addSongToShow};