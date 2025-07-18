import { Router, Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import requireLogin from "./requireLogin.js";

const UserRouter = Router();

UserRouter.patch("/password", requireLogin,  async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({ username: req.user!.username });
        if (!user) {
            res.json({ success: false, message: "User not found." });
            return;
        }
        await user.setPassword(req.body.password);
        await user.save();
        res.json({ success: true, message: "Password set." });
    } catch (error) {
        res.json({ success: false, message: "Server error." });
    }

    return;
});



export default UserRouter;
