import { Spinner, Stack, Text } from "@chakra-ui/react"
import { useRef } from "react";
import Markdown from "react-markdown";

export const Message = ({
    content,
    role
}: Message) => {

    const ref = useRef<HTMLDivElement>(null);
    if (role !== "assistant" && role !== "user" && role !== "loading") {
        return null;
    }

    return (
        <Stack
            direction={"row"}
            gap={4}
            ref={ref}
            marginY={2}
        >
            <Text
                fontWeight={"bold"}
                fontSize={"md"}
                color={"gray.600"}
            >
                {role === "assistant" || role === "loading" ? "Agent" : "You"}
            </Text>
            <Stack
                direction={"column"}
                gap={2}
            >
                {
                    role === "loading" ? (
                        <Spinner 
                            size={"sm"}
                            color={"gray.600"}
                        />
                    ) :
                    content.split("<br>").map((line, index) => (
                        <Markdown
                            key={index}
                        >
                            {line}
                        </Markdown>
                    ))
                }
            </Stack>
        </Stack>
    )
}