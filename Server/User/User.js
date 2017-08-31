module.exports = class User {

    constructor(property) {
        this.name = property.name;
        this.passwd = property.passwd;
        this.clusters = property.clusters || [];
        this.authority = property.authority;
        this.users = property.users || [];
    }

    getProperty() {
        if (this.authority.type !== 'user') {
            return {
                name: this.name,
                passwd: this.passwd,
                clusters: this.clusters,
                authority: this.authority,
                users: this.users
            };
        }
        else {
            return {
                name: this.name,
                passwd: this.passwd,
                clusters: this.clusters,
                authority: this.authority,
            };
        }
    }

    addcluster(newcluster) {
        let c = this.clusters.find(c => c.name === newcluster.name)
        if (c === undefined) {
            newcluster.state = 'Stop'
            newcluster.port = "0"
            newcluster.serverpid = "0"
            newcluster.schedulerpid = "0"
            this.clusters.push(newcluster);
            return true
        }
        else
            return false
    }

    adduser(newuser) {
        this.users.push(newuser)
    }

    // user
    setcluster(clusterlist) {
        // push new
        for (const clustername of clusterlist) {
            let c = this.clusters.find(cluster => cluster.name === clustername)
            if (c === undefined) {
                this.clusters.push({ "name": clustername, "username": "", "passwd": "" })
            }
        }
        // delete
        for (var i in this.clusters) {
            let c = clusterlist.find(cluster => cluster === this.clusters[i].name)
            if (c === undefined) {
                this.clusters.splice(i, 1)
            }
        }
    }
    // manager
    checkcluster(clusterlist) {
        for (const clustername of clusterlist) {
            let c = this.clusters.find((cluster) => {
                return cluster.name === clustername
            })
            if (c === undefined) {
                return false
            }
        }
        return true
    }
};