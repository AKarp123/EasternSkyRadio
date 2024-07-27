import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { getStorage } from "firebase-admin/storage";
import "dotenv/config"


const { credential } = admin;


const initializeAdmin = () => {
    admin.initializeApp({
        credential: credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Connected to Firebase");
};






export default initializeAdmin;