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
        if (newcluster.name === null || newcluster.nodeslist === null || newcluster.scheduler === null) {
            return false
        }
        for (const node of newcluster.nodeslist) {
            if (node.name === null || node.ip === null || node.nodeport === null || node.nodenp === null) {
                return false
            }
        }
        let c = this.clusters.find(c => c.name === newcluster.name)
        if (c === undefined) {
            newcluster.status = 'Stop'
            newcluster.port = "0"
            newcluster.schedulerport = "0"
            this.clusters.push(newcluster);
            return true
        }
        else
            return false
    }

    startcluster(clustername, svrport, schport) {
        let c = this.clusters.find(c => c.name === clustername)
        c.port = svrport
        c.schedulerport = schport
        c.status = "Work"
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

    setclusteruser(clustername, newusername, newuserpasswd) {
        let legalcluster = this.clusters.find((cluster) => {
            if (cluster.name === clustername) {
                cluster.username = newusername
                cluster.passwd = newuserpasswd
            }
            return cluster.name === clustername
        })
        if (legalcluster === undefined) {
            return false
        }
        return true
    }
};