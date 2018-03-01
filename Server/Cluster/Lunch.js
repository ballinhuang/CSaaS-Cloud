import fs from 'fs'
import { spawnSync } from 'child_process'
import path from 'path'

module.exports = class Lunch {

    static lunchserver(username, clustername, svr_port, sch_port, nodeslist) {
        const homedir = path.join(process.cwd(), `./Server/Home/${username}/Clusters/${clustername}`)
        if (!fs.existsSync(homedir, fs.constants.R_OK | fs.constants.W_OK)) {
            fs.mkdirSync(homedir);
        }

        const nodecondir = path.join(homedir, `./node.con`)
        let nodecondata = ""
        let first = true
        for (const node of nodeslist) {
            if (first) {
                first = !first
            }
            else {
                nodecondata += "\n"
            }
            nodecondata += node.nodeip + " " + node.nodeport + " " + node.nodename + " " + node.nodenp
        }
        fs.writeFileSync(nodecondir, nodecondata)

        const serverexepath = path.join(process.cwd(), `./Server/Cluster/Daemons/server`)
        const argu = `-i 127.0.0.1 -p ${svr_port} -si 127.0.0.1 -sp ${sch_port}`
        let stdout = ''
        const proc = spawnSync(serverexepath, argu.split(' '), {
            cwd: homedir,
            timeout: 60
        })
        stdout = proc.stdout.toString()

        fs.unlink(nodecondir, (err) => {
            if (err) throw err;
        });

        console.log(`Start server process at port ${svr_port}. PID = ${stdout}`)
        return stdout
    }

    static lunchscheduler(username, clustername, sch_port, mode) {
        const homedir = path.join(process.cwd(), `./Server/Home/${username}/Clusters/${clustername}`)

        if (!fs.existsSync(homedir, fs.constants.R_OK | fs.constants.W_OK)) {
            fs.mkdirSync(homedir);
        }

        const schedulerexepath = path.join(process.cwd(), `./Server/Cluster/Daemons/scheduler`)
        let argu = ''
        if (mode === "FIFO" || mode === "default")
            argu = `-i 127.0.0.1 -p ${sch_port}`
        else {
            const filepath = path.join(process.cwd(), `./Server/Home/${username}/Scheduler/${mode}`)
            argu = `-i 127.0.0.1 -p ${sch_port} -mode ${filepath}`
        }

        let stdout = ''
        const proc = spawnSync(schedulerexepath, argu.split(' '), {
            cwd: homedir,
            timeout: 60
        })
        stdout = proc.stdout.toString()

        console.log(`Start scheduler process at port ${sch_port}. PID = ${stdout}`)
        return stdout
    }

}