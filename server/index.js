"use strict";

const express = require('express');
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET = "mysecret";

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.static(__dirname));
app.use(express.json());

const fs = require("fs");
const path = require("path");
const filePathUsers = path.join(__dirname, "users-data.json");

let users = [];
if (fs.existsSync(filePathUsers)) {
    const fileUsers = fs.readFileSync(filePathUsers, "utf8");
    if (fileUsers.trim() === "") {
        fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    } else {
        users = JSON.parse(fs.readFileSync(filePathUsers, "utf8")); // get users from json-file: email, password, gameData
    }
} else {
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
}


app.get('/data', auth, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).send("User not found");
    res.json(user.gameData);
});


app.post('/data', auth, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).send("User not found");

    const { history, currentMove } = req.body;
    user.gameData = {
        history, 
        currentMove
    };

    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    console.log("Game data is saved!");
    res.json(user.gameData);
});


app.post("/register", async (req, res) => {
    //const {email, password} = req.body;
    const email = req.body.email.trim();
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const user = users.find(u => u.email === email);
    console.log("Got user info! ");

    if (user) {
        return res.send("You already have an account. Try the Login button.");
    }

    const hash = await bcrypt.hash(password, 10);
    const gameData = {
            history: [Array(9).fill(null)],
            currentMove: 0
        };

        users.push({
            email, 
            password: hash, 
            gameData
        });

        fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));

        const token = jwt.sign({email}, SECRET); // after registration the user will be logged in
        res.cookie("token", token, {
            httpOnly:true
        });
        res.send("Registered and logged in");
});

app.post("/login", async (req, res) => {
    //const {email, password} = req.body;
    const email = req.body.email.trim();
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const user = users.find(u => u.email === email);

    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Wrong password!");

    const token = jwt.sign({email}, SECRET);
    res.cookie("token", token, {
        httpOnly:true
    });

    console.log(`You logged in as ${user.email}`);
    res.send("Logged in");
});

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Not logged in");
    }

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(403).send("Invalid token");
    }
}

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.send("Logged out");
});


app.get("/auth-status", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({loggedIn: false});
    }

    try {
        const user = jwt.verify(token, SECRET);
        return res.json({loggedIn: true, email: user.email});
    } catch {
        return res.json({loggedIn: false});
    }
});



app.use(express.static(path.join(__dirname, "dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

// Example of json file data:
// let users = [
//     {
//       "email": "test0@test.com",
//       "password": "$2b$10$NzVidoC0.oSoERtJIP.kae7r7YsLcC0IvjwfnbzzDJr8HZkVAfOrC",
//       "gameData": {
//                 "history": [
//                             [null,null,null,null,null,null,null,null,null],
//                             ["X",null,null,null,null,null,null,null,null],
//                             ["X","O",null,null,null,null,null,null,null]
//                         ],
//                 "currentMove": 1,
//                 }
//     },
//     {
//         "email": "test1@test.com",
//         "password": "$2b$10$NzVidoC0.oSoERtJIP.kae7r7YsLcC0IvjwfnbzzDJr8HZkVAfOrC",
//         "gameData": {
//                 "history": [
//                             [null,null,null,null,null,null,null,null,null],
//                             ["X",null,null,null,null,null,null,null,null],
//                             ["X","O",null,null,null,null,null,null,null]
//                         ],
//                 "currentMove": 1,
//                 }
//     }
//   ]