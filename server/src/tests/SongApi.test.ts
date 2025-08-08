import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import { initTest } from '../init.js';
import { withUser } from './helpers/withUser.js';
import { SongEntry } from '../types/SongEntry.js';
import { generateSearchQuery } from '../dbMethods.js';


describe('Test Create Song API', function() {
	before(async function() {
		await initTest();
	})
    
	it('create a new song', async function() {
		const agent = await withUser();
		const newSong: Omit<SongEntry, "songId"> = {
			title: "Test Song",
			artist: "Test Artist",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
			searchQuery: "",


		}
		const res = await agent.post('/api/addSong').send({ songData: newSong });
		const song = res.body.song as SongEntry;
		expect(res.status).to.equal(200);
		expect(res.body).to.have. property('success', true);
		expect(song.songId).to.equal(1);
		expect(song.searchQuery).to.equal(generateSearchQuery(newSong as SongEntry))
	})
    



})