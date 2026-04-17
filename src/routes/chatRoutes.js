const router = require("express").Router();
const { askQuestion, createChat, getChatById, getChatHistory, sendMessage } = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");
const AppError = require("../utils/appError");

const validateCreateChat = (req, res, next) => {
	const { message } = req.body;

	if (typeof message !== "string") {
		return next(new AppError(400, "Message must be a string"));
	}

	const trimmedMessage = message.trim();

	if (!trimmedMessage) {
		return next(new AppError(400, "Message is required"));
	}

	req.body = {
		...req.body,
		message: trimmedMessage,
	};

	return next();
};

router.get("/history", auth, getChatHistory);
router.get("/:id", auth, getChatById);
router.post("/", auth, validateCreateChat, askQuestion);
router.post("/create", auth, validateCreateChat, createChat);
router.post("/ask", auth, validateCreateChat, askQuestion);
router.post("/send", auth, validateCreateChat, sendMessage);

module.exports = router;