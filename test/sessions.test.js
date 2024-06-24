import supertest from "supertest";
import { expect } from "chai";
import UsersDAO from "../daos/users.dao.js";

const requester = supertest("http://127.0.0.1:3000");

describe("Controlador de Usuarios", () => {
    describe('POST /register', () => {
        it('debería registrar un nuevo usuario', async () => {
            const userData = {
                first_name: "John",
                last_name: "Doe",
                email: "john@example.com",
                age: 30,
                password: "password123"
            };
            const res = await requester.post('/register').send(userData);
            expect(res.status).to.equal(302);
            const registeredUser = await UsersDAO.getUserByEmail(userData.email);
            expect(registeredUser).to.exist;
        });
    });

    describe('POST /login', () => {
        it('debería iniciar sesión con credenciales válidas', async () => {
            const credentials = {
                email: "john@example.com",
                password: "password123"
            };
            const res = await requester.post('/login').send(credentials);
            expect(res.status).to.equal(302);
        });

        it('debería devolver un mensaje de error con credenciales inválidas', async () => {
            const invalidCredentials = {
                email: "john@example.com",
                password: "incorrectpassword"
            };
            const res = await requester.post('/login').send(invalidCredentials);
            expect(res.status).to.equal(302); 
        });
    });

    describe('POST /logout', () => {
        it('debería cerrar sesión correctamente', async () => {
            const res = await requester.post('/logout');
            expect(res.status).to.equal(302);
        });
    });

    describe('GET /user/current', () => {
        it('debería devolver el usuario actual', async () => {
            const res = await requester.get('/user/current');
            expect(res.status).to.equal(200);
        });

        it('debería devolver un mensaje de error si no hay sesión activa', async () => {
            const res = await requester.get('/user/current');
            expect(res.status).to.equal(401);
        });
    });

    describe('POST /forgetpassword', () => {
        it('debería generar un token de restablecimiento de contraseña', async () => {
            const res = await requester.post('/forgetpassword');
            expect(res.status).to.equal(200);
        });

        it('debería devolver un mensaje de error si no hay sesión activa', async () => {
            const res = await requester.post('/forgetpassword');
            expect(res.status).to.equal(401);
        });
    });
});