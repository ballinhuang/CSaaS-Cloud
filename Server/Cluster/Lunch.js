import { spawn } from 'child_process'

module.exports = class Lunch {

    static lunchserver(svr_port, sch_port, nodeslist) {
        const file = __dirname + '/server'
        const argu = `-i 127.0.0.1 -p ${svr_port} -si 127.0.0.1 -sp ${sch_port}`
        const proc = spawn(file, argu.split(' '))
        return proc
    }

    static lunchscheduler(sch_port, mode) {
        const file = __dirname + '/scheduler'
        const argu = `-i 127.0.0.1 -p ${sch_port} -mode ${mode}`
        const proc = spawn(file, argu.split(' '))
        return proc
    }

}