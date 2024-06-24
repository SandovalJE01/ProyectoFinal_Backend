import Users from "../schemas/users.schema.js";

class UsersDAO {

    static async getUserByEmail(email){
        return await Users.findOne({email});
    }

    static async getUserByCreds(email, password) {
        return await Users.findOne({email, password});
    }

    static async insert(first_name, last_name, age, email, password) {
        return await new Users({first_name, last_name, age, email, password}).save();
    }

    static async getUserByID(id) {
        return await Users.findById(id).lean();
    }

    static async saveResetToken(email, resetToken, expirationTime) {
        try {
            await Users.updateOne({ email }, { resetToken: resetToken, resetTokenExpiration: expirationTime });
        } catch (error) {
            throw new Error('Error al guardar el token de restablecimiento de contraseña en la base de datos');
        }
    }

    static async updateRole(id, role) {
        return await Users.findByIdAndUpdate(id, { role }, { new: true });
    }

    static async updateUserDocuments(id, documents) {
        return await Users.findByIdAndUpdate(id, { $push: { documents: { $each: documents } } }, { new: true });
    }

    static async updateUserLastConnection(id, date) {
        return await Users.findByIdAndUpdate(id, { last_connection: date }, { new: true });
    }
}

export default UsersDAO;