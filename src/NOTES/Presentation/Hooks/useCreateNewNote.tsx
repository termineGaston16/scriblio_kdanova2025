import { useMutation } from "react-query"
import { createNewNote } from "../../Infraestructure/noteAPI"

interface Props {
    id: string,
    title: string
}

export const useCreateNewNote = () => {
    return useMutation({
        mutationFn: (params: Props) => createNewNote(params.id, params.title),
        onMutate: () => { },
        onError: () => { },
        onSuccess: () => { },

    })
}