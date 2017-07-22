import assert from 'assert';
import MongoController from './MongoController.js';
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

}

module.exports = new UserManager();