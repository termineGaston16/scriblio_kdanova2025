import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"

export const useGetNotesByQuantity = (
    lastID: string | null,
    classStyle: string | null
) => {
    return useQuery({
        queryKey: ['notes', lastID ?? 'none'],
        queryFn: () => getNotesByQuantity(lastID),
        gcTime: 60 * 60 * 1000,
        enabled: !classStyle && (!lastID || typeof lastID === 'string'),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
}