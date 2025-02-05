// Authorization Middleware
export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.authUser
        const isRoleAllowed = allowedRoles.includes(role);
        if (!isRoleAllowed) return res.status(401).json({ message: "Unauthorized" })
        next()
    }
}