import UsersDAO from "../daos/users.dao.js";

const ChangeRol = async (req, res) => {
    const userId = req.params.uid;

    try {
        const user = await UsersDAO.getUserByID(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const newRole = user.role === 'user' ? 'premium' : 'user';
        await UsersDAO.updateRole(userId, newRole);

        res.status(200).json({ message: `Rol de usuario actualizado a ${newRole}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
};

const uploadDocuments = async (req, res) => {
    res.status(200).json({ message: 'Documentos cargados exitosamente', files: req.files });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UsersDAO.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

const deleteInactiveUsers = async (req, res) => {
    try {
        const thresholdDate = moment().subtract(2, 'days').toDate();
        const inactiveUsers = await UsersDAO.getInactiveUsers(thresholdDate);

        for (const user of inactiveUsers) {
            await UsersDAO.deleteUserById(user._id);
            await sendInactivityEmail(user.email);
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
};

const renderUserManagement = async (req, res) => {
    try {
        const users = await UsersDAO.getAllUsers();
        res.render('users', { users }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al renderizar la gestión de usuarios' });
    }
};

const ChangeUserRole = async (req, res) => {
    const userId = req.params.uid;
    const newRole = req.query.role;

    console.log(userId, newRole)

    try {
        const updatedUser = await UsersDAO.updateRole(userId, newRole);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: `Rol de usuario actualizado a ${newRole}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.uid;

    try {
        const deletedUser = await UsersDAO.deleteUserById(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};


export default {
    ChangeRol,
    uploadDocuments,
    getAllUsers,
    deleteInactiveUsers,
    renderUserManagement,
    ChangeUserRole,
    deleteUser
};