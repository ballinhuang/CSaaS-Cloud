import Job from './Job.js'

import { execFile } from 'child_process'
import { PortManager, Lunch } from '../Cluster'
import { UserManager } from '../User'
import path from 'path'

module.exports = class JOPJob extends Job {
    constructor(username, target_cluster_name, operate) {
        super({})
        this.username = username
        this.target_cluster_name = target_cluster_name
        this.operate = operate
    }

    static onProcess(job, done) {
        const d = job.data
        let user = UserManager.getProfile(d.username)
        let target_cluster = null
        let cluster_index = null
        let result = { type: null, msg: '' }
        for (var i in user.clusters) {
            if (user.clusters[i].name === d.target_cluster_name) {
                target_cluster = user.clusters[i]
                cluster_index = i
                break
            }
        }
        if (d.operate.op === "jstat") {
            const jstat = execFile(__dirname + '/Command/jstat', [
                '-i', '127.0.0.1',
                '-p', target_cluster.port,
                '-t', 'json'
            ])
            jstat.stdout.on('data', data => Job.onOutData(data, result))
            jstat.stderr.on('data', data => Job.onErrData(data, result))
            jstat.on('exit', (code) => {
                if (code === 0) {
                    var jstatjson = JSON.parse(result.msg);
                    delete jstatjson.RECEIVER
                    delete jstatjson.REQUEST
                    delete jstatjson.SENDER
                    if (user.authority.type === 'user') {
                        if (jstatjson.hasOwnProperty('JOBID')) {

                            for (var i = 0; i < jstatjson.JOBID.length; i++) {
                                if (jstatjson.USER[i] !== target_cluster.username) {
                                    jstatjson.JOBID.splice(i, 1)
                                    jstatjson.JOBNAME.splice(i, 1)
                                    jstatjson.JOBSTAT.splice(i, 1)
                                    jstatjson.MOTHERNODE.splice(i, 1)
                                    jstatjson.RUNNODE.splice(i, 1)
                                    jstatjson.RUNNP.splice(i, 1)
                                    jstatjson.USER.splice(i, 1)
                                    i -= 1
                                }
                            }
                        }
                    }
                    done(null, jstatjson)
                } else {
                    done(`Exit with ${code}. Msg:\n${result.msg}`)
                }
            })
        }
        else if (d.operate.op === "killjob") {
            const jstat = execFile(__dirname + '/Command/killjob', [
                '-i', '127.0.0.1',
                '-p', target_cluster.port,
                d.operate.data.jobid
            ])
            done(null)
        }
        else {
            done(`Wrong operate!`)
        }

    }

    getData() {
        return {
            username: this.username,
            target_cluster_name: this.target_cluster_name,
            operate: this.operate
        }
    }
}