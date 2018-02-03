import Job from './Job.js'
import path from 'path'
import fs from 'fs'

module.exports = class JOPFile extends Job {
    constructor(username, dirname, filename, body) {
        super({})
        this.username = username
        this.dirname = dirname
        this.filename = filename
        this.body = body
    }
    static onProcess(job, done) {
        const d = job.data
        const dirpath = path.join(process.cwd(), `./Server/Home/${d.username}/Work/${d.dirname}`)
        const filepath = path.join(process.cwd(), `./Server/Home/${d.username}/Work/${d.dirname}/${d.filename}`)
        if (d.body.operate === 'save') {
            if (!fs.existsSync(dirpath, fs.constants.R_OK | fs.constants.W_OK)) {
                const dirlist = fs.readdirSync(path.join(process.cwd(), `./Server/Home/${d.username}/Work/`))
                if (dirlist.length > 10) {
                    done('Error! You can only have ten folders.')
                }
                fs.mkdirSync(dirpath);
            }
            fs.writeFileSync(filepath, d.body.data)
            done(null, 'Success')
        }
        else if (d.body.operate === 'delete') {
            fs.unlink(nodecondir, (err) => {
                if (err) {
                    throw err;
                    done('Error')
                }
                done(null, 'Success')
            });
        }
    }

    getData() {
        return {
            username: this.username,
            dirname: this.dirname,
            filename: this.filename,
            body: this.body
        }
    }
}