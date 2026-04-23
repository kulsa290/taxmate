const router = require("express").Router();
const { getProfile, updateProfile, addTaxCalculation, getTaxHistory } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.required, getProfile);
router.put("/", authMiddleware.required, updateProfile);
router.post("/tax-calculation", authMiddleware.required, addTaxCalculation);
router.get("/tax-history", authMiddleware.required, getTaxHistory);

module.exports = router;