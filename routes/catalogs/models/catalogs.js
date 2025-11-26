const prisma = require("../../../config/prismaClient")



exports.getAllRols = async() => {
    return await prisma.cat_Rols.findMany({
        where: {
            enabled: true
        }
    })
}

exports.getRolByUuid = async(uuid) => {
    return await prisma.cat_Rols.findUnique({
        where: {
            uuid: uuid,
            enabled: true
        }
    })
}