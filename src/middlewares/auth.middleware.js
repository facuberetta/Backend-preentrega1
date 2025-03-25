export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado. Debes iniciar sesión." });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado. No tienes permisos suficientes." });
        }

        next();
    };
};
