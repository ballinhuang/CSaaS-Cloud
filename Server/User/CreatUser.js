import UserManager from './UserManager.js'

const Users = [

]

UserManager.init().then(async () => {
    /*
    for (const name of Users) {
        await UserManager.createUser(name, name, { "type": "user", "superior": "acs103" })
        console.log(`Create user`)
    }
    */
    await UserManager.createUser('acs103', 'a12780', { "type": "manager", "superior": "admin" })
    process.exit(0)
})