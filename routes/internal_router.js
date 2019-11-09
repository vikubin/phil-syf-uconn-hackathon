const express = require('express');
const router = express.Router();

// Scripts
const page = require('../scripts/page');
const project_controller = require('../scripts/objs/project_controller')
const purchase_controller = require('../scripts/objs/purchase_controller')

// Check if logged in
router.use((req,res,next)=>{
    console.log("Checking if user is authed for internal stuff");

    if(req.session.loggedIn !== true){
        page.login(req,res);
    }else{
        next();
    }
});

router.get('/purchase/:purchaseID/approve',(req,res)=>{
    purchase_controller.approvePurchase(req,res);
});

router.get('/purchase/:purchaseID/deny',(req,res)=>{
    purchase_controller.denyPurchase(req,res);
});

// Pages
router.get('/', (req,res)=>{
    page.internal_index(req,res);
});

router.get('/project/:pid',(req,res)=>{
    page.internal_project(req,res);
});

// Post
router.post('/newProject',(req,res)=>{
    project_controller.newProject(req,res);
});

router.post('/project/:pid/newPurchase',(req,res)=>{
    purchase_controller.newPurchase(req,res);
});

router.post('/project/:pid/addPerson',(req,res)=>{
    project_controller.addPerson(req,res);
});

module.exports = router;