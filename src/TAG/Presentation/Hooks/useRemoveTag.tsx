import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { removeTag } from "../../Infraestructure/tagAPI"
import { Tag_I } from "../../Domain/tag";
import { toast } from "sonner";

export const useRemoveTag = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => removeTag(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['tagList'] });

            const tagListCache = queryClient.getQueryData<InfiniteData<Tag_I[]>>(['tagList']);
            if (!tagListCache) return;

            const pageFiltred = tagListCache.pages.flat();
            const index = pageFiltred.findIndex(tag => tag.id === id);
            if (index < 0) return;

            const newPages = [...pageFiltred];
            newPages.splice(index, 1);

            queryClient.setQueryData(['tagList'], {
                ...tagListCache,
                pages: newPages
            });
        },
        onError: () => {
            queryClient.resetQueries({ queryKey: ['tagList'] });
            toast(<div>No se ha logrado remover el tag</div>);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['tagList'] });

            if (typeof response === 'boolean' && response) {
                toast(<div>Tag eliminado correctamente</div>);
            };
        }
    })
}