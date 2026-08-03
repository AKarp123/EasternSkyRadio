// Import your schemas here
import type { Connection } from 'mongoose';

export async function up (connection: Connection): Promise<void> {
	await connection.collection('sitedatas').updateOne({}, {
		$set: {
			announcement: null
		}
	});
}

export async function down (connection: Connection): Promise<void> {
	// Write migration here
	await connection.collection('sitedatas').updateOne({}, {
		$unset: {
			announcement: ""
		}
	});

}
