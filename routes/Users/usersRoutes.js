const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/userController')
const adminAuthorization = require('../../middlewares/Auth')
const AMauthorization = require('../../middlewares/AuthAM')
const upload = require('../../middlewares/Cloudinary')


router.post ('/users',upload.single('user_image'), userControllers.createUser)

router.post ('/users/login', userControllers.loginUser)

router.get('/use', userControllers.searchForUsers)

router.get('/users/sortedBy', userControllers.sortUsers)

router.get('/users/:id', userControllers.getUsersId)

router.put('/users/:id',upload.single('user_image'), userControllers.updateUser)

router.delete('/users/:id', userControllers.deleteUser)

router.post('/refresh/token', userControllers.refreshTokens)

router.get('/allUsers', userControllers.getAllUsers)

router.post('/users/password/reset',userControllers.resetRquist)

router.get('/users/password/reset/verify/:token', userControllers.verifyResetToken)

router.post('/users/password/reset/update/:token', userControllers.setNewPass)


module.exports = router