# CSaaS-Cloud

1. Config
- 將`/Server/Cluster/Daemons` 和 `/Server/Process/Command`中的所有檔案設為可讀可執行
- 將`/Server/Utils.js` 中的 HostIP 變數設為本機 IP
- 將`/Server/Utils.js` 中的 DBPort 變數設為資料庫的連接埠


2. 必要套件
- [Mongodb](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [OpenMPI](https://www.open-mpi.org/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/lang/en/)
- SSH


3. 使用方式
- 初始化
```
yarn install
yarn initapp
```

- 建立使用者 (可到`/Server/User/CreatUser.js` 更換想要的管理者ID和PASSWORD)
```
yarn startdb
yarn creatuser
```

- 開始
```
yarn build
yarn startdb
yarn start (背景執行模式用 yarn serve)
```