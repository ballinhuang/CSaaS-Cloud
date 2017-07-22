import Express from 'express';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import helmet from 'helmet';
import http from 'http';

import JSON_strategy from './Passport/LocalPassport.js';
import UserManager from './UserManager.js';
require('./utils.js')();

/*
    Express setting
*/
const APP = Express();
const PORT = 8082;

const Server = http.createServer(APP);

Server.listen(PORT, function () {
  console.log(`Https server listening on port ${PORT}.`)
});

UserManager.init().then(async () => {
  const Users = UserManager.getUsers();
  JSON_strategy(Passport, Users);
});

/**
 *  Use setting
 */
APP.use(helmet());
APP.use('/build', Express.static(`${BaseDir}/Client/build`))
APP.use(Session({
  secret: 'zkldjgiqahoewgo',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
APP.use(BodyParser.json());
APP.use(BodyParser.urlencoded({ extended: true }));
APP.use(Compression());
APP.use(Passport.initialize());
APP.use(Passport.session());

/**
 * Authenticated
 */
const isLogin = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/home');
};


/**
 *  Routing set
 */
APP.get('/index', isLogin, function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/index.html`)
});

APP.get('/home', function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/home.html`)
});

APP.get('/', function (req, res) {
  res.redirect('/home')
});