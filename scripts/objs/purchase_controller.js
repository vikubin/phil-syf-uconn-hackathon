const Purchase = require('./Purchase');
const Project = require('./Project');
const page = require('../page');
const {admin, db} = require('../../google-config.js');


function newPurchase(req,res) {

    let newProject = new Project({pid:req.body.pid});
    newProject.get().then(()=>{

        function voters() {
            let voterList = [];
            newProject.owners.forEach(voter =>{
                voterList.push({voter,vote:null,comment:null})
            })
        }

        // Create purchase
        let newPurchase = new Purchase({
            name: req.body.name,
            maxPrice: req.body.budget,
            project: req.body.pid,
            voters: voters(),
        });

        newPurchase.push().then(()=>{
            res.redirect('/i/project/' + newPurchase.project);
        }).catch(err => {
            console.error(err);

            switch (err){
                default:
                    page.error(req,res,err);
            }
        });
    }).catch(err => {
        console.error(err);

        switch (err){
            default:
                page.error(req,res,err);
        }
    });


}

function getData(purchaseID) {
    let newPurchase = new Purchase({purchaseID:purchaseID});
    return newPurchase.get().then(()=>{
        return Promise.resolve(newPurchase.data());
    }).catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
}

function listMyPurchases(pid) {
    return db.collection("purchases").where("project","==",pid).get().then(snap => {
        let nameArray = {approved:[],suggested:[]};
        snap.forEach(item => {

            let approved = true;

            item.data().voters.forEach(voter => {
                if(voter.vote !== true){
                    approved = false;
                }
            });

            if(approved){
                nameArray.approved.push({name:item.data().name,id:item.id,data:item.data()})
            }else{
                nameArray.suggested.push({name:item.data().name,id:item.id,data:item.data()})
            }
        });
        return Promise.resolve(nameArray);
    }).catch(err => {
        return Promise.reject(err);
    });
}

function approvePurchase(req,res) {

    let purchaseID = req.params.purchaseID;
    let uid = req.session.userData.uid;

    let newPurchase = new Purchase({purchaseID:purchaseID});

    newPurchase.get().then(()=>{
        newPurchase.voters.forEach(voter=>{
            if(voter.uid === uid){
                voter.vote = true;
            }
        });
        return newPurchase.push();
    }).then(()=>{
        res.redirect("/i/project/" + newPurchase.project);
    });
}
function denyPurchase(req,res) {

    let purchaseID = req.params.purchaseID;
    let uid = req.session.userData.uid;

    let newPurchase = new Purchase({purchaseID:purchaseID});

    newPurchase.get().then(()=>{
        newPurchase.voters.forEach(voter=>{
            if(voter.uid === uid){
                voter.vote = false;
            }
        });
        return newPurchase.push();
    }).then(()=>{
        res.redirect("/i/project/" + newPurchase.project);
    });
}

module.exports = {
    newPurchase,
    getData,
    listMyPurchases,
    approvePurchase,
    denyPurchase,
};
