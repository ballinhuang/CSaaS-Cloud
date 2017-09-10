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
                    const schpid = Lunch.lunchscheduler(user.name, cluster.name, cluster.schedulerport, "FIFO")
                    const svrpid = Lunch.lunchserver(user.name, cluster.name, cluster.port, cluster.schedulerport, cluster.nodeslist)
                    this.addProcess(cluster.port, svrpid)
                    this.addProcess(cluster.schedulerport, schpid)
                }
            }
        }
    }

    addProcess(port, pid) {
        this.Ports[port] = pid
    }

    // lock?
    getPort() {
        for (var i = 5001; i < 6000; i++) {
            if (this.Ports[i] === undefined) {
                this.Ports[i] = 0
                return i
            }
        }
        return 0
    }
}

module.exports = new PortManager();