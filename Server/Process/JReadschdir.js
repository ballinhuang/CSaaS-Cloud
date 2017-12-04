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
        else if (d.dir === 'Clusterslist') {
            const dirpath = path.join(process.cwd(), `./Server/Home/${d.username}/Clusters`)
            const dirs = fs.readdirSync(dirpath)
            done(null, dirs)
        } else if (d.dir === 'Sim') {
            const dirpath = path.join(process.cwd(), `./Server/Home/${d.username}/Sim`)
            const files = fs.readdirSync(dirpath)
            done(null, files)
        }
        else if (d.dir[0] === 'L') {
            const dirpath = path.join(process.cwd(), `./Server/Home/${d.username}/Clusters/${d.dir.substr(1, d.dir.length)}`)
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