import Job from './Job.js'

import { PortManager, Lunch } from '../Cluster'
import { UserManager } from '../User'

module.exports = class JAddCluster extends Job {
    constructor(username, newcluster) {
        super({})
        this.username = username
        this.newcluster = newcluster
    }

    static onProcess(job, done) {
        const d = job.data
        let user = UserManager.getUser(d.username)
        if (user.authority.type !== "manager") {
            done(`Error! Only manager can add cluster.`)
        }

        if (user.addcluster(d.newcluster)) {
            let svrport = PortManager.getPort()
            let schport = PortManager.getPort()
            let schpid = 0;
            while (true) {
                schpid = Lunch.lunchscheduler(d.username, d.newcluster.name, schport, d.newcluster.scheduler)
                if (parseInt(schpid) > 0) {
                    PortManager.addProcess(schport, schpid)
                    break
                }
                else {
                    schport = PortManager.getPort()
                }
            }
            let svrpid = 0

            while (true) {
                svrpid = Lunch.lunchserver(d.username, d.newcluster.name, svrport, schport, d.newcluster.nodeslist)
                if (parseInt(svrpid) > 0) {
                    PortManager.addProcess(svrport, svrpid)
                    break
                }
                else {
                    svrport = PortManager.getPort()
                }
            }

            user.startcluster(d.newcluster.name, svrport, schport)
            UserManager.updateDB(user)
            done()
        }
        else {
            done(`Error! Alerady have same cluster name.`)
        }
    }

    getData() {
        return {
            username: this.username,
            newcluster: this.newcluster
        }
    }
}