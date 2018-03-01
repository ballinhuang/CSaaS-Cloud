import Job from './Job.js'

import fs from 'fs'
import { spawnSync } from 'child_process'
import path from 'path'

module.exports = class JCompile extends Job {
    constructor(username, body) {
        super({})
        this.username = username
        this.files = body.files
        this.modename = body.modename
    }

    static onProcess(job, done) {
        const d = job.data
        const Includepath = path.join(process.cwd(), `./Server/Process/Src`)
        const cwdpath = path.join(process.cwd(), `./Server/Home/${d.username}/Scheduler`)
        var srcpath = d.files[0].replace('/api/file/', '')
        srcpath = srcpath.substring(0, srcpath.indexOf('/'))
        srcpath = `./Server/Home/${d.username}/Work/` + srcpath
        srcpath = path.join(process.cwd(), srcpath)
        /* compile to .o */
        let filespath = []
        for (var i in d.files) {
            filespath.push(path.join(process.cwd(), `./Server/Home/${d.username}/Work` + d.files[i].replace('/api/file', '')))
        }
        filespath.push(path.join(Includepath, `./Job.cpp`))
        filespath.push(path.join(Includepath, `./Node.cpp`))
        let argu = `-fPIC -I ${Includepath} -I ${srcpath} -c`
        for (var i in filespath) {
            argu = argu + ' ' + filespath[i]
        }
        const proc_o = spawnSync('g++', argu.split(' '), {
            cwd: cwdpath
        })
        const proc_o_stdout = proc_o.output[1]
        const proc_o_stderr = proc_o.output[2]
        if (proc_o.status !== 0) {
            done(`Exit with ${proc_o.status}. Msg:\n${proc_o_stderr}`)
        }
        /* compile to .so */

        filespath = []
        const pwdfiles = fs.readdirSync(cwdpath)
        for (var i in pwdfiles) {
            if (pwdfiles[i].search('.o') !== -1) {
                filespath.push('./' + pwdfiles[i])
            }
        }

        let outputfilename = d.modename.replace(' ', '')
        argu = `-shared -I ${srcpath} -I ${Includepath} -o ${outputfilename}.so`
        for (var i in filespath) {
            argu = argu + ' ' + filespath[i]
        }
        const proc_so = spawnSync('g++', argu.split(' '), {
            cwd: cwdpath
        })
        const proc_so_stdout = proc_so.output[1]
        const proc_so_stderr = proc_so.output[2]
        if (proc_so.status !== 0) {
            done(`Exit with ${proc_so.status}. Msg:\n${proc_so_stderr}`)
        }

        for (var i in filespath) {
            fs.unlinkSync(path.join(cwdpath, filespath[i]))
        }

        done(null, 'Success')

    }

    getData() {
        return {
            username: this.username,
            files: this.files,
            modename: this.modename
        }
    }
}