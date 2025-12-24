# Soluciones Alternativas para Deploy en Render

## SOLUCIÓN 2: Usar DIRECT_URL (Puerto 5432)

Si la Solución 1 con el adaptador no funciona, puedes forzar a Prisma a usar la conexión directa:

### Opción A: Modificar schema.prisma temporalmente

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DIRECT_URL")  // Cambiar de DATABASE_URL a DIRECT_URL
  directUrl = env("DIRECT_URL")
  schemas   = ["catalogs", "user"]
}
```

### Opción B: Variable de entorno override en Render

En el dashboard de Render, configura:
```
DATABASE_URL=postgresql://postgres.ukgtenyqajycwheucovn:[pass]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Ventajas:**
- ✅ Evita completamente pgBouncer
- ✅ Conexión directa garantizada

**Desventajas:**
- ❌ Mayor latencia
- ❌ Sin pooling de Supabase
- ❌ Límite de 60 conexiones simultáneas en plan free

---

## SOLUCIÓN 3: Session Mode en pgBouncer (Requiere cambio en Supabase)

Supabase ofrece otro puerto con Session Mode, pero necesitas verificar si está disponible en tu plan:

**Puerto alternativo:** 6543 → Session mode (si está habilitado)

Contacta a Supabase o verifica en Dashboard → Database Settings → Connection Pooling

---

## SOLUCIÓN 4: Configuración híbrida recomendada

Usa diferentes URLs según el entorno:

### En config/prismaClient.js:

```javascript
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Usa DIRECT_URL en producción para evitar pgBouncer
const connectionString = process.env.NODE_ENV === 'production' 
    ? process.env.DIRECT_URL 
    : process.env.DATABASE_URL;

const pool = new Pool({ 
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 5 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

module.exports = prisma;
```

---

## SOLUCIÓN 5: Agregar retry logic

Para mayor resiliencia en producción:

```javascript
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Retry de conexión
    connectionRetries: 5,
});

pool.on('error', (err) => {
    console.error('🔴 Unexpected pool error:', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
});

// Verificar conexión al iniciar
async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Prisma connected successfully');
    } catch (error) {
        console.error('❌ Prisma connection failed:', error);
        throw error;
    }
}

testConnection();

module.exports = prisma;
```

---

## Variables de Entorno en Render

Asegúrate de configurar en Render Dashboard → Environment:

```env
DATABASE_URL=postgresql://postgres.ukgtenyqajycwheucovn:[TU_PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ukgtenyqajycwheucovn:[TU_PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
NODE_ENV=production
PORT=10000
```

**IMPORTANTE:** NO incluyas el archivo .env en el repositorio (ya está en .gitignore)

---

## Diagnóstico adicional

Si después de aplicar Solución 1 sigues teniendo problemas:

1. **Verifica en logs de Render:**
   - ¿El adaptador se cargó correctamente?
   - ¿Hay errores de timeout diferentes?

2. **Prueba conexión manual:**
   ```bash
   # En Render Shell
   node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(r=>console.log(r.rows)).catch(e=>console.error(e)).finally(()=>p.end())"
   ```

3. **Verifica firewall de Supabase:**
   - Dashboard → Settings → Database → Network Restrictions
   - Asegúrate que IPs de Render no estén bloqueadas

---

## Sobre el Warning de RLS (Row Level Security)

El warning que mencionas sobre la tabla `_prisma_migrations`:

```sql
-- Ejecuta en Supabase SQL Editor
ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todo (solo para tabla de migrations)
CREATE POLICY "Allow all operations" ON _prisma_migrations
FOR ALL USING (true) WITH CHECK (true);
```

Esto es opcional pero elimina el warning. La tabla `_prisma_migrations` solo Prisma la usa internamente.
