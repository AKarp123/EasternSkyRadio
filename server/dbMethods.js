import  SongEntry  from './models/SongEntry.js';
import ShowEntry  from './models/ShowEntry.js';
import Increment from './models/IncrementModel.js';
import SiteData from './models/SiteData.js';
import * as sD from './sampleData.js';
import mongoose from 'mongoose';
import User from './models/UserModel.js';


export const addSong = async(songData) => {

    const nextSongId = await Increment.findOneAndUpdate({model: "SongEntry"}, {$inc: {counter: 1}}, {new: true});
    const newSong = new SongEntry({...songData, songId: nextSongId.counter});
    try {
        await newSong.save();

    }
    catch(err) {
        console.log("Error Adding Song: %s - %s", newSong.artist, newSong.title);
        await Increment.findOneAndUpdate({model: "SongEntry"}, {$inc: {counter: -1}});
        throw new Error("Error adding song");
    }
    // console.log("New song added: %s - %s", newSong.artist, newSong.title);
}

export const addShow = async(showData, songsList) => {
    const nextShowId = await Increment.findOneAndUpdate({model: "ShowEntry"}, {$inc: {counter: 1}}, {new: true});
    const newShow = new ShowEntry({...showData, songsList: songsList, showId: nextShowId.counter});
    try {
        await newShow.save();
    }
    catch(err) {
        console.log("Error Adding Show: %s", newShow.showDescription)
        
    }
    // console.log("New show added! id: " + newShow.showId);
}

export const findSong = async (songName) => {
    return SongEntry.findOne({title: { $regex: songName, $options: 'i' }});
}

export const initializeCounters = async () => {
    let increment = new Increment({ model: "SongEntry" });
    await increment.save();
    increment = new Increment({ model: "ShowEntry" });
    await increment.save();
    // console.log("Counters Initialized!");
};

export const addSongToShow = async (showId, songId) => {
    const show = await ShowEntry.findOne({showId: showId});
    show.songsList.push(songId);
    return (await show.save());
}

const createAdminAccount = async() => {
    const user = new User({ username: "admin" });
    User.register(user, process.env.ADMIN_PASSWORD, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User created");
        }
    });
}

export const initializeTestData = async () => {
    mongoose.connection.dropDatabase();
    await new SiteData({showDay: 2, showHour: 0, onBreak: true}).save();
    await createAdminAccount();
    await initializeCounters();
    await addSong(sD.sampleSong);
    for(let i = 0; i< 3; i++) {
       
        await addShow(sD.sampleShow);
    }
    
    const song = await findSong("Magnolia");
    
    for(let i = 0; i< 22; i++) {

        addSongToShow(1, song)
    }
    
    console.log("Test data initialized!");

}

