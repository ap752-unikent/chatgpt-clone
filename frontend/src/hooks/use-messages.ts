import { useEffect, useMemo } from "react";
import { useSSEChat } from "./use-SSE";
import { useFetchChat } from "./use-fetch-chat";

type Props = {
    chatId: string | undefined;
    conversation: Message[];
    setConversation: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useMessages = ({
    chatId,
    conversation,
    setConversation
}: Props) => {
    const { response: sseResponse, isConnected, disconnectFromSSE, streamError} = useSSEChat({ chatId, messages: conversation });
    const { chatData } = useFetchChat({ chatId });

    useEffect(() => {
        setConversation(chatData?.conversation || []);
    }, [chatData]);

    useEffect(() => {
        const isUserLastMessage = conversation.length > 0 && conversation[conversation.length - 1].role === "user";
        if (isUserLastMessage) {
            setConversation((current) => [...current, { content: "", role: "loading" }]);
        }
    }, [conversation]);

    const messagesWithAssistantStream = useMemo(() => {

        if (sseResponse.length < 1) {
            return conversation;
        }

        return conversation.filter(m => m.role !== "loading").concat({
            content: sseResponse,
            role: "assistant"
        });
    }, [conversation, sseResponse]);

    const loading = useMemo(() => {

        return {
            loading: messagesWithAssistantStream.length > 0 && messagesWithAssistantStream[messagesWithAssistantStream.length - 1].role === "loading",
            isStreaming: isConnected    
        }

    }, [messagesWithAssistantStream, isConnected]);

    return { messages: messagesWithAssistantStream, loading, disconnectFromSSE, streamError};
}