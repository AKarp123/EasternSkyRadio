import { describe, test, beforeAll, afterAll, expect } from "bun:test";
import { initTest } from "../init.js";
import withUser from "./helpers/withUser.js";
import { clearDatabase } from "../db.js";
import { ISongEntry, ISongEntrySubmission } from "../types/SongEntry.js";
import { createSong } from "./helpers/create.js";
import { generateSearchQuery } from "../dbMethods.js";



