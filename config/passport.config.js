import passport from "passport";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import GitHubStrategy from "passport-github2";
import UsersDAO from "../daos/users.dao.js";
import "dotenv/config"

const initializePassport = () => {

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UsersDAO.getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

    passport.use('github', new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile); // Es recomendable hacer console.log de toda la información que viene del perfil.
  
        // Busca al usuario en la base de datos por su email
        let user = await UsersDAO.getUserByEmail(profile._json.email);
  
        if (!user) { // El usuario no existía en nuestro sitio web, lo agregamos a la base de datos.
          let newUser = {
            first_name: profile._json.name,
            last_name: '', // Nota cómo nos toca rellenar los datos que no vienen desde el perfil
            age: 18, // Nota cómo nos toca rellenar los datos que no vienen desde el perfil
            email: profile._json.email,
            password: '', // Al ser autenticación de terceros, no podemos asignar un password
          };
          
          // Inserta el nuevo usuario en la base de datos
          let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.password);
          done(null, result);
        } else { // Si entra aquí, es porque el usuario ya existía.
            done(null, user);
        }
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }));
  };

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  export default initializePassport;