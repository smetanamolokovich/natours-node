const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/update-current-user',
  authController.protect,
  userController.updateCurrentUser
);
router.delete(
  '/delete-current-user',
  authController.protect,
  userController.deleteCurrentUser
);

router.route('/').get(userController.getAllUsers);
//.post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
