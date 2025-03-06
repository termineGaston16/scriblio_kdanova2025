import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "../../Infraestructure/noteAPI"
import { toast } from "sonner";
import { Note_I } from "../../Domain/note";

export const useDeleteNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onMutate: async (id: string) => {

            await queryClient.cancelQueries({ queryKey: ['bruteNotes'] });

            const bruteNotesCache = queryClient.getQueryData<InfiniteData<Note_I[]>>(['bruteNotes']);
            if (!bruteNotesCache) return;

            const pagesFiltred = bruteNotesCache.pages.flat();

            const index = pagesFiltred.findIndex(nota => nota.id === id);
            if (index < 0) return { previousCache: undefined };

            const newPages = [...pagesFiltred];
            newPages.splice(index, 1)

            queryClient.setQueryData(['bruteNotes'], {
                ...bruteNotesCache,
                pages: newPages,
            });
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['bruteNotes'] });
            toast(<div>No se pudo eliminar la nota</div>);
        },
        onSuccess: (reponse) => {
            queryClient.invalidateQueries({ queryKey: ['bruteNotes'] });

            if (typeof reponse === 'boolean' && reponse) {
                toast(`nota eliminada correctamente`)
            };
        }
    })
}