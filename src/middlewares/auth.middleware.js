import passport from "passport";

export const authenticateJWT = passport.authenticate("jwt", { session: false });

export const authorizeRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        return next();
    }
    return res.status(403).json({ message: "Acceso denegado" });
};

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
