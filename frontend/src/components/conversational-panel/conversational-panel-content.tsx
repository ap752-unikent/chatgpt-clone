import { useFetchConversations } from "@/hooks/use-fetch-conversations";
import { Button, IconButton, Stack, Text } from "@chakra-ui/react"
import { LuMessageCirclePlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const ConversationalPanelContent = () => {

    const { conversationsData } = useFetchConversations();
    const navigate = useNavigate();

    return (
        <Stack
            direction={"column"}
            flex={1}
            gap={8}
            p={4}
            overflowY={"auto"}
        >
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Text
                    fontSize={"lg"}
                    color={"gray.600"}
                >
                    Conversations
                </Text>
                <IconButton
                    aria-label="New conversation"
                    variant={"ghost"}
                    onClick={() => navigate("/")}
                >
                    <LuMessageCirclePlus />
                </IconButton>
            </Stack>
            <Stack
                gap={1}
            >
                {
                    conversationsData?.conversations.map((conversationId) => (
                        <Button
                            variant={"ghost"}
                            key={conversationId}
                            justifyContent={"flex-start"}
                            p={0}
                            m={0}
                            onClick={() => navigate(`/${conversationId}`)}
                        >
                            <Text>
                                {conversationId}
                            </Text>
                        </Button>
                    ))
                }
            </Stack>
        </Stack>
    )
}