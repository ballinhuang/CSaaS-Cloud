import Job from './Job.js'

import fs from 'fs'
import { execFile } from 'child_process'
import path from 'path'

module.exports = class JSubjob extends Job {
  constructor(user, target_cluster, data) {
    super(data)
    this.ip = '127.0.0.1'
    this.port = target_cluster.port || null
    this.jobname = data.jobname || null
    this.nodeneed = data.nodeneed || 0
    this.npneed = data.npneed || 0
    this.script = data.script || null
    this.cluster_username = target_cluster.username || null
    this.username = user.name || null
    this.user = user
  }

  static onProcess(job, done) {
    const d = job.data
    const dirpath = path.join(process.cwd(), `./Server/Home/${d.user.authority.superior}/Users/${d.user.name}`)
    if (!fs.existsSync(dirpath, fs.constants.R_OK | fs.constants.W_OK)) {
      fs.mkdirSync(dirpath);
    }

    fs.writeFileSync(dirpath + '/' + d.jobname, d.script)

    const subjob = execFile(__dirname + '/Command/subjob', ['-i', d.ip, '-p', d.port, '-u', d.cluster_username, dirpath + '/' + d.jobname]);
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
      username: this.username,
      user: this.user
    }
  }
}