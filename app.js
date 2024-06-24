import express from "express"
import { engine } from 'express-handlebars';
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import userRouter from './routes/user.js';
import sessionRouter from './routes/sessions.js';
import viewsRouter from "./routes/views.js";
import prodsRouter from './routes/products.js';

import passport from 'passport';
import initializePassport from './config/passport.config.js';

import logger from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import "dotenv/config";

const app = express()

const swaggerOptions = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: 'API Ecommerce',
            description: 'API pensada para Ecommerce y manejar sus productos, carritos y usuarios.'
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({extended:true}))

app.use(cookieParser());

initializePassport();

app.use(session({
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        ttl:15,
    }),
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true
}))

app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use("/", viewsRouter);
app.use("/store", prodsRouter);

app.use(passport.initialize());

app.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje de HTTP');
    logger.info('Este es un mensaje de información');
    logger.warning('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje de fatalidad');
  
    res.send('Logs generados. Verifica el archivo "errors.log" para los errores.');
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URL);
mongoose.set("strictQuery", false);

app.listen(3000, () => {
    console.log("Servidor listo http://127.0.0.1:${process.env.PORT}");
})