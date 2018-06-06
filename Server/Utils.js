import process from 'process'

module.exports = () => {

  global.BaseDir = process.cwd()
  global.HostIP = '127.0.0.1'
  global.DBPort = '6000'
}