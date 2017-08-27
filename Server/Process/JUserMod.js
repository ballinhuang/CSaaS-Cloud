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
            done(null, msg)
        } catch (err) { done(err.msg) }
    }

    getData() {
        return {
            uname: this.uname,
            operator: this.operator
        }
    }
}