import fs from 'fs'
import { spawnSync } from 'child_process'
import path from 'path'

module.exports = class Lunch {

    static lunchserver(username, clustername, svr_port, sch_port, nodeslist) {
        const homedir = path.join(process.cwd(), `./Server/Home/${username}/Clusters/${clustername}`)
        console.log(homedir)

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
        console.log(nodecondata)

        fs.writeFileSync(nodecondir, nodecondata)

        const serverexepath = path.join(process.cwd(), `./Server/Cluster/server`)
        const argu = `-i 127.0.0.1 -p ${svr_port} -si 127.0.0.1 -sp ${sch_port}`
        let stdout = ''
        let status = ''
        const proc = spawnSync(serverexepath, argu.split(' '), {
            cwd: homedir,
            timeout: 600
        })
        stdout = proc.stdout.toString()
        status = proc.status
        console.log(stdout)
        console.log(status)
        return stdout
    }
    /*
        static lunchscheduler(username, clustername, sch_port, mode) {
            const file = __dirname + '/scheduler'
            const argu = `-i 127.0.0.1 -p ${sch_port} -mode ${mode}`
            const proc = spawn(file, argu.split(' '))
            return proc
        }
    */
}