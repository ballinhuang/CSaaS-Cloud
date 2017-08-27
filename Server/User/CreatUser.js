import UserManager from './UserManager.js'

const Users = [
    'test'
]

UserManager.init().then(async () => {
    for (const name of Users) {
        await UserManager.createUser(name, name, { "type": "manager", "superior": "admin" })
        console.log(`Create user`)
    }
    process.exit(0)
})