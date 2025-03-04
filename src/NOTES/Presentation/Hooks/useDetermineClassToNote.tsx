import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClassNotes_E } from "../../Domain/classNotes"
import { determineClassToNote } from "../../Infraestructure/noteAPI"
import { Note_I } from "../../Domain/note"
import { toast } from "sonner"

interface Props {
    id: string,
    classStyle: ClassNotes_E,
    value: boolean
}

export const useDetermineClassToNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (props: Props) => determineClassToNote(
            props.id,
            props.classStyle,
            props.value
        ),
        onMutate: (props: Props) => {
            queryClient.invalidateQueries({ queryKey: ['allNotes'] });
            const prevListCache = queryClient.getQueryData(['allNotes']);
            const { id, classStyle, value } = props;

            queryClient.setQueryData(['allNotes'], (prevList: Note_I[] = []) => {
                const index = prevList.findIndex(note => note.id === id);
                if (index < 0) return prevList;

                const newList = [...prevList];
                (newList[index])[classStyle] = value;
                return newList;
            });
            return { prevListCache }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['allNotes'], context?.prevListCache);
            toast(
                <div>No se pudo asignar clase </div>
            );
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['allNotes'] });

            if (typeof response === 'string') return response;
            if (typeof response === 'boolean' && response) {
                toast(`clase asignada correctamente`)
            };
        }
    })
}