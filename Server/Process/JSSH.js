import { Client } from 'ssh2'
import path from 'path'
import fs from 'fs'

import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JSSH extends Job {
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

        //const user = UserManager.getProfile(d.username)
        let cluster = d.target_cluster

        //console.log(cluster)


        var conn = new Client();
        conn.on('ready', function () {
            console.log('Client :: ready');
            if (d.operate === 'ls') {
                //find ~ -maxdepth 1 -type f -not -name '.*'
                conn.exec("find ~ -maxdepth 1 -type f -not -name '.*'", function (err, stream) {
                    var stdout = ''
                    if (err) {
                        //throw err;
                        console.log(err)
                        done(err)
                    }
                    stream.on('close', function (code, signal) {
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        var fileslist = stdout.split("\n");
                        var fileslistjson = []
                        for (var i in fileslist) {
                            if (fileslist[i].trim() === '') {
                                continue;
                            }
                            var filename = fileslist[i].substring(fileslist[i].lastIndexOf("/") + 1)
                            fileslistjson.push({
                                "filename": filename,
                                "filetype": 'file',
                                "fileurl": `/api/cluster/scp/${filename}`
                            })
                        }
                        done(null, fileslistjson)
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
                        argc:"",
                        files:""
                    }
                */
                conn.exec(d.body.data.compiler + ' ' + body.data.argc + ' ' + body.data.files, function (err, stream) {
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
            body: this.body,
            username: this.username,
            target_cluster: this.target_cluster
        }
    }
}