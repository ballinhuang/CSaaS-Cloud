import Job from './Job.js'
import fs from 'fs'
import path from 'path'

module.exports = class JReadschdir extends Job {
    constructor(username, dir) {
        super({})
        this.username = username
        this.dir = dir
    }
    static onProcess(job, done) {
        const d = job.data
        if (d.dir === 'Scheduler') {
            const dirpath = path.join(process.cwd(), `./Server/Home/${d.username}/Scheduler`)
            const files = fs.readdirSync(dirpath)
            done(null, files)
        }
        else
            done(`Error`)
    }

    getData() {
        return {
            username: this.username,
            dir: this.dir
        }
    }
}