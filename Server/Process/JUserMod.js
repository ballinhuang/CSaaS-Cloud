import Job from './Job.js'
import UserManager from '../User/UserManager'

module.exports = class JUserMod extends Job {
    constructor(uname, operator) {
        super({})
        this.uname = uname || null
        this.operator = operator || null
    }
    static async onProcess(job, done) {
        const d = job.data
        try {
            const msg = await UserManager.modUser(d.uname, d.operator)
            if (msg.msg === "success") {
                done(null, msg)
            } else {
                done(msg.msg)
            }

        } catch (err) { done(err.msg) }
    }

    getData() {
        return {
            uname: this.uname,
            operator: this.operator
        }
    }
}