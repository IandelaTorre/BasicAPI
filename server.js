// server.js
const app = require('./app');
const PORT = process.env.PORT || 3010;

// Evita arrancar en tests
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}