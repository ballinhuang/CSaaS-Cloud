import Express from 'express';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import http from 'http';
import helmet from 'helmet';

import { LocalStrategy } from './Passport';
import { UserManager } from './User';

import {
  JSubjob,
  JobQueue
} from './Process';

require('./Utils.js')();

JobQueue.register(JSubjob)


/**
 * init
 */
UserManager.init().then(async () => {
  const Users = UserManager.getUsers();
  LocalStrategy(Passport, Users);
});
/*
    Express setting
*/
const APP = Express();
const RTR = Express.Router()
const PORT = 8082;

const Server = http.createServer(APP);

Server.listen(PORT, function () {
  console.log(`Https server listening on port ${PORT}.`)
});


/**
 *  Use setting
 */
APP.use(Session({
  secret: 'zkldjgiqahoewgo',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
APP.use(helmet());
APP.use(BodyParser.json());
APP.use(BodyParser.urlencoded({ extended: true }));
APP.use(Compression());
APP.use(Passport.initialize());
APP.use(Passport.session());
/**
 * Statcic binding
 */
APP.use('/build', Express.static(`${BaseDir}/Client/build`))
/**
 * Authenticated
 */
const isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/login');
  }
};


/**
 *  Routing set
 */

APP.get('/', function (req, res) {
  res.redirect('/home')
});

APP.get('/login', function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/Login/login.html`)
});

APP.get('/index', isLogin, function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/Index/index.html`)
});

APP.get('/home', function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/Home/home.html`)
});

APP.post('/login', Passport.authenticate('json'), (req, res) => {
  res.status(200).send({
    redirect: '/index'
  });
});

APP.get('/logout', isLogin, (req, res) => {
  req.logout();
  res.status(200).send({
    redirect: '/home'
  });
});


// API
RTR.all('*', isLogin)

RTR.route('/uses/username')
  .get((req, res) => {
    res.status(200).send({ name: req.user.name });
  })

RTR.route('/uses/user')
  .get((req, res) => {
    let user = UserManager.getUser(req.user.name);
    res.status(200).json(user);
  })

RTR.route('/subjob')
  .post((req, res) => {

    var isowner = false
    for (var property in req.user.clusters) {
      if (req.user.clusters[property].port === req.body.port) {
        isowner = true
        break
      }
    }
    if (isowner) {
      JobQueue.add(new JSubjob(req.body), (result) => {
        res.status(200).json(result)
      }, (result) => {
        res.status(500).json(result)
      })
    }
    else {
      res.status(500).json({ type: 'reject', msg: "You are not the cluster's owner" })
    }
  })

APP.use('/api', RTR)