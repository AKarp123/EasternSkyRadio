# Eastern Sky Radio

[Live Site](https://easternskyradio.onrender.com)

This repository contains the source code for the Eastern Sky radio website, my radio show hosted on 90.3 The Core!

> Can I copy this for my own show? 

Yes! Feel free to copy/clone whatever but I would appreciate if you linked back to this and gave credit :)

>How do I run it myself?

Before running set up a Mongodb instance either locally or on Atlas, and have a firebase project configured with storage before starting :)
 1. Clone the repository 
 2. run `npm install` in the root directory
 3. `cd server` and create a new `.env` file with these three fields `MONGODB_URI=
ADMIN_PASSWORD= FIREBASE_STORAGE_BUCKET=` Make sure you have mongodb installed or have an instance you can use. 
4. `cd .. && cd client` make another `.env` file with 2 field `PORT=3001
HTTPS=true`
5. run `cd .. && npm run dev` to start the react app and server! go to /admin on the react website and login to start adding show logs!

