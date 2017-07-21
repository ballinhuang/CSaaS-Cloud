import Express from 'express'
import BodyParser from 'body-parser'
import Compression from 'compression'
import Passport from 'passport'
import Session from 'express-session'
import helmet from 'helmet'
import http from 'http'

require('./utils.js')()

/*
    Express setting
*/
const APP = Express()
const RTR = Express.Router()
const PORT = 8082

const Server = http.createServer(APP)

Server.listen(PORT, function () {
  console.log(`Https server listening on port ${PORT}.`)
})

/**
 *  Use setting
 */
APP.use(helmet())
APP.use('/build', Express.static(`${BaseDir}/Client/build`))
/**
 *  Routing set
 */
APP.get('/index', function (req, res) {
  res.status(200).sendFile(`${BaseDir}/Client/index.html`)
})


APP.get('/', function (req, res) {
  res.redirect('/index')
})