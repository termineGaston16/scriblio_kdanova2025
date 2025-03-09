import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
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
        onMutate: async (props: Props) => {

            await queryClient.cancelQueries({ queryKey: ['bruteNotes'] });

            const brutesNotesCache = queryClient.getQueryData<InfiniteData<Note_I[]>>(['bruteNotes']);
            if (!brutesNotesCache) return;

            const pagesFiltred = brutesNotesCache.pages.flat();
            const { id, classStyle, value } = props;

            const index = pagesFiltred.findIndex(note => note.id === id);
            if (index < 0) return;

            const newPages = [...pagesFiltred];
            newPages[index][classStyle] = value;

            queryClient.setQueryData(['bruteNotes'], {
                ...brutesNotesCache,
                pages: newPages,
            });
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['bruteNotes'] });
            toast(<div>La clase no pudo ser modificada</div>);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['bruteNotes'] });

            if (typeof response === 'boolean' && response) {
                toast(`clase asignada correctamente`)
            };
        }
    })
}