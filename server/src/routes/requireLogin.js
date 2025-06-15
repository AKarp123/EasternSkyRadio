
const requireLogin = (req, res, next) => {
    
    if(req.user) {
        next();
        
    } else {
        res.json({success: false, message: "User not logged in."})
    }
};

export default requireLogin;
