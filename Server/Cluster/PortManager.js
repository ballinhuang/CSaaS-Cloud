import UserManager from '../User/UserManager.js'

import Lunch from './Lunch.js'

class PortManager {

    init() {
        this.Ports = {}
        this.initallcluster();
    }

    initallcluster() {
        const Users = UserManager.getUsers();
        for (var i in Users) {
            const user = Users[i]
            if (user.authority.type !== "manager") {
                continue
            }
            else {
                for (var j in user.clusters) {
                    const cluster = user.clusters[j]
                    const Lsch = Lunch.lunchscheduler(cluster.schedulerport, "FIFO")
                    const Lsvr = Lunch.lunchserver(cluster.port, cluster.schedulerport, cluster.nodeslist)
                    let svr_result = { type: null, msg: '' }
                    let sch_result = { type: null, msg: '' }
                    Lsch.stdout.on('data', (data) => {
                        sch_result.msg += data
                        this.addProcess(cluster.schedulerport, sch_result.msg)
                    })

                    Lsvr.stdout.on('data', (data) => {
                        svr_result.msg += data
                        this.addProcess(cluster.port, svr_result.msg)
                    })
                }
            }
        }
    }

    addProcess(port, pid) {
        this.Ports[port] = pid
        console.log(this.Ports)
    }
}

module.exports = new PortManager();