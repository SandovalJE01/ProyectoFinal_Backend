import { Router } from "express";
import UsersController from "../controllers/users.controller.js";
import multer from "multer";
import { isAdmin } from '../middleware/authorizationMiddleware.js'; 

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

router.get('/', isAdmin, UsersController.renderUserManagement);
router.delete('/', UsersController.deleteInactiveUsers);
router.put('/:uid/role', UsersController.ChangeUserRole);
router.delete('/:uid', UsersController.deleteUser);
router.post('/:uid/documents', upload.array('documents'), UsersController.uploadDocuments);

export default router;