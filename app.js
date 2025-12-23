require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser')
const routes = require('./routes/v1');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

const app = express();

const maskDbUrl = (s = "") => s.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");

console.log("DATABASE_URL:", maskDbUrl(process.env.DATABASE_URL || ""));
console.log("DIRECT_URL:", maskDbUrl(process.env.DIRECT_URL || ""));


const { loadRolePermissions } = require('./utils/permissionService');
loadRolePermissions()
    .then(() => console.log('✔ Permisos cargados desde BD'))
    .catch(err => {
        console.error('❌ No se pudieron cargar permisos:', err);
        // process.exit(1);      
    });

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware de seguridad
app.use(helmet()); // Establece cabeceras de seguridad HTTP

// Habilitar CORS con configuraciones personalizadas
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Permitir desde dominios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['Content-Type,Authorization'],
    credentials: true
}));

// Compresión de respuestas
app.use(compression());

// Limitar el número de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // Limita cada IP a 500 solicitudes por 'windowMs'
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde'
});
app.use(limiter);

// Modificar cookies
app.use(cookieParser());

// Logger de peticiones HTTP
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Parsear JSON y formularios
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Definir rutas
app.use('/api/v1', routes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Manejo de errores global
app.use(errorHandler);

module.exports = app;
