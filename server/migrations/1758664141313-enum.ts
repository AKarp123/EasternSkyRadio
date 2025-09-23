// Import your schemas here
import type { Connection } from 'mongoose';

export async function up (connection: Connection): Promise<void> {
	connection.db?.collection('songentries').updateMany(
		{ 'songReleaseLoc.service': 'Youtube' },
		{ $set: { 'songReleaseLoc.$[elem].service': 'YouTube' } },
		{ arrayFilters: [ { 'elem.service': 'Youtube' } ] },
	);
}

export async function down (connection: Connection): Promise<void> {
	// Write migration here
	connection.db?.collection('songentries').updateMany(
		{ 'songReleaseLoc.service': 'YouTube' },
		{ $set: { 'songReleaseLoc.$[elem].service': 'Youtube' } },
		{ arrayFilters: [ { 'elem.service': 'YouTube' } ] },
	);
}
