const utils = require('./utils');

module.exports = {
    index(req,res){
        utils.render(res,res,{},"index","external");
    },
    error(req,res,type){
        switch (type) {
            case "404":
                res.status(404).send("Page not found");
                break;
            default:
                res.status(500).send("Server Error, please try again.");
        }
    },
};