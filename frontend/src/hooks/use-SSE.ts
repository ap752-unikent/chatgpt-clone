import { useEffect, useState, useRef, useMemo } from "react";

type Props = {
    chatId: string | undefined;
    messages: Message[];
};

export const useSSEChat = ({ chatId, messages}: Props) => {
    const [response, setResponse] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (messages.length > 0) {
            setResponse("");
        }
    }, [messages])

    const shouldConnectToSSE = useMemo(() => {
        return chatId && messages.length > 0 && (messages[messages.length - 1].role !== "assistant");
    }, [chatId, messages]);

    const connectToSSE = () => {

        if (!shouldConnectToSSE) {
            return;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(`http://localhost:3000/chat/stream/${chatId}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            setResponse((prev) => prev + event.data);
        };

        eventSource.onerror = () => {
            setIsConnected(false);
        };
    };

    const disconnectFromSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }

    useEffect(() => {
        connectToSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [chatId, messages]);

    return { response, isConnected, disconnectFromSSE};
};
