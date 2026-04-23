const router = require("express").Router();
const { askQuestion, createChat, getChatById, getChatHistory, sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
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

router.get("/history", authMiddleware.required, getChatHistory);
router.get("/:id", authMiddleware.required, getChatById);
router.post("/", authMiddleware.required, validateCreateChat, askQuestion);
router.post("/create", authMiddleware.required, validateCreateChat, createChat);
router.post("/ask", authMiddleware.required, validateCreateChat, askQuestion);
router.post("/send", authMiddleware.required, validateCreateChat, sendMessage);

module.exports = router;