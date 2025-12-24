const prisma = require("../config/prismaClient");

const rolePermissionsMap = {};
let isLoaded = false;
let loadAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadRolePermissions(retryCount = 0) {
    try {
        console.log(`🔄 Cargando permisos de roles... (intento ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
        loadAttempts++;
        
        const roles = await prisma.cat_Rols.findMany({
            where: { enabled: true },
            include: {
                Cat_rol_Permission: { 
                    where: { enabled: true },
                    include: { catUrl: true } 
                }
            },
            timeout: 10000
        });
        
        console.log(`✅ Se encontraron ${roles.length} roles en la base de datos`);
        
        const newMap = roles.reduce((map, role) => {
            const permissions = role.Cat_rol_Permission
                .filter(rp => rp.enabled && rp.catUrl)
                .map(rp => rp.catUrl.code);
            
            map[role.name] = permissions;
            console.log(`  - Rol "${role.name}": ${permissions.length} permisos`);
            return map;
        }, {});

        Object.keys(rolePermissionsMap).forEach(key => delete rolePermissionsMap[key]);
        Object.assign(rolePermissionsMap, newMap);
        
        isLoaded = true;
        console.log('✅ Permisos cargados correctamente en memoria');
        
        return newMap;
    } catch (error) {
        console.error(`❌ Error al cargar permisos (intento ${retryCount + 1}):`, {
            message: error.message,
            code: error.code,
            clientVersion: error.clientVersion
        });
        
        if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
            console.log(`⏳ Reintentando en ${RETRY_DELAY_MS}ms...`);
            await delay(RETRY_DELAY_MS);
            return loadRolePermissions(retryCount + 1);
        }
        
        console.error('❌ Se agotaron los intentos de carga de permisos');
        throw error;
    }
}

function getRolePermissions(roleName) {
    if (!isLoaded) {
        console.warn('⚠️  Los permisos aún no han sido cargados');
        return [];
    }
    return rolePermissionsMap[roleName] || [];
}

function isPermissionLoaded() {
    return isLoaded;
}

module.exports = { 
    rolePermissionsMap, 
    loadRolePermissions,
    getRolePermissions,
    isPermissionLoaded
};