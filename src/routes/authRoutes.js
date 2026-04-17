const router = require("express").Router();
const { register, login, getProfile, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validationMiddleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", auth, logout);
router.get("/me", auth, getProfile);

module.exports = router;