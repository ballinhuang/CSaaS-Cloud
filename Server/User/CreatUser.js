import UserManager from './UserManager.js'


UserManager.init().then(async () => {

    // manager Format: UserManager.createUser( username, password , { "type": "manager", "superior": "admin" })
    // user Format: UserManager.createUser( username, password , { "type": "user", "superior": "the manager's username" })

    await UserManager.createUser('manager', 'manager', { "type": "manager", "superior": "admin" })
    process.exit(0)
})