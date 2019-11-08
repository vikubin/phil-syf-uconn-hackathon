const express = require('express');
const router = express.Router();

// Scripts
const page = require('../scripts/page');

// Check if logged in
router.use((req,res,next)=>{
    console.log("Checking if user is authed for internal stuff");

    if(req.session.loggedIn !== true){
        page.login(req,res);
    }else{
        next();
    }
});

// Pages
router.get('/', (req,res)=>{
    page.internal_index(req,res);
});

module.exports = router;