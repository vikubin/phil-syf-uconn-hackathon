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
            case "login_invalidPass":
                utils.render(res,res,{
                    alertShow: true,
                    alertType: "danger",
                    alertText: "Invalid Password"
                },"login","external");
                break;
            case "register_alreadyExists":
                utils.render(res,res,{
                    alertShow: true,
                    alertType: "danger",
                    alertText: "User with that password already exists"
                },"index","external");
                break;
            default:
                res.status(500).send("Server Error, please try again.");
        }
    },
    login(req,res){
        utils.render(res,res,{},"login","external");
    },
    register(req,res){
        utils.render(res,res,{},"register","external");
    },
    internal_index(req,res){
        utils.render(res,res,{},"internal_index","internal");
    },
};