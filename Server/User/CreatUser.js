import UserManager from './UserManager.js'

const Users = [

]

UserManager.init().then(async () => {
    /*
    for (const name of Users) {
        await UserManager.createUser(name, name, { "type": "user", "superior": "manager" })
        console.log(`Create user`)
    }
    */
    await UserManager.createUser('manager', 'manager', { "type": "manager", "superior": "admin" })
    process.exit(0)
})