# Checklist de Deployment en Render + Supabase

## 🔧 Pasos para Resolver el Error Actual

### 1. Configuración de Variables de Entorno en Render

Ve a tu servicio en Render Dashboard → Environment:

```env
DATABASE_URL=postgresql://postgres.ukgtenyqajycwheucovn:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ukgtenyqajycwheucovn:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
NODE_ENV=production
PORT=10000
JWT_SECRET=[tu-secret-aquí]
CORS_ORIGIN=https://tu-frontend.com
```

**CRÍTICO:** Reemplaza `[PASSWORD]` con tu contraseña real SIN corchetes.

### 2. Regenerar Prisma Client

Después de modificar `config/prismaClient.js`, es necesario:

```bash
# Ejecutar en producción automáticamente
npx prisma generate
```

Agrega esto al `package.json` en el script de build:

```json
"scripts": {
  "build": "npx prisma generate",
  "start": "node --dns-result-order=ipv4first --no-network-family-autoselection server.js"
}
```

### 3. Configuración de Build en Render

En Settings → Build & Deploy:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### 4. Re-deploy

Después de los cambios:

1. Commit y push al repositorio
2. Render detectará automáticamente y re-desplegará
3. O manualmente: Dashboard → Manual Deploy → Deploy latest commit

---

## 🐛 Diagnóstico de Problemas Persistentes

### Si el error continúa después de Solución 1:

#### A. Verificar que el adaptador se instaló correctamente

Logs de Render deberían mostrar:

```
npm install
...
+ @prisma/adapter-pg@7.0.1
+ pg@8.16.3
```

#### B. Prueba la conexión directa

Modifica temporalmente `config/prismaClient.js`:

```javascript
const connectionString = process.env.DIRECT_URL; // En vez de DATABASE_URL
```

Si esto funciona → Confirma que el problema es pgBouncer.

#### C. Agregar logs de debugging

En `utils/permissionService.js`:

```javascript
async function loadRolePermissions() {
    console.log('🔍 Intentando cargar permisos...');
    console.log('🔍 DATABASE_URL configurado:', !!process.env.DATABASE_URL);
    
    try {
        const roles = await prisma.cat_Rols.findMany({
            include: {
                Cat_rol_Permission: { include: { catUrl: true } }
            }
        });
        
        console.log('✅ Roles cargados:', roles.length);
        
        const newMap = roles.reduce((map, role) => {
            map[role.name] = role.Cat_rol_Permission
                .filter(rp => rp.enabled)
                .map(rp => rp.catUrl.code);
            return map;
        }, {});

        Object.keys(rolePermissionsMap).forEach(key => delete rolePermissionsMap[key]);
        Object.assign(rolePermissionsMap, newMap);
        
        return newMap;
    } catch (error) {
        console.error('❌ Error detallado:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
        throw error;
    }
}
```

---

## 🎯 Configuraciones Específicas de Supabase

### Pool Size Recomendado

Para Supabase Free Tier (máximo 60 conexiones):

```javascript
const pool = new Pool({ 
    connectionString,
    max: 5,  // Máximo 5 conexiones por instancia
    min: 1,  // Mínimo 1 conexión activa
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
```

### Configuración de pgBouncer en Supabase

Verifica en Dashboard → Database → Connection Pooling:

- **Pool Mode:** Transaction (puerto 6543)
- **Session Mode:** Puerto 6543 con parámetro `?pgbouncer=true&session_mode=true` (si está disponible)
- **Conexión Directa:** Puerto 5432 (sin pgBouncer)

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Too many connections"

**Causa:** Múltiples instancias de Prisma sin pool.

**Solución:**
```javascript
// Singleton pattern para Prisma
let prismaInstance;

function getPrismaClient() {
    if (!prismaInstance) {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
        const adapter = new PrismaPg(pool);
        prismaInstance = new PrismaClient({ adapter });
    }
    return prismaInstance;
}

module.exports = getPrismaClient();
```

### Error: "SSL required"

Agrega SSL a la connection string:

```javascript
const pool = new Pool({ 
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 5,
});
```

### Timeout en producción

Aumenta timeouts:

```javascript
const pool = new Pool({ 
    connectionString,
    max: 5,
    idleTimeoutMillis: 60000,      // 60s
    connectionTimeoutMillis: 20000, // 20s
    query_timeout: 30000,           // 30s
});
```

---

## 📊 Monitoreo Post-Deploy

### Logs a verificar en Render

Busca estas líneas en orden:

```
1. DATABASE_URL: postgresql://postgres.ukgtenyqajycwheucovn:***@...
2. DIRECT_URL: postgresql://postgres.ukgtenyqajycwheucovn:***@...
3. Default DNS order: ipv4first
4. PG CONNECT OK: [ { ok: 1 } ]
5. ✅ Prisma connected successfully
6. ✔ Permisos cargados desde BD
7. Servidor corriendo en puerto 10000
8. Your service is live 🎉
```

Si falta alguno → Identifica cuál y revisa esa parte.

### Métricas en Supabase

Dashboard → Database → Logs:

- Verifica conexiones activas
- Revisa queries lentas
- Monitorea errores de autenticación

---

## 🔐 Seguridad de Variables de Entorno

### NO hagas esto:

❌ Commitear `.env` al repositorio
❌ Usar credenciales de admin en producción
❌ Compartir URLs de conexión en logs públicos

### SÍ haz esto:

✅ Usar variables de entorno de Render
✅ Rotar credenciales periódicamente
✅ Usar diferentes usuarios DB para dev/prod
✅ Maskear passwords en logs (ya implementado en app.js)

---

## 🧪 Testing Local antes de Deploy

### 1. Simular entorno de producción

```bash
# .env.production
DATABASE_URL=postgresql://postgres.ukgtenyqajycwheucovn:[pass]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ukgtenyqajycwheucovn:[pass]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
NODE_ENV=production
```

```bash
NODE_ENV=production node server.js
```

### 2. Test de carga de permisos

```bash
node -e "
const { loadRolePermissions } = require('./utils/permissionService');
loadRolePermissions()
    .then(r => console.log('✅ OK:', Object.keys(r)))
    .catch(e => console.error('❌ FAIL:', e.message))
    .finally(() => process.exit());
"
```

---

## 📝 Recomendaciones Finales

### Optimizaciones sugeridas:

1. **Lazy loading de permisos:** No cargarlos al iniciar, sino on-demand
2. **Cache de permisos:** Usar Redis o memoria con TTL
3. **Health check endpoint:** Para monitoreo de Render
4. **Graceful shutdown:** Cerrar pool al terminar proceso

### Implementación de Health Check:

```javascript
// En routes/v1.js o app.js
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});
```

Configura en Render → Settings → Health Check Path: `/health`
