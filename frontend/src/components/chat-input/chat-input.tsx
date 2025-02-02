import { IconButton, Input, Spinner } from "@chakra-ui/react"
import { InputGroup } from "../ui/input-group"
import { IoSend } from "react-icons/io5";
import { useEffect, useMemo } from "react";
import { IoStop } from "react-icons/io5";

type Props = {
    value: string;
    onInputChange: (value: string) => void;
    handleSendMessage: () => void;
    isLoading: {
        loading: boolean;
        isStreaming: boolean;
    };
    onStop: () => void;
}

export const ChatInput = ({
    onInputChange,
    handleSendMessage,
    value,
    isLoading,
    onStop
} : Props) => {

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if(e.key === "Enter"){
                handleSendMessage();
            }
        }
        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        }
    }, [handleSendMessage])

    const loadingSpinner = (
        <Spinner 
            size={"sm"}
            color={"blue.500"}
        />
    )

    const stopButton = (
        <IconButton
            aria-label="Stop loading"
            size={"sm"}
            variant={"ghost"}
            onClick={onStop}
        >
            <IoStop 
                size={16}
            />
        </IconButton>
    )

    const sendButton = (
        <IconButton
            aria-label="Send message"
            size={"sm"}
            variant={"ghost"}
            onClick={handleSendMessage}
        >
            <IoSend 
                size={16}
            />
        </IconButton>
    )

    const endAdornment = useMemo(() => {
        if(isLoading.loading){
            return loadingSpinner;
        }

        if(isLoading.isStreaming){
            return stopButton;
        }

        return sendButton;
    }, [isLoading])

    return (
        <InputGroup
            endElement={endAdornment}
            marginX={4}
        >
            <Input
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                size={"lg"}
                borderRadius={"md"}
                placeholder="Write a message..." 
                paddingX={4}
            >
            </Input>      
        </InputGroup>

    )
}