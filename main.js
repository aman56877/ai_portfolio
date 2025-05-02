require("dotenv").config();
const express = require('express')
// const session = require("express-session");
const mongoose = require("mongoose");
const app = express()
const path = require("path");
const cors = require("cors");






app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "*", // Or a specific domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));  


const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

app.use("", require("./routes/getRoutes"));
app.use("/post/", require("./routes/postRoutes"));


// database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to the db"));


// app.use(
//     session({
//         secret: process.env.SECRET_KEY,
//         saveUninitialized: true,
//         resave: false,
//     })
// );
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// to handle the message session
// app.use((req, res, next)=>{
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// })


