import Job from './Job.js'

import { execFile } from 'child_process'

module.exports = class JSubjob extends Job {
  constructor(data) {
    super(data)
    this.subjobpath = __dirname + '/subjob'
    this.ip = data.ip || '127.0.0.1'
    this.port = data.port || null
    this.jobname = data.jobname || null
    this.nodeneed = data.nodeneed || 0
    this.npneed = data.npneed || 0
  }

  static onProcess(job, done) {
    const d = job.data
    const subjob = execFile(__dirname + '/subjob', ['-i', d.ip, '-p', d.port, __dirname + '/' + d.jobname]);
    let result = { type: null, msg: '' }
    const killer = Job.setKiller(subjob, job.data.ttl, result)
    subjob.stdout.on('data', data => Job.onOutData(data, result))
    subjob.stderr.on('data', data => Job.onErrData(data, result))

    subjob.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0) {
        done(null, result)
      } else {
        done(`Exit with ${code}. Msg:\n${result.msg}`)
      }
    })

  }

  getData() {
    return {
      ls: this.ls,
      ttl: this.ttl,
      ip: this.ip,
      port: this.port,
      jobname: this.jobname,
      nodeneed: this.nodeneed,
      npneed: this.npneed
    }
  }
}