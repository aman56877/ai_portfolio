const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");

router.get('/dashboard', DashboardController.dashboard);


router.get("/allCategories", (req, res)=>{
    res.render('allCategories');
});

router.get('/postNewBlog', (req, res)=>{
    res.render('postNewBlog');
})

router.get('/publicDashboard', (req, res)=>{
    res.render('publicDashboard');
});

router.get('/blogDetails', (req, res)=>{
    res.render('')
})




// router.get('/allCategoriesShow', CategoryController.allCategoriesShow);
// router.get('/allCategoriesShow', BlogController.blogDetails);









module.exports = router;