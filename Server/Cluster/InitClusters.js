import UserManager from '../User/UserManager.js'

import LunchServer from './LunchServer.js'
import LunchScheduler from './LunchScheduler.js'

UserManager.init().then(async () => {
    const Users = UserManager.getUsers();
    for (var i in Users) {
        const user = Users[i]
        if (user.authority.type !== "manager") {
            continue
        }
        else {
            for (var j in user.clusters) {
                const cluster = user.clusters[j]
                //const Lsch = LunchScheduler.lunch(user.name, cluster.name, cluster.schedulerport, "FIFO")
                const svrpid = LunchServer.lunch(user.name, cluster.name, cluster.port, cluster.schedulerport, cluster.nodeslist)
                let svr_result = { type: null, msg: '' }

            }
        }
    }
});