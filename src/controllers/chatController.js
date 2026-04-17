const OpenAI = require("openai");
const mongoose = require("mongoose");
const Chat = require("../models/chat");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getOpenAIModel = () => process.env.OPENAI_MODEL || "gpt-4o-mini";

const formatChat = (chat) => ({
  id: chat._id,
  userId: chat.userId,
  question: chat.question || chat.message,
  answer: chat.answer || chat.response,
  createdAt: chat.createdAt,
  updatedAt: chat.updatedAt,
});

const getOpenAIErrorResponse = (err) => {
  if (err.message === "OPENAI_API_KEY is not configured") {
    return {
      status: 500,
      message: "OPENAI_API_KEY is not configured",
    };
  }

  if (err.status === 401) {
    return {
      status: 502,
      message: "OpenAI authentication failed. Check OPENAI_API_KEY.",
    };
  }

  if (err.status === 403) {
    return {
      status: 502,
      message: "OpenAI request was denied",
    };
  }

  if (err.status === 429 || err.code === "insufficient_quota") {
    return {
      status: 429,
      message: "OpenAI rate limit or quota exceeded. Please try again later.",
    };
  }

  if (err.status === 400) {
    return {
      status: 400,
      message: err.message || "OpenAI rejected the request",
    };
  }

  if (err.status >= 500) {
    return {
      status: 502,
      message: "OpenAI service is currently unavailable",
    };
  }

  return {
    status: 500,
    message: err.message || "Failed to process chat message",
  };
};

const askQuestion = async (req, res, next) => {
  try {
    const { message } = req.body;
    const openai = getOpenAIClient();

    console.log("[chat/create] Generating AI response for authenticated user:", req.user.id);

    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian tax consultant. Answer questions about GST, Income Tax, and business compliance. Keep answers simple, practical, and beginner-friendly. Use Hinglish when it helps the user understand better.",
        },
        { role: "user", content: message },
      ],
    });

    const aiResponse = completion.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return next(new AppError(502, "OpenAI returned an empty response"));
    }

    // Persist the conversation so the user can access chat history later.
    await Chat.create({
      userId: req.user.id,
      question: message,
      answer: aiResponse,
    });

    return res.status(201).json({
      success: true,
      data: {
        reply: aiResponse,
      },
    });
  } catch (err) {
    const errorResponse = getOpenAIErrorResponse(err);
    return next(new AppError(errorResponse.status, errorResponse.message));
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      Chat.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Chat.countDocuments({ userId: req.user.id }),
    ]);

    return sendSuccess(res, 200, "Chat history fetched successfully", {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      chats: chats.map(formatChat),
    });
  } catch (err) {
    return next(new AppError(500, "Failed to fetch chat history"));
  }
};

const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(400, "Invalid chat id"));
    }

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!chat) {
      return next(new AppError(404, "Chat not found"));
    }

    return sendSuccess(res, 200, "Chat fetched successfully", {
      chat: formatChat(chat),
    });
  } catch (err) {
    return next(new AppError(500, "Failed to fetch chat"));
  }
};

module.exports = {
  askQuestion,
  createChat: askQuestion,
  getChatById,
  getChatHistory,
  sendMessage: askQuestion,
};