//The filesystem will act as our database for this project.

import fs from 'fs/promises';
import createHttpError from 'http-errors';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { CustomHttpError } from '../types';

type RetrieveConversationProps = {
    conversationId: string;
}

const CHAT_HISTORY_PATH = './chat-history/';

export const retrieveConversation = async ({ conversationId }: RetrieveConversationProps) => {

    //does the conversation exist?
    try {
        await fs.access(`${CHAT_HISTORY_PATH}${conversationId}.json`);
    } catch {
        return undefined;
    }

    try {
        const data = await fs.readFile(`${CHAT_HISTORY_PATH}${conversationId}.json`, 'utf8');
        const conversation = JSON.parse(data) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

        return conversation;
    } catch (err) {
        const customErr : CustomHttpError = { message: "Could not parse conversation", statusCode: 500}
        throw customErr;
    }
}

export const retrieveConversations = async () => {
    try{
        const files = await fs.readdir(CHAT_HISTORY_PATH);
        
        return files.map(f => f.replace('.json', ''));
    }catch{
        const customErr : CustomHttpError = { message: "Could not retrieve conversations", statusCode: 500}
        throw customErr;
    }
}

export const appendMessage = async (conversationId: string, message: string, type: "user" | "assistant") => {
    const conversation = await retrieveConversation({ conversationId });

    if (!conversation) {
        const customErr : CustomHttpError = { message: "Conversation not found", statusCode: 404}
        throw customErr;
    }

    const newMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
        role: type,
        content: message
    }

    conversation.push(newMessage);

    try {
        await fs.writeFile(`${CHAT_HISTORY_PATH}${conversationId}.json`, JSON.stringify(conversation));
        return conversation;
    } catch (err) {
        const customErr : CustomHttpError = { message: "Could not append message", statusCode: 500}
        throw customErr;
    }
}

export const createConversation = async (message: string) => {
    const conversationId = uuidv4();
    
    const newConversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'user', content: message }
    ]

    try {
        await fs.writeFile(`${CHAT_HISTORY_PATH}${conversationId}.json`, JSON.stringify(newConversation));
    } catch (err) {
        const customErr : CustomHttpError = { message: "Could not create conversation", statusCode: 500}
        throw customErr;
    }

    return conversationId;
}