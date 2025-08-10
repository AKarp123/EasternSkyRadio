import { Migrator } from "ts-migrate-mongoose";

const migrator = await Migrator.connect({
	uri: process.env.MONGODB_URI || "",
	autosync: true,
	migrationsPath: "./migrations",
	templatePath: "./migrations/template.ts",

});


export const applyMigrations = async() => {
	const migrations = await migrator.list();
	for (const migration of migrations) {
		if(migration.state === "down") {
			console.log(`Applying migration: ${migration.name}`);
			await migrator.run("up", migration.name);
		}
	}
};

export const rollbackMigrations = async() => {
	const migrations = await migrator.list();
	for (const migration of migrations) {
		if(migration.state === "up") {
			console.log(`Rolling back migration: ${migration.name}`);
			await migrator.run("down", migration.name);
		}
	}
};