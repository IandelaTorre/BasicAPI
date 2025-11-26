// routes/users/controller/userController.js
const {
  getUserByEmail,
  getUserByUuid,
  createUser,
  editUser,
  deleteUser
} = require("../models/users");

exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const user = await getUserByUuid(uuid);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const userData = req.body;

    const user = await editUser(uuid, userData);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const user = await deleteUser(uuid);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
