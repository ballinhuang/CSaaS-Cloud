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
                const Lsch = LunchScheduler.lunch(cluster.schedulerport, "FIFO")
                const Lsvr = LunchServer.lunch(cluster.port, cluster.schedulerport, cluster.nodeslist)
                let svr_result = { type: null, msg: '' }
                let sch_result = { type: null, msg: '' }
                Lsch.stdout.on('data', (data) => {
                    sch_result.msg += data
                    console.log(sch_result.msg)
                })

                Lsvr.stdout.on('data', (data) => {
                    svr_result.msg += data
                    console.log(svr_result.msg)
                })
            }
        }
    }
});