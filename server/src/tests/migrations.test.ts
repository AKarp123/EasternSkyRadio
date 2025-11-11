import { $ } from "bun";
import { describe, beforeAll,afterAll, expect, test } from "bun:test";
import { clearDatabase, connectToDatabase, db } from "../config/db.js";
import initializeApp from "../init.js";
import { Connection } from "mongoose";
import { migrator } from "../migrations.js";
import { Migrator } from "ts-migrate-mongoose";

describe.if(process.env.TEST_MIGRATIONS === "true")("Migrations", () => {
	let connection : Connection;
	let localMigrator : Migrator;


	beforeAll(async() => {
		await clearDatabase();
		await $`mongorestore --uri ${process.env.MONGODB_URI} --db easternSkyRadio_test /test_data --drop`.quiet();
		await connectToDatabase();
		await initializeApp();
		connection = db;
		localMigrator = migrator;
		await localMigrator.sync();

	});
	afterAll(async() => {
		await clearDatabase();
	});

	test("Check to make sure database is loaded", async() => {
		expect(connection).toBeDefined();
		expect(connection.readyState).toBe(1);
		expect(connection.collection("showentries")).toBeDefined();
		expect(connection.collection("songentries")).toBeDefined();
		expect(connection.collection("songentries").estimatedDocumentCount()).resolves.toBeGreaterThan(0);
		expect(connection.collection("migrations").estimatedDocumentCount()).resolves.toBeGreaterThan(0);

	});

	test("Add Search Query", async() => {
		await localMigrator.run("up", "addSearchQuery");
		expect(connection.collection("songentries").countDocuments({ searchQuery: { $exists: false } })).resolves.toBe(0);
	});

	test("Enum change", async() => {
		await localMigrator.run("up", "enum");
		expect(connection.collection("songentries").countDocuments({ "songReleaseLoc.service": "Youtube" })).resolves.toBe(0);
		expect(connection.collection("songentries").countDocuments({ "songReleaseLoc.service": "YouTube" })).resolves.toBeGreaterThan(0);
	});

	test("Update Duration", async() => {
		await localMigrator.run("up", "updateDuration");
		expect(connection.collection("songentries").countDocuments({ duration: { $gt: 60 } })).resolves.toBeGreaterThan(0);
	});



});
