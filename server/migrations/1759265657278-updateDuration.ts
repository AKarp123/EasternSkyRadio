// Import your schemas here
import type { Connection } from 'mongoose'

export async function up (connection: Connection): Promise<void> {
  // Write migration here
  connection.db?.collection('songentries').updateMany({}, [
    {
      $set: {
        duration: { $floor: { $multiply: [ "$duration", 60 ] } }
      }
    }
  ])
}

export async function down (connection: Connection): Promise<void> {
  // Write migration here
  connection.db?.collection('songentries').updateMany({}, [
    {
      $set: {
        duration: {  $divide: [ "$duration", 60 ] }
      }
    }
  ])
}
