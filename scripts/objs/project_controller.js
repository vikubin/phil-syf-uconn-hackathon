const Project = require('./Project');
const page = require('../page');
const {admin, db} = require('../../google-config.js');


function newProject(req,res) {

    // Create project
    let newProject = new Project({
        name: req.body.name,
        budget: req.body.budget,
        owners: [req.session.userData.uid],
    });

    newProject.push().then(()=>{
        res.redirect('/i/project/' + newProject.pid);
    }).catch(err => {
        console.error(err);

        switch (err){
            default:
                page.error(req,res,err);
        }
    });
}

function getData(pid) {
    let newProject = new Project({pid:pid});
    return newProject.get().then(()=>{
        return Promise.resolve(newProject.data());
    }).catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
}

function addPerson(req,res) {
    db.collection("projects").doc(req.params.pid).update({
        owners: admin.firestore.FieldValue.arrayUnion(req.body.personUID)
    }).then(()=>{
        res.redirect("/i/");
    });
}

function listMyProjects(req) {
    return db.collection("projects").where("owners","array-contains",req.session.userData.uid).get().then(snap => {
        let nameArray = [];
        snap.forEach(item => {
            nameArray.push({name:item.data().name,id:item.id})
        });
        return Promise.resolve(nameArray);
    }).catch(err => {
        return Promise.reject(err);
    });
}

module.exports = {
    newProject,
    getData,
    addPerson,
    listMyProjects,
};
