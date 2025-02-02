import { fetchChat } from "@/utils/api-client";
import { useQuery } from "react-query";

type Props = {
    chatId: string | undefined;
}

export const useFetchChat = ({chatId} : Props) => {
    const { data: chatData, isLoading: chatDataLoading, error: chatDataError } = useQuery<{conversation: Message[]}>(['fetchChat', chatId],
        () => fetchChat({ chatId }),
        { enabled: !!chatId });

    return { chatData, chatDataLoading, chatDataError };
}