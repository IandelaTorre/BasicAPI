const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'basic-backend-secret';

const generateToken = (user, time = 1) => {
    return jwt.sign(
        {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            rolId: user.id,
            rol: user.rol.name
        },
        JWT_SECRET,
        { expiresIn: `${time}d` }
    );
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido o expirado' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { generateToken, verifyToken };