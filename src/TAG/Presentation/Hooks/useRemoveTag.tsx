import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeTag } from "../../Infraestructure/tagAPI"
import { toast } from "sonner";
import { Tag_I } from "../../Domain/tag";

export const useRemoveTag = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => removeTag(id),
        onMutate: async (id: string) => {
            if (typeof id !== "string") throw new TypeError(`
                removeTag expected a parameter of type string but received one of type ${typeof id}
            `);

            await queryClient.cancelQueries({ queryKey: ['allListTag'] })
            const prevListCache = queryClient.getQueryData(['allListTag']);

            queryClient.setQueryData(['allListTag'], (prevList: Tag_I[] = []) => {
                const index = prevList.findIndex(tag => tag.id === id)
                if (index < 0) return prevList;

                const newList = [...prevList];
                newList.splice(index, 1)

                return newList
            })

            return { prevListCache }
        },

        onError: (_, __, context) => {
            queryClient.setQueryData(['allListTag'], context?.prevListCache);
            toast(<div>No fue posible eliminar el tag</div>);
        },

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['allListTag'] })
            if (typeof response === "boolean" && response) {
                toast(<div>Tag eliminado correctamente</div>);
            }
        }
    });
};