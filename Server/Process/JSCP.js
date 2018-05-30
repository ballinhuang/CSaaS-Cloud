import SCP from 'scp2'
import path from 'path'
import fs from 'fs'

import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JSCP extends Job {
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

        const user = UserManager.getProfile(d.body.username)
        let cluster = user.clusters.filter(c => c.name === d.body.clustername);

        console.log(cluster)

        var client = new Client({
            port: cluster.nodeslist[0].nodessh,
            host: cluster.nodeslist[0].nodeip,
            username: cluster.username,
            password: cluster.passwd
        });

        if (d.operate === 'write') {
            /*
                data = {
                    filename: "file.c",
                    content : "..."
                }
            */
            client.write({
                destination: d.body.data.filename,
                content: d.body.data.content
            }, function (err) {
                if (err) {
                    console.log(err)
                    done(err)
                }
                else {
                    done(null)
                }
            })
        }
    }

    getData() {
        return {
            operate: this.operate,
            body: this.body
        }
    }
}