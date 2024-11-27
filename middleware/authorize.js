export const authorize = (requiredRoles) => {
    return (req, res, next) => {
        // Проверяем наличие пользователя и его роли
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};
