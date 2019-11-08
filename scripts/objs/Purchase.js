const {admin, db} = require('../../google-config.js');

const uuidv4 = require('uuid/v4');


class Purchase{
    /**
     *
     * @param purchaseID
     * @param name
     * @param {string} project - projectID
     * @param {array} voters
     * @param voters[number].uid
     * @param voters[number].vote - true, false, or null
     * @param voters[number].comment - string or null
     * @param {array} maxPrice
     */
    constructor({purchaseID,name,project,voters,maxPrice}){

        this.purchaseID = purchaseID || null;
        this.name = name || null;
        this.project = project || null;
        this.voters = voters || [];
        this.maxPrice = maxPrice || [];
    }

    /**
     * Fills User with data from DB
     * @returns {Promise}
     */
    get(){
        // Get by purchaseID
        return db.collection('purchases').doc(this.purchaseID).get().then(data => {
            // Parse return Value
            data = data.data();

            // Set values
            this.purchaseID = data.purchaseID;
            this.name = data.name;
            this.project = data.project;
            this.voters = data.voters;
            this.maxPrice = data.maxPrice;

            return Promise.resolve(this);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    push(){
        // Create purchaseID if none set
        if(this.purchaseID === null){
            this.purchaseID = uuidv4();
        }

        // Create OR update record
        return db.collection('purchases').doc(this.purchaseID).set(this.data(),{merge:true}).then(()=>{
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

module.exports = Purchase;