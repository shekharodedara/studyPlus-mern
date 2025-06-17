const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendOTP,
  changePassword,
} = require("../controllers/auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");
const { auth } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
