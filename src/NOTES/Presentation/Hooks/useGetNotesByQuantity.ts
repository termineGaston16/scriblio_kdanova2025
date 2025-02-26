import { useQuery } from "react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"

export const useGetNotesByQuantity = (lastID: string | null) => {
    return useQuery({
        queryKey: ['notes', lastID],
        queryFn: () => getNotesByQuantity(lastID),
        cacheTime: 60 * 60 * 1000,
        enabled: !lastID || typeof lastID === 'string',
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
}