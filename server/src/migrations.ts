import { Migrator } from "ts-migrate-mongoose";


export const migrator = await Migrator.connect({
	uri: process.env.MONGODB_URI || "",
	migrationsPath: process.env.MIGRATIONS_PATH || "./migrations",
	autosync: true,
	templatePath: "./migrations/template.ts",

});


export const applyMigrations = async() => {
	const migrations = await migrator.list();
	for (const migration of migrations) {
		if(migration.state === "down") {
			console.info(`Applying migration: ${migration.name}`);
			await migrator.run("up", migration.name);
		}
	}
};

export const rollbackMigrations = async() => {
	const migrations = await migrator.list();
	for (const migration of migrations) {
		if(migration.state === "up") {
			console.info(`Rolling back migration: ${migration.name}`); 
			await migrator.run("down", migration.name);
		}
	}
};

const main = async() => {
	await applyMigrations();
	// await rollbackMigrations();
	process.exit(0);
};

main();
