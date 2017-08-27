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
        if (u !== undefined) {
            if (u.authority.type === "manager") {
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

        if (this.Users[Name] != null) {
            console.log("already have same user name")
            return
        }

        await MongoController
            .insertDocument(this.CollectionName, newUser.getProperty())

        this.Users[Name] = newUser;
    }

    // operate: {op: v}
    // op: $addcluster
    async modUser(uname, operate) {
        const tarUser = this.getUser(uname)
        assert.ok(tarUser !== null, `User ${tarUser.name} NOT exist`)
        const op = Object.keys(operate)[0]
        const v = operate[op]
        if (op === '$addcluster') {
            if (!tarUser.addcluster(v)) {
                return { msg: "false" }
            }
        } else {
            return { msg: "false" }
            console.log('Unknown modUser command')
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