import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], 
) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true
    });

    return response;
}

export const parseChunk = async (chunk: OpenAI.Chat.Completions.ChatCompletionChunk) => {
    return chunk.choices[0]?.delta?.content || "";
}
