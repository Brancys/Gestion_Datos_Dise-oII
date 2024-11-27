// src/controllers/userController.js
const { createUserBd, updateUserBd, deleteUserBd } = require('./crear.actions');

// Controlador para manejar la creación de usuario
async function createUser(req, res){
  try {
    const data = { ...req.body };
    const user = await createUserBd(data, req.file);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function updateUser(req, res){
  try {
    const user = await updateUserBd(req.params.nroDocumento, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function deleteUser(req, res){
  try {
    const user = await deleteUserBd(req.params.nroDocumento);
    res.status(200).json({ message: 'Usuario eliminado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser, updateUser, deleteUser };
