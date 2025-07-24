const deleteWordError = (text) => text.replace("Error:", "").trim();

// Middleware para manejar errores globalmente
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status ?? (res.statusCode === 200 ? 500 : res.statusCode);
    res.status(statusCode);
    res.json({
        message: deleteWordError(err.toString()),
        stack: process.env.NODE_ENV === 'development' ? err.stack : {} // Mostrar el stack solo en dev
    });
};

module.exports = { errorHandler };
