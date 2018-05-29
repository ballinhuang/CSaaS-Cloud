import SSH from 'ssh2'
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
        if(d.operate === 'ls'){
            //find ~ -maxdepth 1 -type f -not -name '.*'

        }

        else if(d.operate === 'compile'){
            /*
                data = {
                    compiler: "gcc",
                    argc:""
                }
            */
        }

        else if(d.operate === 'cat'){
            // check file exit first
            /*
                data = {
                    filename: "file.c",
                }
            */
        }

        else if(d.operate === 'remove'){
            // check file exit first
            /*
                data = {
                    filename: "file.c",
                }
            */
           // rm file.c
        }
    }

    getData() {
        return {
            operate: this.operate,
            body: this.body
        }
    }
}