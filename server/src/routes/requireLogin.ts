import { Request, Response, NextFunction } from 'express';
const requireLogin = (req: Request, res: Response, next: NextFunction) => {

    if(req.user) {
        next();
        
    } else {
        res.json({success: false, message: "User not logged in."})
    }
};

export default requireLogin;
