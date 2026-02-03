export const adminAuthMiddleware = (req, res, next) => {
    const adminKey = req.get("x-admin-key");
    if (adminKey === process.env.ADMIN_KEY) {
        next();
    } else {
        return res.status(403).send("Forbidden: Invalid admin key");
    }
}