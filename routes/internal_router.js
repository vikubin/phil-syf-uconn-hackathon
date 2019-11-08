const express = require('express');
const router = express.Router();

// Check if logged in
router.use((req,res,next)=>{
    console.log("Checking if user is authed for internal stuff");

    // TODO: Check auth
});

// Pages
router.get('/', (req,res)=>{

});

module.exports = router;