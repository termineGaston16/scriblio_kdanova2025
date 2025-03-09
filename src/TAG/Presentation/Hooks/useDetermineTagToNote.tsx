import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { determineTagToNote } from "../../../NOTES/Infraestructure/noteAPI"
import { Tag_I } from "../../Domain/tag";
import { toast } from "sonner";

interface Props {
    idNote: string,
    idTag: string
}

export const useDetermineTagToNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (props: Props) => determineTagToNote(props.idNote, props.idTag),
        onMutate: async (props) => {
            await queryClient.cancelQueries({ queryKey: ['tagList'] });

            const tagListCache = queryClient.getQueryData<InfiniteData<Tag_I[]>>(['tagList']);
            if (!tagListCache) return;
            const pagesFiltred = tagListCache.pages.flat();

            const { idNote, idTag } = props;
            const index = pagesFiltred.findIndex(tag => tag.id === idTag)
            if (index < 0) return;

            const newPages = [...pagesFiltred];
            if (newPages[index].notesInThisTag.includes(idNote)) return;
            newPages[index].notesInThisTag.push(idNote);

            queryClient.setQueryData(['tagList'], {
                ...tagListCache,
                pages: newPages
            });
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['tagList'] });
            toast(<div>No se ha logrado esta nota al tag</div>);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['tagList'] });

            if (typeof response === 'boolean' && response) {
                toast(<div>Nota añadida a Tag</div>);
            }
        }
    })
}