const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado: No eres administrador" });
    }
};

const isUser = (req, res, next) => {
    if (req.session && !req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado: No eres usuario regular" });
    }
};

export { isAdmin, isUser };