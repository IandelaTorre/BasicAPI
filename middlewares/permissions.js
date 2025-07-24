const { rolePermissionsMap } = require('../utils/permissionService');

function authorize(permissionKey) {
    return (req, res, next) => {
        const roleName = req.user.rol;
        
        const perms = rolePermissionsMap[roleName] || [];
        
        if (perms.includes('*') || perms.includes(permissionKey)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: no permission' });
    };
}

module.exports = { authorize };