import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@chakra-ui/react";
import { ChatWindow } from "@/components/chat-window/chat-window";
import { ChatInput } from "@/components/chat-input/chat-input";
import { ConversationalPanel } from "@/components/conversational-panel/conversational-panel";
import { useEffect, useMemo, useState } from "react";
import { createChat, updateChat } from "@/utils/api-client";
import { useQueryClient } from "react-query";
import { useMessages } from "@/hooks/use-messages";

export const Main = () => {

    const [userMessage, setUserMessage] = useState("");
    const [conversation, setConversation] = useState<Message[]>([]);
    const { chatId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        handleStop();
        setUserMessage("");
        setConversation([]);
      }, [location.pathname]);

    const { messages, loading, disconnectFromSSE } = useMessages({ chatId, conversation, setConversation });
    const newChat = useMemo(() => conversation.length === 0, [conversation]);

    const handleSendMessage = () => {
        if (newChat) {
            queryClient.invalidateQueries("fetchConversations");
            createChat({ initialMessage: userMessage }).then((data) => {
                navigate(`/${data.conversationId}`);
            });
        } else {
            updateChat({ chatId, message: userMessage }).then((conversation) => {
                setConversation([...conversation]);
            });
        }

        setUserMessage("");
    }

    const handleStop = () => {
        disconnectFromSSE();
    }

    return (
        <Stack
            direction={"row"}
            w={"100vw"}
            h={"100vh"}
        >
            <ConversationalPanel />
            <Stack
                direction={"column"}
                justifyContent={"flex-start"}
                w={"100%"}
            >
                <ChatWindow
                    messages={messages}
                />
                <ChatInput
                    handleSendMessage={handleSendMessage}
                    onInputChange={setUserMessage}
                    value={userMessage}
                    isLoading={loading}
                    onStop={handleStop}
                />
            </Stack>
        </Stack>
    )
}