import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getBodyNoteByID } from "../../Infraestructure/note_bodyAPI";

export const useGetBodyNoteByID = (idNote: string | null) => {
    return useQuery({
        queryKey: ['noteBody', idNote],
        queryFn: () => {
            if (typeof idNote !== 'string' || idNote.length <= 0) return null;
            return getBodyNoteByID(idNote);
        },
        enabled: typeof idNote === 'string' && idNote.length > 0,
        gcTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 5,
        retryDelay: 3000,
        staleTime: 60 * 60 * 1000
    })
}