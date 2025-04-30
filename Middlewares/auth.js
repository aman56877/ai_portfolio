function adminAuth(req, res, next){
    const key = req.headers.authorization;

    if(key === process.env.ADMIN_API_KEY){
        return next();
    }

    return res.status(401).json({
        message: "Forbidden",
    });
}

module.exports = adminAuth;