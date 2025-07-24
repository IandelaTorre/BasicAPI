const { getUserByEmail, getUserByUuid, createUser, editUser, deleteUser } = require("../models/users");


exports.getUserByEmail = (req, res, next) => {
    const { email } = req.params;
    const { user_uuid } = req.query;

    getUserByEmail(email)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);

            // Log después de responder
            return setUserLog(email, "get user by email", user_uuid);
        })
        .then(() => {
            console.log("User log updated");
        })
        .catch(err => {
            next(err);
        })
}

exports.getUser = (req, res, next) => {
    const { uuid } = req.params;
    const { user_uuid } = req.query;

    getUserByUuid(uuid)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);

            // Log después de responder
            return setUserLog(uuid, "get user by uuid", user_uuid);
        })
        .then(() => {
            console.log("User log updated");
        })
        .catch(err => {
            next(err);
        })
}

exports.createUser = (req, res, next) => {
    const userData = req.body;
    const { user_uuid } = req.query;
    createUser(userData)
        .then(user => {
            res.status(201).json(user);

            // Log después de responder
            return setUserLog(userData.email, "create user", user_uuid);
        })
        .then(() => {
            console.log("User log updated");
        })
        .catch(err => {
            next(err);
        })
    }

exports.editUser = (req, res, next) => {
    const { uuid } = req.params;
    const userData = req.body;

    editUser(uuid, userData)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(user);

            // Log después de responder
            return setUserLog(uuid, "edit user", userData.user_uuid);
        })
        .then(() => {
            console.log("User log updated");
        })
        .catch(err => {
            console.error("Error editing user or saving log:", err);
            next(err);
        });
};


exports.deleteUser = (req, res, next) => {
    const { uuid } = req.params; 
    const { user_uuid } = req.query;

    console.log("params: ", uuid, user_uuid);
    

    deleteUser(uuid)
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }
        res.status(204).send();

        // Log después de responder
            return setUserLog(uuid, "delete user", user_uuid);
    })
    .then(() => {
        console.log("User log updated");
    })
    .catch(err => {
        next(err);
    })
}