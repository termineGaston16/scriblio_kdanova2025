import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { addNewTag } from "../../Infraestructure/tagAPI"
import { Tag_I } from "../../Domain/tag";
import { toast } from "sonner";

interface Props {
    title: string,
    colorTag: string,
    id: string
}

export const useAddNewTag = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (props: Props) => addNewTag(props.title, props.colorTag, props.id),
        onMutate: async (props) => {
            await queryClient.cancelQueries({ queryKey: ['tagList'] });

            const tagListCache = queryClient.getQueryData<InfiniteData<Tag_I[]>>(['tagList']);
            if (!tagListCache) return;
            const pagesFiltred = tagListCache.pages.flat();

            const { id, colorTag, title } = props;
            queryClient.setQueryData(['tagList'], {
                ...tagListCache,
                pages: [...pagesFiltred, {
                    id: id,
                    colorTag: colorTag,
                    title: title,
                    notesInThisTag: []
                } as Tag_I]
            });
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['tagList'] })
            toast(<div>No se ha logrado añadir la Tag</div>);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['tagList'] });
            if (typeof response === 'boolean' && response) return toast(<div>Tag agregado correctamnte</div>);
        }
    })
}