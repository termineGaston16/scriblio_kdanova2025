import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "../../Infraestructure/noteAPI"
import { toast } from "sonner";
import { Note_I } from "../../Domain/note";

export const useDeleteNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onMutate: async (id: string) => {

            await queryClient.cancelQueries({ queryKey: ['notes'] })
            const prevListCache = queryClient.getQueryData(['notes']);

            queryClient.setQueryData(['notes'], (prevList: Note_I[] = []) => {
                const index = prevList.findIndex(note => note.id === id);
                if (index <= 0) return prevList;

                const newList = [...prevList];
                newList.splice(index, 1);
                return newList;
            })

            return { prevListCache }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['notes'], context?.prevListCache)
            toast(`la nota no pudo eliminarse`)
        },
        onSuccess: (reponse) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });

            if (typeof reponse === 'boolean' && reponse) {
                toast(`nota eliminada correctamente`)
            };
        }
    })
}