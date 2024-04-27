const express = require('express');
const users = require('./backend/user.api.cjs')
const pwd = require('./backend/pwd.api.cjs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express();


const mongoDBEndpoint = 'mongodb://127.0.0.1:27017/passwdUrls'
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', users);
app.use('/api/pwd', pwd);


let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function () {
    console.log("Starting app now...")
})
