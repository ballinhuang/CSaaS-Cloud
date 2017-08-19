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
    async createUser(Name, Passwd) {
        const newUser = new User({ name: Name, passwd: Passwd })

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
            tarUser.addcluster(v)
        } else {
            console.log('Unknown modUser command')
        }
        return this.updateDB(tarUser)
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