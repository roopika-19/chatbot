import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { configureOpenAI } from "../config/openai-config";
import OpenAIApi, {  ClientOptions } from "openai";
import  createChatCompletion from "openai";
export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).json({
                message: "User not registered OR Token malfunctioned",
            });
// grab the chat
interface ChatMessage {
    content: string;
    role: string;
}

// Map user.chats to chats array
const chats: ChatMessage[] = user.chats.map(({ role, content }) => ({
    role,
    content,
}));

// Push a new message to chats array
chats.push({ role: "user", content: message });

// Also push the new message to user.chats array
user.chats.push({ content: message, role: "user" });

        const config = configureOpenAI();
        const openai = new OpenAIApi({
            apiKey: config.apiKey,
        });

        const chatResponse = new createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        } as ClientOptions);
        const response = chatResponse.chat
        console.log(response);
        


        user.chats.push(chatResponse);
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

// export const deleteChats = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const user = await User.findById(res.locals.jwtData.id);
//         if (!user) {
//             return res.status(401).send("User not registered OR Token malfunctioned");
//         }
//         if (user._id.toString() !== res.locals.jwtData.id) {
//             return res.status(401).send("Permissions didn't match");
//         }
//         interface ChatMessage {
//             id: string;
//             role: string;
//             content: string;
//         }
//         user.chats = []as ChatMessage[];
//         await user.save();
//         return res.status(200).json({ message: "OK" });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "ERROR", cause: error.message });
//     }
// };
