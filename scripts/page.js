const utils = require('./utils');
const user_controller = require("./objs/user_controller");
const project_controller = require("./objs/project_controller");
const purchase_controller = require("./objs/purchase_controller");

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

        Promise.all([
            project_controller.listMyProjects(req),
        ]).then(pRet => {

            utils.render(res,res,{
                userName: req.session.userData.name,
                projects: pRet[0],
            },"internal_index","internal");

        }).catch(err => {
            this.error(req,res,err);
        });
    },
    internal_project(req,res){

        Promise.all([
            project_controller.getData(req.params.pid),
            purchase_controller.listMyPurchases(req.params.pid)
        ]).then(pRet => {

            utils.render(res,res,{
                userName: req.session.userData.name,
                projects: pRet[0],
                purchases: pRet[1],
            },"internal_project","internal");

        }).catch(err => {
            this.error(req,res,err);
        });
    }
};