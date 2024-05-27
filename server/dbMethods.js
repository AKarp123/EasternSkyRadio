const { SongEntry } = require('./models/SongEntry');
const { ShowEntry } = require('./models/ShowEntry');

module.exports.addSong = async(songData) => {


    const newSong = new SongEntry(songData);
    try {
        await newSong.save();
        return newSong;
    }
    catch(err) {
        throw new Error(err);
    }
}

module.exports.addShow = async(showData, songsList) => {
    const newShow = new ShowEntry({...showData, songsList: songsList});
    return newShow.save();
}