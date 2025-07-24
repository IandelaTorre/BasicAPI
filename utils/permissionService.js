const prisma = require("../config/prismaClient");

const rolePermissionsMap = {};

async function loadRolePermissions() {
    const roles = await prisma.cat_Rols.findMany({
        include: {
            Cat_rol_Permission: { include: { catUrl: true } }
        }
    });
    
    const newMap = roles.reduce((map, role) => {
        map[role.name] = role.Cat_rol_Permission
            .filter(rp => rp.enabled)
            .map(rp => rp.catUrl.code);
        return map;
    }, {});

    // Limpiamos el objeto exportado y copiamos valores
    Object.keys(rolePermissionsMap).forEach(key => delete rolePermissionsMap[key]);
    Object.assign(rolePermissionsMap, newMap);
}

module.exports = { rolePermissionsMap, loadRolePermissions };