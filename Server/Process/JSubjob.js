import Job from './Job.js'

import fs from 'fs'
import { execFile } from 'child_process'

module.exports = class JSubjob extends Job {
  constructor(username, target_cluster, data) {
    super(data)
    this.ip = '127.0.0.1'
    this.port = target_cluster.port || null
    this.jobname = data.jobname || null
    this.nodeneed = data.nodeneed || 0
    this.npneed = data.npneed || 0
    this.script = data.script || null
    this.cluster_username = target_cluster.username || null
    this.username = username || null
  }

  static onProcess(job, done) {
    const d = job.data
    if (!fs.existsSync(__dirname + '/' + d.username, fs.constants.R_OK | fs.constants.W_OK)) {
      fs.mkdirSync(__dirname + '/' + d.username);
    }

    fs.writeFileSync(__dirname + '/' + d.username + '/' + d.jobname, d.script)

    const subjob = execFile(__dirname + '/subjob', ['-i', d.ip, '-p', d.port, '-u', d.cluster_username, __dirname + '/' + d.username + '/' + d.jobname]);
    let result = { type: null, msg: '' }
    const killer = Job.setKiller(subjob, job.data.ttl, result)
    subjob.stdout.on('data', data => Job.onOutData(data, result))
    subjob.stderr.on('data', data => Job.onErrData(data, result))

    subjob.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0) {
        done(null, result)
      } else {
        done(`Exit with ${code}. Msg:\n${result.msg}`, { msg: `Exit with ${code}. Msg:\n${result.msg}` })
      }
    })
  }

  getData() {
    return {
      ttl: this.ttl,
      ip: this.ip,
      port: this.port,
      jobname: this.jobname,
      nodeneed: this.nodeneed,
      npneed: this.npneed,
      script: this.script,
      cluster_username: this.cluster_username,
      username: this.username
    }
  }
}