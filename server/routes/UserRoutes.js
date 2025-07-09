import { Router } from "express";
import UserModel from "../models/UserModel.js";

const UserRouter = Router();

UserRouter.patch("/password", requireLogin, async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.user.username });
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }
        
        user.setPassword(req.body.password, (err, user) => {
            if (err) {
                return res.json({ success: false, message: "Failed to set password." });
            } else {
                user.save();
                return res.json({ success: true, message: "Password set." });
            }
        });
    } catch (error) {
        res.json({ success: false, message: "Server error." });
    }
});



export default UserRouter;
