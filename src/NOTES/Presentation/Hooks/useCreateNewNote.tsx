import { useMutation, useQueryClient } from "@tanstack/react-query"
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

            await queryClient.cancelQueries({ queryKey: ['notes'] })
            const listPrevCache = queryClient.getQueryData(['notes'])

            queryClient.setQueryData(['notes'], (prevList: Note_I[] = []) => {
                return [...prevList, {
                    ...params,
                    creationDate: new Date().toLocaleDateString(),
                    isArchived: false,
                    isCompleted: false,
                    isFav: false,
                    isFixed: false,
                    modificationDate: null,
                }]
            })

            return { listPrevCache }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['notes'], context?.listPrevCache)
            toast(
                <div> no se pudo crear la nota</div>
            );
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });

            if (typeof response === 'boolean' && response) {
                toast(
                    <div> nota creada correctamente</div>
                );
            }

        },
    })
}