const User = require('./User');
const page = require('../page');
const {admin, db} = require('../../google-config.js');


function loginUser(req,res){

    const userEmail = req.body.emailAddress;
    const userPass = req.body.userPass;

    if(userEmail === undefined){
        return Promise.reject(Error("Email not defined"));
    }

    if(userPass === undefined){
        return Promise.reject(Error("Password not defined"));
    }

    let newUser = new User({
        email: userEmail
    });

    newUser.get().then(() => {

        // Check the password
        if(newUser.validatePassword(userPass)){
            req.session.loggedIn = true;
            req.session.userData = newUser.data();

            console.log("loginSuccess");
            console.log(req.session);
            return res.redirect("/i/");

        }else{
            console.error("Bad Pass");
            page.error(req,res,"login_invalidPass");
        }

    }).catch(err => {
        console.error(err);

        page.error(req,res);
    });
}


function newUser(req,res) {

    // Check if exists
    return db.collection('users').where("email","=",req.body.emailAddress).get().then(snap => {

        if(snap.size >= 1){
            return Promise.reject("alreadyExists");
        }else{
            return Promise.resolve();
        }

    }).then(()=>{

        // Create user
        let newUser = new User({
            name: req.body.userName,
            email: req.body.emailAddress,
            pass: req.body.userPass,
        });

        newUser.push().then(()=>{
            page.internal_index(req,res);
        }).catch(err => {
            console.error(err);
        });

    }).catch(err => {
        console.error(err);

        switch (err){
            case "alreadyExists":
                page.error(req,res,"register_alreadyExists");
                break;
            default:
                page.error(req,res,err);
        }
    });
}

function listNames() {
    return db.collection("users").get().then(snap => {
        let nameArray = [];
        snap.forEach(item => {
            nameArray.push(item.data().name)
        });
        return Promise.resolve(nameArray);
    }).catch(err => {
        return Promise.reject(err);
    })
}

function userIdNameArray() {
    return db.collection("users").get().then(snap=>{
        let retArray = [];
        snap.forEach(user=>{
            retArray.push({uid:user.id,name:user.data().name});
        });
        return Promise.resolve(retArray);
    });
}

module.exports = {
    loginUser,
    newUser,
    listNames,
    userIdNameArray,
};

listNames();