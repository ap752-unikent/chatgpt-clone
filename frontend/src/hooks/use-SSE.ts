import { useEffect, useState, useRef, useMemo } from "react";

type Props = {
    chatId: string | undefined;
    messages: Message[];
};

export const useSSEChat = ({ chatId, messages}: Props) => {
    const [response, setResponse] = useState("");
    const [streamError, setStreamError] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const retryInterval = useRef(1000); 
    const maxInterval = 30000; 
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
            setStreamError("");
            retryInterval.current = 1000;
        };

        eventSource.onmessage = (event) => {
            setResponse((prev) => prev + event.data);
        };

        eventSource.onerror = (error) => {
            setIsConnected(false);
            setStreamError("Connection lost. Retrying...");

            eventSource.close();
            eventSourceRef.current = null;

            if (retryInterval.current < maxInterval) {
                setTimeout(() => {
                    retryInterval.current = Math.min(retryInterval.current * 2, maxInterval);
                    connectToSSE();
                }, retryInterval.current);
            } else {
                setStreamError("Failed to connect after multiple attempts.");
            }
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

    return { response, streamError, isConnected, disconnectFromSSE};
};
