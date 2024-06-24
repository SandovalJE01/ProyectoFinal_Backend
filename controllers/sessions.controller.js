import session from 'express-session';
import UsersDAO from "../daos/users.dao.js";
import UserDTO from '../dtos/user.dto.js';
import sendPasswordResetEmail from '../utils/forgetPasswordEmail.js';
import generateResetToken from '../utils/generateToken.js';

const RegisterUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.redirect("/register");
    }

    const emailUsed = await UsersDAO.getUserByEmail(email);
    if (emailUsed) {
        return res.redirect("/register");
    } else {
        await UsersDAO.insert(first_name, last_name, age, email, password);
        return res.redirect("/login");
    }
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.redirect("/login");
    }

    const user = await UsersDAO.getUserByCreds(email, password);
    if (!user) {
        return res.redirect("/login");
    } else {
        await UsersDAO.updateUserLastConnection(user._id, new Date());
        req.session.user = user._id;
        if (user.role === 'admin') {
            req.session.isAdmin = true;
            return res.redirect("/panel-administracion");
        } else {
            req.session.isAdmin = false;
            return res.redirect("/store/products");
        }
    }
}

const LogoutUser = async (req, res) => {
    const userId = req.session.user;
    req.session.destroy(async (err) => {
        if (err) {
            return res.redirect("/login");
        }
        await UsersDAO.updateUserLastConnection(userId, new Date());
        return res.redirect("/login");
    });
}

const CurrentUser = async (req, res) => {
    if (req.session && req.session.user) {
        const userId = req.session.user;
        const userDTO = new UserDTO(userId);
        return res.status(200).json(userDTO);
    } else {
        return res.status(401).json({ message: "No hay sesión de usuario activa" });
    }
}

const ForgetPassword = async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'No hay sesión de usuario activa.' });
    }
    const userId = req.session.user;
    const user = await UsersDAO.getUserByID(userId);
    const userEmail = user.email;
    const { resetToken, expirationTime } = generateResetToken();
    await UsersDAO.saveResetToken(userEmail, resetToken, expirationTime);
    res.status(200).json({ message: 'Token de restablecimiento de contraseña generado correctamente.' });
}

export default {
    RegisterUser,
    LoginUser,
    LogoutUser,
    CurrentUser,
    ForgetPassword
}