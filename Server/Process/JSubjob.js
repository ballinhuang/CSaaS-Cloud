import Job from './Job.js'

import { spawn } from 'child_process'

module.exports = class JSubjob extends Job {
  constructor (data) {
    super(data)
    this.ls = null
  }

  static onProcess (job, done) {
    const ls = spawn('cmd.exe',['/c', 'echo','1']);
    let result = { type: null, msg: '' }
    const killer = Job.setKiller(ls, job.data.ttl, result)
    ls.stdout.on('data', data => Job.onOutData(data, result))
    ls.stderr.on('data', data => Job.onErrData(data, result))

    ls.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0) {
        done(null, result)
      } else {
        done(`Exit with ${code}. Msg:\n${result.msg}`)
      }
    })

  }

  getData () {
    return {
        ls:this.ls,
        ttl:this.ttl
    }
  }
}