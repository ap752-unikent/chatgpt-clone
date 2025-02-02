import { fetchConversations } from "@/utils/api-client";
import { useQuery } from "react-query";

export const useFetchConversations = () => {
    const { data: conversationsData, isLoading: conversationsDataLoading, error: conversationsDataError } = useQuery<{conversations: string[]}>(['fetchConversations'],
        () => fetchConversations());

    return { conversationsData, conversationsDataLoading, conversationsDataError };
}