import {Router} from "express";
import passport from "passport";
import SessionsController from "../controllers/sessions.controller.js";
import UsersDAO from "../daos/users.dao.js";

const router = Router();

router.post("/register", SessionsController.RegisterUser);

router.post("/login", SessionsController.LoginUser);

router.get("/logout", SessionsController.LogoutUser);

router.post("/login", passport.authenticate("local", {
    successRedirect: "/store/products",
    failureRedirect: "/login", 
    failureFlash: true
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/login",
}), async (req, res) => {
    req.session.user = req.user._id;
    console.log(req.user)
    await UsersDAO.updateUserLastConnection(req.user._id, new Date());
    res.redirect("/store/products");
});

router.get("/current", SessionsController.CurrentUser);

router.post("/forget-password", SessionsController.ForgetPassword);

export default router;