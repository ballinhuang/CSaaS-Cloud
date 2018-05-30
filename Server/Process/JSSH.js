import SSH from 'ssh2'
import path from 'path'
import fs from 'fs'

import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JSSH extends Job {
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


        var conn = new Client();
        conn.on('ready', function () {
            console.log('Client :: ready');
            if (d.operate === 'ls') {
                //find ~ -maxdepth 1 -type f -not -name '.*'
                conn.exec("find ~ -maxdepth 1 -type f -not -name '.*''", function (err, stream) {
                    var stdout = ''
                    if (err) {
                        //throw err;
                        console.log(err)
                        done(err)
                    }
                    stream.on('close', function (code, signal) {
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        done(null, stdout)
                    }).on('data', function (data) {
                        console.log('STDOUT: ' + data);
                        stdout += data
                    }).stderr.on('data', function (data) {
                        console.log('STDERR: ' + data);
                        stdout += data
                    });
                });
            }

            else if (d.operate === 'compile') {
                /*
                    data = {
                        compiler: "gcc",
                        argc:""
                    }
                */
                conn.exec(d.body.data.compiler + ' ' + body.data.argc, function (err, stream) {
                    var stdout = ''
                    if (err) {
                        //throw err;
                        console.log(err)
                        done(err)
                    }
                    stream.on('close', function (code, signal) {
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        done(null, stdout)
                    }).on('data', function (data) {
                        console.log('STDOUT: ' + data);
                        stdout += data
                    }).stderr.on('data', function (data) {
                        console.log('STDERR: ' + data);
                        stdout += data
                    });
                });
            }

            else if (d.operate === 'cat') {
                // check file exit first
                /*
                    data = {
                        filename: "file.c",
                    }
                */
                conn.exec('cat ' + d.body.data.filename, function (err, stream) {
                    var stdout = ''
                    if (err) {
                        //throw err;
                        console.log(err)
                        done(err)
                    }
                    stream.on('close', function (code, signal) {
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        done(null, stdout)
                    }).on('data', function (data) {
                        console.log('STDOUT: ' + data);
                        stdout += data
                    }).stderr.on('data', function (data) {
                        console.log('STDERR: ' + data);
                        stdout += data
                    });
                });
            }

            else if (d.operate === 'remove') {
                // check file exit first
                /*
                    data = {
                        filename: "file.c",
                    }
                */
                // rm file.c
                conn.exec('rm ' + d.body.data.filename, function (err, stream) {
                    var stdout = ''
                    if (err) {
                        //throw err;
                        console.log(err)
                        done(err)
                    }
                    stream.on('close', function (code, signal) {
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        done(null, stdout)
                    }).on('data', function (data) {
                        console.log('STDOUT: ' + data);
                        stdout += data
                    }).stderr.on('data', function (data) {
                        console.log('STDERR: ' + data);
                        stdout += data
                    });
                });
            }
        }).on('error', function (err) {
            done(err)
        }).connect({
            host: cluster.nodeslist[0].nodeip,
            port: cluster.nodeslist[0].nodessh,
            username: cluster.username,
            password: cluster.passwd
        })
    }

    getData() {
        return {
            operate: this.operate,
            body: this.body
        }
    }
}