import { Router } from 'express';
import SyncModel from '../models/SyncModel.js';
import requireLogin from './requireLogin.js';


const SyncRouter = Router();


SyncRouter.get("/sync", requireLogin, async (req, res) => {


    const { type } = req.query;
    if(type === undefined || type === ""){
        res.json({success: false, message: "No type provided."});
        return;
    }
    const data = await SyncModel.findOne({ type });
    if(data === null){
        res.json({success: false, message: "No data found."});
        return;
    }
    res.json({success: true, data: data.data, lastSynced: data.lastSynced})


})

SyncRouter.post("/sync", requireLogin, async (req, res) => {

    const { type, data } = req.body;
    if(type === undefined || type === ""){
        res.json({success: false, message: "No type provided."});
        return;
    }
    if(data === undefined){
        res.json({success: false, message: "No data provided."});
        return;
    }
    const existingData = await SyncModel.findOne({type});
    let timestamp = Date.now();
    if(existingData === null){
        const newData = new SyncModel({type, data, lastSynced: timestamp});
        await newData.save();
    } else {
        existingData.data = data;
        existingData.lastSynced = timestamp;
        await existingData.save();
    }

    res.json({success: true, message: "Data synced.", timestamp})

})







export default SyncRouter;