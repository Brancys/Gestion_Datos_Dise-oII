// src/actions/userActions.js
const User = require('./usuario.model');
const createLogs = require('./logs.actions');
// const { createLog } = require('../../logss/logs/logs.actions');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const { createLog } = require('./logs.actions');

async function createUserBd(userData, file) {
  try {
    console.log(file)
    if (file) {
      const res = await cloudinary.uploader.upload(file.path, {
        public_id: "test-" + Date.now(),
      });
      userData.foto = res.public_id;  // Es mejor guardar la URL completa
    }

    const user = new User(userData);
    await user.save();

    if (user.foto) {
      user.foto = cloudinary.url(user.foto, {
        width: 500,
        height: 500,
        crop: "fill",
      });
    }
    // let data = {
    //   action: 'create',
    //   userId: user._id,
    //   nroDocumento: user.nroDocumento,
    //   tipoDocumento: user.tipoDocumento,
    // }
    // axios.post('http://localhost:3015/logs/create', data).then(function (response) {
    //   console.log("Exitoso en axios");
    // })
    //   .catch(function (error) {
    //     console.log("error en axios", error);
    //   });

    await createLog('create', user._id, user.nroDocumento, user.tipoDocumento);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateUserBd(nroDocumento, userData) {
  try {
    const updateData = {...userData};
    delete updateData.foto;  // Elimina la propiedad 'foto' de la copia

    const user = await User.findOneAndUpdate({ nroDocumento }, updateData, { new: true, runValidators: true });
    //const user = await User.findOneAndUpdate({ nroDocumento }, userData, { new: true, runValidators: true });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await createLog('update', user._id, nroDocumento, user.tipoDocumento, userData);
    //return res.status(200).json(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function deleteUserBd(nroDocumento) {
  try {
    const user = await User.findOneAndDelete({ nroDocumento });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    await createLog('delete', user._id, nroDocumento, user.tipoDocumento, null);
    //return res.status(200).json(user);
    console.log("Usuario eliminado correctamente");
    console.log(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createUserBd, updateUserBd, deleteUserBd };