require('dotenv').config();
const { generateToken } = require('../../../config/jwtConfig');
const { comparePassword } = require('../../../utils/passwordUtils');
const { getUserByEmail } = require('../../users/models/users');

exports.LoginSession = async (req, res, next) => {
    try {
        const { user, password, time } = req.body;

        const loginUser = await getUserByEmail(user.trim(), 'ebe29750-9807-47b8-b68b-b3f5b2f61e97');

        if (loginUser) {
            const correctPassword = await comparePassword(password.trim(), loginUser.password);

            if (correctPassword) {
                const sessionToken = generateToken(loginUser, time)

                loginUser.password = undefined;

                res
                    .status(200)
                    .header('Authorization', `Bearer ${sessionToken}`)
                    .json(loginUser);
            } else {
                res.status(503).json({ usuario: "La contraseña no coincide con nuestros registros. Por favor, verifica e intenta nuevamente." });
            }
        } else {
            res.status(503).json({ usuario: "No encontramos este usuario. Por favor, verifica que esté escrito correctamente." });
        }
    } catch (error) {
        next(error);
    }
};
