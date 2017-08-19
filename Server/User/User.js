module.exports = class User {

    constructor(property) {
        this.name = property.name;
        this.passwd = property.passwd;
        this.clusters = property.clusters || [];
    }

    getProperty() {
        return {
            name: this.name,
            passwd: this.passwd,
            clusters: this.clusters
        };
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

    startcluster(targetcluster) {

    }
};