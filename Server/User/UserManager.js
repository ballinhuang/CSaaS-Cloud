import assert from 'assert';
import MongoController from '../MongoController.js';
import User from './User.js';

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
        const u = this.getUser(userName).getProperty();
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
                let superior = this.getUser(u.authority.superior);
                if (superior === undefined) {
                    return null;
                }
                let legaluser = superior.users.find(user => user === u.name)
                if (legaluser !== undefined) {
                    for (var cluster in u.clusters) {
                        for (var superior_cluster in superior.clusters) {
                            if (u.clusters[cluster].name === superior.clusters[superior_cluster].name) {
                                for (var key in superior.clusters[superior_cluster]) {
                                    if (superior.clusters[superior_cluster].hasOwnProperty(key)) {
                                        u.clusters[cluster][key] = superior.clusters[superior_cluster][key]
                                    }
                                }
                            }
                        }
                    }
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
        await MongoController
            .insertDocument(this.CollectionName, newUser.getProperty())
        this.Users[Name] = newUser;
        return true
    }

    // operate: {op: v}
    // op: $addcluster $adduser
    async modUser(uname, operate) {
        const tarUser = this.getUser(uname)
        assert.ok(tarUser !== null, `User ${tarUser.name} NOT exist`)
        const op = Object.keys(operate)[0]
        const v = operate[op]
        if (op === '$addcluster') {
            if (!tarUser.addcluster(v)) {
                return { msg: "false" }
            }
        }
        else if (op === '$adduser') {
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