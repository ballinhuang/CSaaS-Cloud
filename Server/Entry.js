import Express from 'express';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import https from 'https';
import http from 'http';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import { LocalStrategy } from './Passport';
import { UserManager } from './User';
import { PortManager } from './Cluster'


import {
  JSubjob,
  JUserMod,
  JobQueue,
  JAddCluster,
  JOPCluster,
  JReadschdir,
  JOPJob,
  JSim
} from './Process';

require('./Utils.js')();

JobQueue.register(
  JSubjob,
  JUserMod,
  JAddCluster,
  JOPCluster,
  JReadschdir,
  JOPJob,
  JSim
)


/**
 * init
 */
UserManager.init().then(async () => {
  const Users = UserManager.getUsers();
  LocalStrategy(Passport, Users);
  //PortManager.init()
});
/*
    Express setting
*/
const APP = Express();
const RTR = Express.Router()
const PORT = 8082;
const options = {
  key: fs.readFileSync(`${__dirname}/Key/TLS/private.key`),
  cert: fs.readFileSync(`${__dirname}/Key/TLS/certificate.crt`)
};

const Server = http.createServer(APP);

Server.listen(PORT, function () {
  console.log(`Https server listening on port ${PORT}.`)
})

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
  res.status(200).sendFile(`${BaseDir}/Client/Login/login.html`)
});


// API
RTR.all('*', isLogin)

RTR.route('/uses/username')
  .get((req, res) => {
    res.status(200).send({ name: req.user.name });
  })

RTR.route('/uses/user')
  .get((req, res) => {
    let user = UserManager.getProfile(req.user.name);
    res.status(200).json(user)
  })
  .patch(async (req, res) => {
    JobQueue.add(new JUserMod(req.user.name, req.body), (result) => {
      res.status(200).json(UserManager.getProfile(req.user.name))
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/subjob')
  .post((req, res) => {
    let user = UserManager.getProfile(req.user.name)
    var isowner = false
    let target_cluster = null
    for (var cluster in user.clusters) {
      if (user.clusters[cluster].name === req.body.name) {
        isowner = true
        target_cluster = user.clusters[cluster]
        break
      }
    }
    if (isowner) {
      JobQueue.add(new JSubjob(user, target_cluster, req.body), (result) => {
        res.status(200).json(result)
      }, (result) => {
        res.status(500).json({ type: 'error', msg: result })
      })
    }
    else {
      res.status(500).json({ type: 'reject', msg: "You are not the cluster's user." })
    }
  })

RTR.route('/cluster')
  .post((req, res) => {
    JobQueue.add(new JAddCluster(req.user.name, req.body), (result) => {
      res.status(200).json(UserManager.getProfile(req.user.name))
    }, (result) => {
      res.status(500).send(result)
    })
  })

//issue
RTR.route('/opcluster')
  .post((req, res) => {
    JobQueue.add(new JOPCluster(req.user.name, req.body.clustername, req.body.operate), (result) => {
      res.status(200).json(UserManager.getProfile(req.user.name))
    }, (result) => {
      res.status(500).send(result)
    })
  })
//issue
RTR.route('/opjob')
  .post((req, res) => {
    JobQueue.add(new JOPJob(req.user.name, req.body.clustername, req.body.operate), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/getschfile/:dir')
  .get((req, res) => {
    JobQueue.add(new JReadschdir(req.user.name, req.params.dir), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/sim')
  .post((req, res) => {
    JobQueue.add(new JSim(req.user.name, req.body.operate), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })
APP.use('/api', RTR)