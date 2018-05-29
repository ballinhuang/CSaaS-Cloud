import SCP from 'scp2'
import path from 'path'
import fs from 'fs'

import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JAddCluster extends Job {
    constructor(operate, body) {
        super({})
        this.operate = operate
        this.body = body
        /*
            body = {
                usernane:"user",
                clustername : "LAB01",
                data:{

                }
            }
        */
    }

    static onProcess(job, done) {
        const d = job.data
        if(d.operate === 'write'){
            /*
                data = {
                    filename: "file.c",
                    content : "..."
                }
            */
            /*
                client.write({
                    destination: '/home/admin/data/file.c',
                    content: 'hello world'
                }, callback)
            */
        }
    }

    getData() {
        return {
            operate: this.operate,
            body: this.body
        }
    }
}