import Job from './Job.js'

import fs from 'fs'
import { spawn } from 'child_process'
import path from 'path'

module.exports = class JSubjob extends Job {
    constructor(username, body) {
        super({})
        this.files = body.files
        this.modename = body.modename
    }

    static onProcess(job, done) {
        const d = job.data
        const Includepath = path.join(process.cwd(), `./Process/Src`)
        const cwdpath = path.join(process.cwd(), `./Server/Home/${d.username}/Scheduler`)
        /* compile to .o */
        let filespath = []
        for (var i in d.files) {
            filespath.push(path.join(process.cwd(), `./Server/Home/${d.username}/Work` + files[i].replace('/api/file', '')))
        }
        filespath.push(path.join(Includepath, `./Job.cpp`))
        filespath.push(path.join(Includepath, `./Node.cpp`))
        let argu = '-c -fPIC -I ${Includepath}'
        for (var filepath in filespath) {
            argu = argu + ' ' + filepath
        }
        const proc_o = spawnSync('g++', argu.split(' '), {
            cwd: cwdpath
        })
        const stdout = proc_o.stdout.toString()
        const stderr = proc_o.stderr.toString()
        if (proc_o.status !== 0) {
            done(`Exit with ${proc_o.status}. Msg:\n${stderr}`)
        }
        /* compile to .so */
        filespath = []
        const pwdfiles = cwdpath
        for (var pwdfile in d.pwdfiles) {
            if (pwdfile.search('.o') !== -1) {
                filespath.push('./' + pwdfile)
            }
        }

        let outputfilename = d.modename.replace(' ', '')
        let argu = `-shared -I ${Includepath} -o ${outputfilename}.so`
        for (var filepath in filespath) {
            argu = argu + ' ' + filepath
        }
        const proc_so = spawnSync('g++', argu.split(' '), {
            cwd: cwdpath
        })
        const stdout = proc_o.stdout.toString()
        const stderr = proc_o.stderr.toString()
        if (proc_so.status !== 0) {
            done(`Exit with ${proc_so.status}. Msg:\n${stderr}`)
        }
        /*
        for (var filepath in filespath) {
            fs.unlinkSync(path.join(cwdpath, filepath))
        }*/

        done(null, 'Success')

    }

    getData() {
        return {
            files: this.files,
            modename: this.modename
        }
    }
}