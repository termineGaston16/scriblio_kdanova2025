import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getNoteByID } from "../../Infraestructure/noteAPI";

export const useGetNoteByID = (id: string | null) => {
    return useQuery({
        queryKey: ['note', id],
        queryFn: () => {
            if (typeof id !== 'string') return;
            return getNoteByID(id);
        },
        enabled: typeof id === 'string' && id.length > 0,
        gcTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 2000,
        staleTime: 60 * 60 * 1000
    })
};