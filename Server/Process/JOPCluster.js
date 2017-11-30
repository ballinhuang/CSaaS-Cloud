import Job from './Job.js'

import { execFile } from 'child_process'
import { PortManager, Lunch } from '../Cluster'
import { UserManager } from '../User'

module.exports = class JOPCluster extends Job {
    constructor(username, target_cluster_name, operate) {
        super({})
        this.username = username
        this.target_cluster_name = target_cluster_name
        this.operate = operate
    }

    static onProcess(job, done) {
        const d = job.data
        let user = UserManager.getUser(d.username)
        let target_cluster = null
        let cluster_index = null
        for (var i in user.clusters) {
            if (user.clusters[i].name === d.target_cluster_name) {
                target_cluster = user.clusters[i]
                cluster_index = i
                break
            }
        }
        if (d.operate.op === "Stop" && target_cluster.status === 'Work') {
            PortManager.killprocess(target_cluster.port)
            PortManager.killprocess(target_cluster.schedulerport)
            target_cluster.status = 'Stop'
        }
        else if (d.operate.op === "Remove") {
            if (target_cluster.status === 'Work') {
                PortManager.killprocess(target_cluster.port)
                PortManager.killprocess(target_cluster.schedulerport)
            }
            PortManager.removeport(target_cluster.port)
            PortManager.removeport(target_cluster.schedulerport)
            user.clusters.splice(i, 1)
        }
        else if (d.operate.op === "Recover" && target_cluster.status === 'Stop') {
            const schpid = Lunch.lunchscheduler(user.name, target_cluster.name, target_cluster.schedulerport, target_cluster.scheduler)
            const svrpid = Lunch.lunchserver(user.name, target_cluster.name, target_cluster.port, target_cluster.schedulerport, target_cluster.nodeslist)
            PortManager.addProcess(target_cluster.port, svrpid)
            PortManager.addProcess(target_cluster.schedulerport, schpid)
            target_cluster.status = 'Work'
        }
        else if (d.operate.op === "addnode") {
            target_cluster.nodeslist.push({
                nodename: d.operate.data.nodename,
                nodeip: d.operate.data.nodeip,
                nodeport: d.operate.data.nodeport,
                nodenp: d.operate.data.nodenp
            })
            execFile(__dirname + '/addnode', [
                '-i', '127.0.0.1',
                '-p', target_cluster.port,
                d.operate.data.nodeip,
                d.operate.data.nodeport,
                d.operate.data.nodename,
                d.operate.data.nodenp
            ])
        }
        else if (d.operate.op === "removenode") {
            for (var i in target_cluster.nodeslist) {
                if (target_cluster.nodeslist[i].nodename === d.operate.data.nodename) {
                    target_cluster.nodeslist.splice(i, 1)
                    break;
                }
            }
            execFile(__dirname + '/removenode', [
                '-i', '127.0.0.1',
                '-p', target_cluster.port,
                d.operate.data.nodename,
            ])
        }
        else if (d.operate.op === "changemode") {
            target_cluster.scheduler = d.operate.data.mode
            execFile(__dirname + '/changemod', [
                '-i', '127.0.0.1',
                '-p', target_cluster.port,
                d.operate.data.mode,
            ])
        }

        UserManager.updateDB(user)
        done()
    }

    getData() {
        return {
            username: this.username,
            target_cluster_name: this.target_cluster_name,
            operate: this.operate
        }
    }
}