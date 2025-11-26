const { getAllRols, getRolByUuid } = require("../models/catalogs")



exports.findRols = async (req, res, next) => {
    try {
        const rols = await getAllRols();
        return res.status(200).json(rols);
    } catch (error) {
        next(error);
    }
}

exports.findRolByUuid = async (req, res, next) => {
    try {
        const { uuid } = req.params;
        const rol = await getRolByUuid(uuid);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        return res.status(200).json(rol);
    } catch (error) {
        next(error);
    }
}