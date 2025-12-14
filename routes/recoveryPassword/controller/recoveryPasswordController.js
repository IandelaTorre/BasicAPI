const { getUserByEmail } = require("../../users/models/users");
const { updatePassword } = require("../model/recoveryPassword");

exports.recoveryPassword = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await getUserByEmail(data.email);
    if(!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if(data.recoveryCode === "123456") {
      const userUpdated = await updatePassword(user.uuid, data.newPassword);
      return res.status(200).json({ message: "Contraseña actualizada correctamente", data: userUpdated });
    }
    
    return res.status(400).json({ message: "Código de recuperación inválido" });
  } catch (error) {
    next(error);
  }
}