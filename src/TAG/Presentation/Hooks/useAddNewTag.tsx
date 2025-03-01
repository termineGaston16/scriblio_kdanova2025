import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addNewTag } from "../../Infraestructure/tagAPI"
import { toast } from "sonner";
import { Tag_I } from "../../Domain/tag";

interface NewTagData {
    title: string;
    colorTag: string;
    id: string
}

export const useAddNewTag = () => {

    const queryclient = useQueryClient();

    return useMutation({
        mutationFn: (newTag: NewTagData) => addNewTag(newTag.title, newTag.colorTag, newTag.id),
        onMutate: async (newTag: NewTagData) => {

            await queryclient.cancelQueries({ queryKey: ['listTag'] });
            const prevCache = queryclient.getQueryData(['listTag']);

            queryclient.setQueryData(['listTag'], (prevList: Tag_I[] = []) => {
                return [...prevList, {
                    ...newTag,
                    notesInThisTag: []
                }]
            })

            return { prevCache }
        },
        onError: (_, __, context) => {
            queryclient.setQueryData(['listTag'], context?.prevCache);
            toast(<div>no fue posible crearlo</div>);
        },
        onSuccess: (response) => {
            queryclient.invalidateQueries({ queryKey: ['listTag'] });
            if (typeof response === 'boolean' && response) toast(<div>creado con éxito!</div>)
        }
    });
};
