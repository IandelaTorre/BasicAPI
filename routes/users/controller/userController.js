const { getUserByEmail, getUserByUuid, createUser, editUser, deleteUser, setUserLog } = require("../models/users");


exports.getUserByEmail = async (req, res, next) => {
    const { email } = req.params;
    const { user_uuid } = req.query;

    getUserByEmail(email)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);

            return setUserLog("get user by email", user_uuid)
                .catch(err => {
                    console.error("Error al guardar log:", err);
                });
        })
        .catch(err => {
            next(err);
        });
}

exports.getUser = async (req, res, next) => {
    const { uuid } = req.params;
    const { user_uuid } = req.query;

    getUserByUuid(uuid)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);

            return setUserLog("get user by uuid", user_uuid)
            .catch(err => {
                console.error("Error al guardar log:", err);
            });
        })
        .catch(err => {
            next(err);
        })
}

exports.createUser = async (req, res, next) => {
    const userData = req.body;
    const { user_uuid } = req.query;
    createUser(userData)
        .then(user => {
            res.status(201).json(user);

            return setUserLog("create user", user_uuid)
            .catch(err => {
                console.error("Error al guardar log:", err);
            });
        })
        .catch(err => {
            next(err);
        })
    }

exports.editUser = async (req, res, next) => {
    const { uuid } = req.params;
    const { user_uuid } = req.query;
    const userData = req.body;

    editUser(uuid, userData)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);

            return setUserLog("edit user", user_uuid)
            .catch(err => {
                console.error("Error al guardar log:", err);
            });
        })
        .catch(err => {
            next(err);
        });
};


exports.deleteUser = async (req, res, next) => {
    const { uuid } = req.params; 
    const { user_uuid } = req.query;

    deleteUser(uuid)
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }
        res.status(204).send();

        return setUserLog("delete user", user_uuid)
        .catch(err => {
            console.error("Error al guardar log:", err);
        })
    })
    .catch(err => {
        next(err);
    })
}