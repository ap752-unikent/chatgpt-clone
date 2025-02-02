import { Stack } from "@chakra-ui/react"
import { ConversationalPanelContent } from "./conversational-panel-content"

export const ConversationalPanel = () => {

    return (
        <Stack
            minW={"30%"}
            h={"100%"}
            bg={"gray.100"}
        >
            <ConversationalPanelContent />
        </Stack>
    )
}