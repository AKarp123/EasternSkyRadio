import { beforeAll, afterAll, describe, test, expect } from 'bun:test';
import request from 'supertest';
import { initTest } from '../init.js';
import { withUser } from './helpers/withUser.js';
import { SongEntry } from '../types/SongEntry.js';
import { generateSearchQuery } from '../dbMethods.js';


describe('Test Create Song API', function() {
	beforeAll(async function() {
        
		await initTest();
	});
    
  
	test('create a new song', async function() {
		const agent = await withUser();
		const newSong: Omit<SongEntry, "songId"> = {
			title: "Test Song",
			artist: "Test Artist",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
			searchQuery: "",


		};
		const res = await agent.post('/api/addSong').send({ songData: newSong });
		const song = res.body.song as SongEntry;
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(song.songId).toBe(1);
		expect(song.searchQuery).toBe(generateSearchQuery(newSong as SongEntry));
	});

	test('create song with missing params', async() => {
		const agent = await withUser();
		const newSong: Partial<SongEntry> = {
			title: "Test Song",

			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
			searchQuery: "",
		};

		const res = await agent.post('/api/addSong').send({ songData: newSong });
		expect(res.body).toHaveProperty('success', false);
		expect(res.status).toBe(400);
	});
});