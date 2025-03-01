import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"
import { Note_I } from "../../Domain/note";

export const useGetNotesByQuantity = (
    lastID: string | null,
    classStyle: string | null
) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const newNotes = await getNotesByQuantity(lastID);

            // 🔥 Fusionar nuevas notas en caché
            queryClient.setQueryData(['notes'], (oldNotes: Note_I[]) => {
                if (!oldNotes || oldNotes.length <= 0) return [...newNotes];
                return [...oldNotes, ...newNotes];
            });

            return queryClient.getQueryData(['notes']) as Note_I[];
        },
        gcTime: 60 * 60 * 1000,
        enabled: !classStyle && (!lastID || typeof lastID === 'string'),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    });
};
