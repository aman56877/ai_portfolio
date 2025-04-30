exports.dashboard = (req, res) => {
    res.render("dashboard", {
        title: "Dashboard",
        message: req.session.message,
    });
}