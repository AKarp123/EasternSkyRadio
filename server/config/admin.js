import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import "dotenv/config"


const { credential } = admin;

const serviceAccountKey = {
    type: "service_account",
    project_id: "easternskyradio",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com",
};


const initializeAdmin = () => {
    admin.initializeApp({
        credential: credential.cert(serviceAccountKey),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Connected to Firebase");
};






export default initializeAdmin;