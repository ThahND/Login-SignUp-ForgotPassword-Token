require('dotenv').config();
const https = require('https');
//Server generated
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'secret-key-dev-dtn',
    key: 'sid',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));
app.use(passport.initialize());
// app.use(passport.session());


const Port = process.env.PORT || 3003;
const IP = process.env.IP || '127.0.0.1';
app.listen(Port, IP, (err) => {
    if (err) {
        console.log('Start server error: -- ' + err);
    } else {
        console.log('Server is ' + IP + ':' + Port);
        console.log(`Host: http://localhost:${Port}`);
    }
});
app.use(cors({
    origin: `http://${IP}:${Port}`, //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}));


const loginRoute = require('./src/routes/login.route');
app.use('/login', loginRoute);
const logoutRoute = require('./src/routes/logout.route');
app.use('/logout', logoutRoute);
const signupRoute = require('./src/routes/signup.route');
app.use('/signup', signupRoute);
const confirmRoute = require('./src/routes/confirm.route');
app.use('/confirm', confirmRoute);
const forgotRoute = require('./src/routes/forgot.router');
app.use('/forgot', forgotRoute);
const homeRoute = require('./src/routes/home.route');
app.use('/', homeRoute);
const profileRoute = require('./src/routes/profile.route');
app.use('/profile', profileRoute);
const listRoute = require('./src/routes/list.route');
app.use('/list', listRoute);


app.all('/test', async (req, res) => {
    const serviceTokens = require('./src/services/tokens.service');
    const serviceUsers = require('./src/services/users.service');
    const createToken = require('./src/middleware/token.en-decode');
    const jwtConfig = require('./src/config/token.config');
    const modelUser = require('./src/models/users.model');
    const sequelize = require('sequelize');
    const { Op } = require('sequelize');

    let x = await serviceUsers.countActivedUsers();
    return res.json({ status: 200, message: 'OK', data: x });
});