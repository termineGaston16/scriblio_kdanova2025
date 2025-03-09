import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getTagsFromNote } from "../../Infraestructure/noteAPI";

export const useGetTagsFromNote = (id: string | null) => {
    return useQuery({
        queryKey: ['tagsTitle', id],
        queryFn: () => {
            if (typeof id !== 'string') return;
            return getTagsFromNote(id);
        },
        enabled: typeof id === 'string' && id.length > 0,
        gcTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 5,
        retryDelay: 5000,
        staleTime: 60 * 60 * 1000
    })
};