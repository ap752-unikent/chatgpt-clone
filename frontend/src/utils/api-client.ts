type ApiClientProps = {
    url: string,
    method: string,
    body?: any,
}

const apiClient = async ({ url, method, body}: ApiClientProps) => {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
    }

    return response.json();
}

type CreateChatProps = {
    initialMessage: string,
}

export const createChat = async ({initialMessage} : CreateChatProps) => {
    const url = `http://localhost:3000/chat/create`
    const responseJson = await apiClient({ 
        url,
        method: 'POST',
        body: { message: initialMessage }
    });

    return responseJson as { conversationId: string };
}

type UpdateChatProps = {
    chatId: string | undefined,
    message: string,
}

export const updateChat = async ({chatId, message} : UpdateChatProps) => {
    const url = `http://localhost:3000/chat/update`
    const responseJson = await apiClient({ 
        url,
        method: 'POST',
        body: { 
            message,
            conversationId: chatId 
        }
    });

    return responseJson as Message[];
}

type RetrieveChatProps = {
    chatId: string | undefined,
}

export const fetchChat = async ({chatId} : RetrieveChatProps) => {
    const url = `http://localhost:3000/chat/retrieve/${chatId}`
    const responseJson = await apiClient({ url, method: 'GET' });

    return responseJson;
}

export const fetchConversations = async () => {
    const url = `http://localhost:3000/chat/conversations`
    const responseJson = await apiClient({ url, method: 'GET' });

    return responseJson as { conversations: string[] };
}