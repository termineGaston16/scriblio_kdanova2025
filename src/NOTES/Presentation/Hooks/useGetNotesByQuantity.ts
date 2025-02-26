import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"

export const useGetNotesByQuantity = (lastID: string | null) => {
    return useQuery({
        queryKey: ['notes', lastID],
        queryFn: () => getNotesByQuantity(lastID),
        gcTime: 60 * 60 * 1000,
        enabled: !lastID || typeof lastID === 'string',
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
}