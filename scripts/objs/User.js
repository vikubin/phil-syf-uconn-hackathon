const {admin, db} = require('../../google-config.js');


const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');


class User{
    constructor({uid,name,email,pass}){

        this.uid = uid || null;
        this.name = name || null;
        this.email = email || null;
        this.pass = pass || null;

        // Process password
        if(pass !== undefined){
            if(pass.length !== 60){
                // Probably not hashed as hashed passwords are 60 chars long and people don't set 60char passwords
                // Yeah, it's a bug. Not a reallly critical one though
                this.pass = bcrypt.hashSync(pass, 10);
            }else{
                this.pass = pass;
            }
        }else{
            this.pass = undefined;
        }
    }

    /**
     * Fills User with data from DB
     * @returns {Promise}
     */
    get(){

        //let retreivedData = {};
        if(this.uid === null){
            // Get by email

            return db.collection('users').where("email","=",this.email).get().then(snap => {

                if(snap.size === 1){
                    snap.forEach(item => {

                        let data = item.data();

                        // Set values
                        this.uid = data.uid;
                        this.name = data.name;
                        this.email = data.email;
                        this.pass = data.pass;

                    });
                    return Promise.resolve(this);
                }else{
                    return Promise.reject(Error(`Invalid matching user size. Needs 1. Got: ${snap.size}.`));
                }

            }).catch(err => {
                console.error(err);
                return Promise.reject(err);
            });

        }else{
            // Get by UID
            return db.collection('users').doc(this.uid).get().then(data => {
                // Parse return Value
                data = data.data();

                // Set values
                this.uid = data.uid;
                this.name = data.name;
                this.email = data.email;
                this.pass = data.pass;

                return Promise.resolve(this);
            }).catch(err => {
                return Promise.reject(err);
            });
        }
    }

    push(){
        // Create UID if none set
        if(this.uid === null){
            this.uid = uuidv4();
        }

        // Create OR update record
        return db.collection('users').doc(this.uid).set(this.data(),{merge:true}).then(()=>{
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

    validatePassword(password){
        return (bcrypt.compareSync(password, this.pass));
    }
}

module.exports = User;