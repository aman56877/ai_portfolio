function adminAuth(req, res, next){
    const key = req.headers.authorization;
    console.log(key);

    console.log(process.env.ADMIN_API_KEY);
    if(key === process.env.ADMIN_API_KEY){
        return next();
    }

    return res.status(401).json({
        message: "Forbidden",
    });
}

module.exports = adminAuth;