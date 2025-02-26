import { useMutation } from "@tanstack/react-query"
import { createNewNote } from "../../Infraestructure/noteAPI"
import { useListNotesLocalContext } from "../Context/listNotesLocalContext"
import { toast } from "sonner"

interface Props {
    id: string,
    title: string
}

export const useCreateNewNote = () => {

    const { setListNoteLocal } = useListNotesLocalContext();

    return useMutation({
        mutationFn: (params: Props) => createNewNote(params.id, params.title),
        onMutate: (params: Props) => {
            const { id, title } = params;

            setListNoteLocal(prevList => {
                const newList = [...prevList];
                if (typeof id !== 'string' || typeof title !== 'string') return prevList;

                newList.unshift({
                    id: '',
                    creationDate: new Date().toLocaleDateString(),
                    isArchived: false,
                    isCompleted: false,
                    isFav: false,
                    isFixed: false,
                    modificationDate: null,
                    title: title
                });
                return newList;
            })
        },
        onError: () => {
            setListNoteLocal(prevList => {
                const newList = [...prevList];
                if (newList.length <= 0) return prevList;

                newList.shift();
                return newList;
            });

            toast(
                <div> no se pudo crear la nota</div>
            );
        },
        onSuccess: (response, params: Props) => {
            if (typeof response === 'boolean' && response) {

                setListNoteLocal(prevList => {
                    const newList = [...prevList];
                    newList[0].id = params.id

                    return newList;
                });

                toast(
                    <div> nota creada correctamente</div>
                );
            }

        },
    })
}