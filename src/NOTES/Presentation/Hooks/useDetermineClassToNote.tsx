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

            const { id, classStyle, value } = props;
            await queryClient.cancelQueries({ queryKey: ['bruteNotes'] });
            await queryClient.cancelQueries({ queryKey: ['note', id] });

            const brutesNotesCache = queryClient.getQueryData<InfiniteData<Note_I[]>>(['bruteNotes']);
            const bruteNoteCache = queryClient.getQueryData<Note_I>(['note', id]);
            if (!brutesNotesCache || !bruteNoteCache) return;

            const pagesFiltred = brutesNotesCache.pages.flat();


            const index = pagesFiltred.findIndex(note => note.id === id);
            if (index < 0) return;

            const newPages = [...pagesFiltred];
            newPages[index][classStyle] = value;

            const newNote = {
                ...bruteNoteCache,
                [classStyle]: value
            }

            queryClient.setQueryData(['bruteNotes'], {
                ...brutesNotesCache,
                pages: newPages,
            });
            queryClient.setQueryData(['note', id], newNote);
        },
        onError: (_, __) => {
            queryClient.resetQueries({ queryKey: ['bruteNotes'] });
            queryClient.resetQueries({ queryKey: ['note', __.id] });
            toast(<div>La clase no pudo ser modificada</div>);
        },
        onSuccess: (response, _) => {
            queryClient.invalidateQueries({ queryKey: ['bruteNotes'] });
            queryClient.invalidateQueries({ queryKey: ['note', _.id] });

            if (typeof response === 'boolean' && response) {
                toast(`clase asignada correctamente`)
            };
        }
    })
}