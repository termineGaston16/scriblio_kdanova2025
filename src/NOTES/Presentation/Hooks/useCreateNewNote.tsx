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
            if (!bruteNotesCache) return;

            const pagesFiltred = bruteNotesCache.pages.filter(page => page.length > 0).flat();
            const newPages = [...pagesFiltred, {
                ...params,
                creationDate: new Date().toLocaleDateString(),
                isArchived: false,
                isCompleted: false,
                isNotCompleted: true,
                isFav: false,
                isFixed: false,
                modificationDate: null,
            } as Note_I];

            queryClient.setQueryData(['bruteNotes'], {
                ...bruteNotesCache,
                pages: newPages,
            });
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