const {admin, db} = require('../../google-config.js');

const uuidv4 = require('uuid/v4');


class Project{
    /**
     * Creates an instance of project
     * @param pid
     * @param name
     * @param budget
     * @param {array} owners
     * @param {array} purchases - array pf purchaseIDs
     */
    constructor({pid,name,budget,owners,purchases}){

        this.pid = pid || null;
        this.name = name || null;
        this.budget = budget || null;
        this.owners = owners || [];
        this.purchases = purchases || [];

    }

    /**
     * Fills User with data from DB
     * @returns {Promise}
     */
    get(){
        // Get by pid
        return db.collection('projects').doc(this.pid).get().then(data => {
            // Parse return Value
            data = data.data();

            // Set values
            this.pid = data.pid;
            this.name = data.name;
            this.budget = data.budget;
            this.owners = data.owners;
            this.purchases = data.purchases;

            return Promise.resolve(this);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    push(){
        // Create pid if none set
        if(this.pid === null){
            this.pid = uuidv4();
        }

        // Create OR update record
        return db.collection('projects').doc(this.pid).set(this.data(),{merge:true}).then(()=>{
            return Promise.resolve(this);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    /**
     * Returns the properties of this class
     * @returns {{}}
     */
    data(){
        let retObj = {};
        Object.keys(this).forEach(key => {
            retObj[key] = this[key];
        });

        return retObj;
    }
}

module.exports = Project;