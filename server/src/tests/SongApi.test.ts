import { beforeAll, afterAll, describe, test, expect } from 'bun:test';
import request from 'supertest';
import { initTest } from '../init.js';
import { withUser } from './helpers/withUser.js';
import { ISongEntry } from '../types/SongEntry.js';
import { generateSearchQuery } from '../dbMethods.js';


describe('Test Create Song API', function() {
	beforeAll(async function() {
        
		await initTest();
	});
    
  
	test('create a new song', async function() {
		const agent = await withUser();
		const newSong: Omit<ISongEntry, "songId" | "searchQuery"> = {
			title: "Test Song",
			artist: "Test Artist",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",


		};
		const res = await agent.post('/api/addSong').send({ songData: newSong });
		const song = res.body.song as ISongEntry;
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(song.songId).toBe(1);
		expect(song.searchQuery).toBe(generateSearchQuery(newSong as ISongEntry));
	});

	test('create song with missing params', async() => {
		const agent = await withUser();
		const newSong: Partial<ISongEntry> = {
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};

		const res = await agent.post('/api/addSong').send({ songData: newSong });
		expect(res.body).toHaveProperty('success', false);
		expect(res.status).toBe(400);
	});

    test('genres missing', async() => {
		const agent = await withUser();
		const newSong: Omit<ISongEntry, "songId" | "genres" | "searchQuery"> = {
			artist: "Test Artist",
			title: "Test Title",
			album: "Test Album",
			duration: 180,
			albumImageLoc: "",
	
		};

		const res = await agent.post('/api/addSong').send({ songData: newSong });
		expect(res.body).toHaveProperty('success', false);
		expect(res.status).toBe(400);
	});

    test('bad elcro number', async() => {
        const agent = await withUser();
        const newSong: Omit<ISongEntry, "songId" | "searchQuery"> = {
            elcroId: "323",
            artist: "Test Artist",
            title: "Test Title",
            album: "Test Album",
            duration: 180,
            albumImageLoc: "",
            genres: ["Rock"],
        };

        const res = await agent.post('/api/addSong').send({ songData: newSong });
        expect(res.body).toHaveProperty('success', false);
        expect(res.status).toBe(400);
    })

    test("trim", async() => {
        const agent = await withUser();
        const newSong: Omit<ISongEntry, "songId" | "searchQuery"> = {
            elcroId: "323",
            artist: "Test Artist    ",
            title: "Test Title      ",
            album: "Test Album       ",
            duration: 180,
            albumImageLoc: "",
            genres: ["Rock"],
        };

        let res = await agent.post('/api/addSong').send({ songData: newSong });

        const song = res.body.song as ISongEntry;
        expect(res.body).toHaveProperty('success', true);
        expect(res.status).toBe(200);

        res = await agent.get("")

        
    })
});