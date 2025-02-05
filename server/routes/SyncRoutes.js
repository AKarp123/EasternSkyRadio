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
    res.json({success: true, data: data.data})


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
    if(existingData === null){
        const newData = new SyncModel({type, data});
        await newData.save();
    } else {
        existingData.data = data;
        await existingData.save();
    }

    res.json({success: true, message: "Data synced.", timestamp: Date.now()})

})







export default SyncRouter;