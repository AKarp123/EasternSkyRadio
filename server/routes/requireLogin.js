
const requireLogin = (req, res, next) => {
    
    if(!req.isAuthenticated()) {
        res.json({success: false, message: "User not logged in."})
    } else {
        next();
    }
};

export default requireLogin;
