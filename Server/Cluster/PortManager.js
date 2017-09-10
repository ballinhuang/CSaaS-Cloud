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
                    //const Lsch = Lunch.lunchscheduler(user.name, cluster.name,cluster.schedulerport, "FIFO")
                    const svrpid = Lunch.lunchserver(user.name, cluster.name, cluster.port, cluster.schedulerport, cluster.nodeslist)
                    this.addProcess(cluster.port, svrpid)
                }
            }
        }
        console.log(this.Ports)
    }

    addProcess(port, pid) {
        this.Ports[port] = pid
    }
}

module.exports = new PortManager();