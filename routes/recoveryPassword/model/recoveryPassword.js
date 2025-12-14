const prisma = require('../../../config/prismaClient');
const { hashPassword } = require('../../../utils/passwordUtils');



exports.updatePassword = async (uuid, newPassword) => {
    return await prisma.user.update({
        where: {
            uuid: uuid
        },
        data: {
            password: await hashPassword(newPassword)
        }
    })
}
