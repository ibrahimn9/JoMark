const express = require("express");
const {validateUser,validateEmailAndFullname} = require("../utils/validator/signupValidator");
const {SignUp,confirmation, sendEmailVerification,login,sendEmailOfForgotPassword,setNewPw}= require("../controllers/auth");
const router = express.Router();

/**-----------------------------------------------
 * @desc    Send Email For New User
 * @route   /api/auth/sendEmail
 * @method  POST
 * @access  public
------------------------------------------------*/
router.post('/sendEmail',validateEmailAndFullname,sendEmailVerification);

/**-----------------------------------------------
 * @desc    SignUp new user
 * @route   /api/auth/signup
 * @method  POST
 * @access  public
------------------------------------------------*/

router.post('/signup',validateUser,SignUp);

/**-----------------------------------------------
 * @desc    confirmation of code
 * @route   /api/auth/confirmation
 * @method  POST
 * @access  public
------------------------------------------------*/

router.post('/confirmation',confirmation);

/**-----------------------------------------------
 * @desc    login
 * @route   /api/auth/login
 * @method  POST
 * @access  public
------------------------------------------------*/
router.post('/login',login);
/**-----------------------------------------------
 * @desc    email verification for forgot password
 * @route   /api/auth/sendEmail/forgotPw
 * @method  POST
 * @access  public
------------------------------------------------*/

router.post('/sendEmail/forgotPw',sendEmailOfForgotPassword);

/**-----------------------------------------------
 * @desc    reset password
 * @route   /api/auth/changePassword
 * @method  PUT
 * @access  public
------------------------------------------------*/
router.put('/changePassword',setNewPw);



module.exports = router;