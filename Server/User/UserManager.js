import assert from 'assert';
import MongoController from '../MongoController.js';
import User from './User.js';
import fs from 'fs'
import path from 'path'

import lodash from 'lodash'

class UserManager {

    constructor() { }

    async init() {
        this.Users = {};
        this.CollectionName = 'User';
        await MongoController.connect();
        await this.loadUsers();
    }

    /* use it in internal */
    getUser(userName) {
        const u = this.Users[userName];
        return u === undefined
            ? null
            : u;
    }

    /*use to join the profile*/
    getProfile(userName) {
        let u = this.getUser(userName).getProperty();
        if (u !== undefined) {
            if (u.authority.type === "manager") {
                let users = []
                for (const user of u.users) {
                    users.push(this.getUser(user).getProperty())
                }
                u.users = users
                return u;
            }
            else if (u.authority.type === "user") {
                let superior = this.getUser(u.authority.superior).getProperty();
                if (superior === undefined) {
                    return null;
                }
                let legaluser = superior.users.find(user => user === u.name)
                if (legaluser !== undefined) {
                    let joinclusters = []
                    for (var cluster in u.clusters) {
                        for (var superior_cluster in superior.clusters) {
                            if (u.clusters[cluster].name === superior.clusters[superior_cluster].name && superior.clusters[superior_cluster].status === 'Work') {
                                let copycluster = lodash.cloneDeep(superior.clusters[superior_cluster])
                                copycluster.username = u.clusters[cluster].username
                                copycluster.passwd = u.clusters[cluster].passwd
                                joinclusters.push(copycluster)
                            }
                        }
                    }
                    u.clusters = joinclusters
                    return u;
                } else {
                    return null;
                }
            }
        }
        else {
            return null;
        }
    }

    getUsers() {
        return this.Users;
    }

    getUsersCount() {
        return Object.keys(this.Users).length;
    }

    isUserExist(userName) {
        return this.getUser(userName) !== null;
    }

    async loadUsers() {
        // init DB
        assert.ok(MongoController.isConnect(), 'DB NOT connected');
        MongoController.initCollection(this.CollectionName);

        // load user data from db
        const UserProperties = await MongoController.getDocument(this.CollectionName);
        this.Users = {};
        // create user instance
        for (const property of UserProperties) {
            this.Users[property.name] = new User(property);
        }
    }
    // create new user to DB
    async createUser(Name, Passwd, Type) {
        const newUser = new User({ name: Name, passwd: Passwd, authority: Type })
        if (await this.Users[Name] != null) {
            return false
        }
        if (Type.type === "manager") {
            const dirpath = path.join(process.cwd(), `./Server/Home/${Name}`)
            if (!fs.existsSync(dirpath, fs.constants.R_OK | fs.constants.W_OK)) {
                fs.mkdirSync(dirpath);
            }
            if (!fs.existsSync(dirpath + "/Clusters", fs.constants.R_OK | fs.constants.W_OK)) {
                fs.mkdirSync(dirpath + "/Clusters");
            }
            if (!fs.existsSync(dirpath + "/Scheduler", fs.constants.R_OK | fs.constants.W_OK)) {
                fs.mkdirSync(dirpath + "/Scheduler");
            }
            if (!fs.existsSync(dirpath + "/Sim", fs.constants.R_OK | fs.constants.W_OK)) {
                fs.mkdirSync(dirpath + "/Sim");
            }
            if (!fs.existsSync(dirpath + "/Users", fs.constants.R_OK | fs.constants.W_OK)) {
                fs.mkdirSync(dirpath + "/Users");
            }
        }

        await MongoController
            .insertDocument(this.CollectionName, newUser.getProperty())
        this.Users[Name] = newUser;
        return true
    }

    // operate: {op: v}
    // op: $addcluster $adduser
    async modUser(uname, operate) {
        let tarUser = this.getUser(uname)
        assert.ok(tarUser !== null, `User ${tarUser.name} NOT exist`)
        const op = Object.keys(operate)[0]
        const v = operate[op]

        if (op === '$adduser') {
            if (tarUser.authority.type === 'manager') {
                if (await this.createUser(v.username, v.passwd, { "type": "user", "superior": tarUser.name }) === true) {
                    tarUser.adduser(v.username)
                }
                else {
                    return { msg: "Already have same user name." }
                }
            }
            else {
                return { msg: "FAIL!Only manager can add user." }
            }

        }
        else if (op === '$changepasswd') {
            tarUser.passwd = v.newpasswd
        }
        else if (op === '$setusercluster') {
            if (tarUser.authority.type === 'manager') {
                let legaluser = tarUser.users.find((user) => {
                    return user === v.username
                })

                if (legaluser === undefined) {
                    return { msg: "Not legal user." }
                }
                if (tarUser.checkcluster(v.clusterlist)) {
                    tarUser = this.getUser(v.username)
                    tarUser.setcluster(v.clusterlist)
                }
                else {
                    return { msg: "Not legal cluster." }
                }

            }
            else {
                return { msg: "FAIL!Only manager can set user's cluster." }
            }
        }
        else if (op === '$setclusteruser') {
            if (tarUser.authority.type === 'user') {
                if (!tarUser.setclusteruser(v.clustername, v.newusername, v.newuserpasswd)) {
                    { msg: "Not legal cluster." }
                }
            }
            else {
                return { msg: "FAIL!Only user can set cluster's user." }
            }
        }
        else {
            return { msg: "false" }
        }
        this.updateDB(tarUser)

        return { msg: "success" }
    }

    // update user data in DB
    async updateDB(tarUser) {
        assert.ok(tarUser !== null, `User ${tarUser.name} NOT exist`)
        return MongoController.updateDocument(
            this.CollectionName,
            { name: tarUser.name },
            tarUser.getProperty()
        )
    }
}

module.exports = new UserManager();