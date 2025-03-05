import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { createNewNote } from "../../Infraestructure/noteAPI"
import { toast } from "sonner"
import { Note_I } from "../../Domain/note"

interface Props {
    id: string,
    title: string
}

export const useCreateNewNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: Props) => createNewNote(params.id, params.title),
        onMutate: async (params: Props) => {
            await queryClient.cancelQueries({ queryKey: ['bruteNotes'] });

            const bruteNotesCache = queryClient.getQueryData<InfiniteData<Note_I[]>>(['bruteNotes']);
            if (!bruteNotesCache) return { previousCache: undefined };

            const lastPageIndex = bruteNotesCache.pages.length - 1;
            if (!lastPageIndex) return { previousCache: undefined };

            const newNote: Note_I = {
                ...params,
                creationDate: new Date().toLocaleDateString(),
                isArchived: false,
                isCompleted: false,
                isNotCompleted: true,
                isFav: false,
                isFixed: false,
                modificationDate: null,
            };

            // Clonar y modificar la última página
            const updatedPages = [...bruteNotesCache.pages];
            updatedPages[lastPageIndex] = [...(updatedPages[lastPageIndex] || []), newNote]; // Agregamos la nueva nota al array

            // Establecer la nueva caché
            queryClient.setQueryData(['bruteNotes'], {
                ...bruteNotesCache,
                pages: updatedPages,
            });

            return { previousCache: bruteNotesCache };
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['bruteNotes'] });
            toast(<div>No se pudo crear la nota</div>);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['bruteNotes'] });
            if (typeof response === 'string') return response;
            if (typeof response === 'boolean' && response) {
                toast(
                    <div> nota creada correctamente</div>
                );
            };
        }
    })
}