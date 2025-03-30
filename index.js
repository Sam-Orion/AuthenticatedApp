const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const users = [];

// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

const JWT_SECRET = "HelloWorld";

function logger(req, res, next) {
    console.log(`${req.method} request came`);
    next();
}

app.post("/signup", logger, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (users.find(u => u.username === username)) {
        res.json({
            message : "You are already signed in"
        })
        return;
    }

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })
});

app.post("/signin", logger, function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);
        user.token = token;
        res.header({
            "jwt": token
        })
        res.send({
            token
        })
        console.log(users);
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }

});

function auth(req, res, next) {
    const token = req.headers.token;
    const decodeData = jwt.verify(token, JWT_SECRET);
    if (decodeData.username) {
        req.username = decodeData.username;
        next();
    } else {
        res.status(401).send({
            message: "Unauthorised"
        })
    }
}

app.get("/me", logger, auth, (req, res) => {
    // const token = req.headers.token;
    // const userDetail = jwt.verify(token, JWT_SECRET);
    const username = req.username;
    const user = users.find(user => user.username === username);
    if (user) {
        res.send({
            username: user.username,
            password: user.password
        })
    } else {
        res.status(401).send({
            message: "Unauthorised"
        })
    }
});

app.get("/profile", auth, (req, res) => {

});

app.listen(3000);