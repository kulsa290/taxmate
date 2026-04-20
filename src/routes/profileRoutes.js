const router = require("express").Router();
const { getProfile, updateProfile, addTaxCalculation, getTaxHistory } = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/tax-calculation", auth, addTaxCalculation);
router.get("/tax-history", auth, getTaxHistory);

module.exports = router;