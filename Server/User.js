module.exports = class User {

    constructor(property) {
        this.name = property.name;
        this.passwd = property.passwd;
        this.clusters = property.clusters || [];
    }

    updatePassword(passwd) {
        // update this
        this.passwd = passwd;
    }

    getProperty() {
        return {
            name: this.name,
            passwd: this.passwd,
            clusters: this.clusters
        };
    }
};