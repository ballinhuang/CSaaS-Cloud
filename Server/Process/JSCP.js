import { Client } from 'scp2'
import path from 'path'
import fs from 'fs'

import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JSCP extends Job {
    constructor(username, operate, body, target_cluster) {
        super({})
        this.operate = operate
        this.body = body
        this.username = username
        this.target_cluster = target_cluster
        /*
            body = {
                clustername : "LAB01",
                data:{

                }
            }
        */
    }

    static onProcess(job, done) {
        const d = job.data

        var client = new Client({
            port: d.target_cluster.nodeslist[0].nodessh,
            host: d.target_cluster.nodeslist[0].nodeip,
            username: d.target_cluster.username,
            password: d.target_cluster.passwd
        });

        if (d.operate === 'write') {
            /*
                data = {
                    filename: "file.c",
                    content : "..."
                }
            */
            const buf = Buffer.from(d.body.data.content, 'utf8');
            client.write({
                destination: d.body.data.filename,
                content: buf
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
            body: this.body,
            username: this.username,
            target_cluster: this.target_cluster
        }
    }
}