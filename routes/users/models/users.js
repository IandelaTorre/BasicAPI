const prisma = require('../../../config/prismaClient');

const moment = require('moment-timezone');
const { hashPassword } = require('../../../utils/passwordUtils');

exports.getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }, 
        include: {
            rol: true
        }
    });
}

exports.getUserByUuid = async (uuid) => {
    return await prisma.user.findUnique({
        where: {
            uuid: uuid
        }
    })
}

exports.createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            ...userData, 
            password: await hashPassword(userData.password)
        }
    });
}

exports.editUser = async (uuid, userData) => {
    return await prisma.user.update({
        where: {
            uuid: uuid
        }, 
        data: userData
    })
}

exports.deleteUser = async (uuid) => {
    return await prisma.user.update({
        where: {
            uuid: uuid
        }, 
        data: {
            enabled: false,
        }
    })
}