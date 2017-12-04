import Job from './Job.js'

import fs from 'fs'
import { spawn } from 'child_process'
import path from 'path'

module.exports = class JSim extends Job {
    constructor(username, operate) {
        super({})
        this.username = username
        this.clustername = operate.clustername
        this.log = operate.log
        this.mode = operate.mode
        this.np = operate.np
    }

    static onProcess(job, done) {
        const d = job.data
        const commandpath = __dirname + '/Command/simulator'
        const logpath = `../Home/${d.username}/Clusters/${d.clustername}/${d.log}`
        const modepath = `../Home/${d.username}/Sim/${d.mode}`
        const sim = spawn(commandpath, [
            '-f', logpath,
            '-m', modepath,
            '-np', d.np,
            '-web'
        ], { cwd: __dirname })
        let result = { type: null, msg: '' }
        const killer = Job.setKiller(sim, job.data.ttl, result)
        sim.stdout.on('data', data => Job.onOutData(data, result))

        sim.on('exit', (code) => {
            Job.clearKiller(killer)
            if (code === 0) {
                let simdata = result.msg.split("\n")
                done(null, simdata)
            } else {
                done(`Exit with ${code}. Msg:\n${result.msg}`)
            }
        })
    }

    getData() {
        return {
            ttl: this.ttl,
            username: this.username,
            clustername: this.clustername,
            mode: this.mode,
            log: this.log,
            np: this.np
        }
    }
}