import UserManager from './UserManager.js'

const Users = [
    'test'
]

UserManager.init().then(async () => {
    for (const name of Users) {
        await UserManager.createUser(name, name)
        console.log(`Create user`)
    }
    process.exit(0)
})