import { Request, Response } from "express";
import { createConversation, retrieveConversation, appendMessage, retrieveConversations } from "../services/database";
import { CustomHttpError } from "../types";
import { chat, parseChunk } from "../services/openai";

export const createChat = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const conversationId = await createConversation(message);

        res.status(200).json({
            conversationId
        });
    } catch (e) {
        const err = e as CustomHttpError;
        res.status(err.statusCode).json({ message: err.message });
    }
}

export const retrieveChat = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const conversation = await retrieveConversation({ conversationId });

        if (!conversation) {
            throw {
                message: "Conversation not found",
                statusCode: 404
            }
        }

        res.status(200).json({ conversation });
    } catch (e) {
        const err = e as CustomHttpError;
        res.status(err.statusCode).json({ message: err.message });
    }
}

export const retrieveChats = async (req: Request, res: Response) => {
    try {
        const conversations = await retrieveConversations();

        res.status(200).json({ conversations });
    } catch (e) {
        const err = e as CustomHttpError;
        res.status(err.statusCode).json({ message: err.message });
    }
}

export const updateChat = async (req: Request, res: Response) => {
    try {
        const { conversationId, message } = req.body;
        const updatedConversation = await appendMessage(conversationId, message, "user");

        res.status(200).json(updatedConversation);
    } catch (e) {
        const err = e as CustomHttpError;
        res.status(err.statusCode).json({ message: err.message });
    }
}

export const streamChat = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const conversation = await retrieveConversation({ conversationId });
        let assistantMessage = "";

        if (!conversation) {
            throw {
                message: "Conversation not found",
                statusCode: 404
            }
        }

        if(conversation[conversation.length - 1].role === "assistant") {
            throw {
                message: "Conversation already completed",
                statusCode: 400
            }
        }

        const response = await chat(conversation);

        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        res.on('close', () => {
            appendMessage(conversationId, assistantMessage, "assistant");
            res.end();
        })

        for await (const chunk of response) {
            const data = await parseChunk(chunk);
            const formattedData = data.replace(/\n/g, "<br>");
            assistantMessage += formattedData;
            res.write(`data: ${formattedData}\n\n`);
        }

        res.end();
    } catch(e) {
        const err = e as CustomHttpError;
        res.status(err.statusCode).json({ message: err.message });
    }
}