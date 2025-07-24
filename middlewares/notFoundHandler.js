// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res, next) => {
    const error = new Error(`No se pudo encontrar la ruta - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { notFoundHandler };