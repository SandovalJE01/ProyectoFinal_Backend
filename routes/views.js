import Router from "express";

import UsersDAO from "../daos/users.dao.js";
import { isAdmin, isUser } from "../middleware/authorizationMiddleware.js";
import MockingController from "../controllers/mocking.controller.js";


const router = Router()

router.get('/', (req, res) => {
    res.redirect('/home');
});

router.get('/home', (req, res) => {

    if(req.session.user){
        res.redirect("/profile");
    } else {
        res.render("home");
    }

});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {

    if(req.session.user){
        res.redirect("/profile");
    } else {
        res.render("login");
    }

})

router.get("/profile", isUser, async (req, res) => {

    if(req.session.user){

        let user = await UsersDAO.getUserByID(req.session.user);
        res.render("profile", {user});

    } else {
        res.redirect("/login");
    }

})

router.get("/products", async (req, res) => {

    if(req.session.user){

        let user = await UsersDAO.getUserByID(req.session.user);
        res.render("products", { user, isAdmin: req.session.isAdmin });

    } else {
        res.redirect("/login");
    }

})

router.get("/panel-administracion", isAdmin, async (req, res) => {

    if(req.session.user){

        let user = await UsersDAO.getUserByID(req.session.user);
        res.render("panel", { user });

    } else {
        res.redirect("/login");
    }

})

router.get('/mockingproducts', MockingController.GetMockedProducts)

export default router;