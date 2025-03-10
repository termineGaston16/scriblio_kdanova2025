import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBody } from "../../Infraestructure/note_bodyAPI"
import { Note_Body_I } from "../../Domain/note_body";
import { toast } from "sonner";

interface Props {
    id: string | null,
    newBody: string,
    bodyLocal: string,
    idNoteLocal: string | null
}

export const useUpdateBody = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (props: Props) => {
            if (props.bodyLocal === props.newBody) return Promise.resolve();
            if (!props.id) return Promise.resolve();
            return updateBody(props.id, props.newBody)
        },
        onMutate: async (props) => {
            await queryClient.cancelQueries({ queryKey: ['noteBody', props.idNoteLocal] })

            const bodyInCache = queryClient.getQueryData<Note_Body_I>(['noteBody', props.idNoteLocal]);
            if (!bodyInCache) return;

            const newBody = {
                ...bodyInCache,
                body: props.newBody
            } as Note_Body_I
            queryClient.setQueryData(['noteBody', props.idNoteLocal], newBody);
        },
        onError: (_, props) => {
            queryClient.resetQueries({ queryKey: ['noteBody', props.idNoteLocal] })
            toast(<div>El body no fue posible actualizar</div>);
        },
        onSuccess: (_, props) => {
            queryClient.invalidateQueries({ queryKey: ['noteBody', props.idNoteLocal] })
            toast(<div>El body fue actualizado</div>);
        }
    })
}