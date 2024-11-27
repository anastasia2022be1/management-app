export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Токен передается в заголовке Authorization

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};
