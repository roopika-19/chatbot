import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import {
  //deleteChats,
  generateChatCompletion,
  sendChatsToUser,
} from "../controllers/chat.js";

//Protected API
const chatRoutes = Router();
chatRoutes.post( //goes to this only if token verified
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
//chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;