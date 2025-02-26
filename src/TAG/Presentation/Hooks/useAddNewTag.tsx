import { useMutation } from "@tanstack/react-query"
import { addNewTag } from "../../Infraestructure/tagAPI"
import { useListLocalContext } from "../Context/listLocalContext";
import { toast } from "sonner";

interface NewTagData {
    title: string;
    colorTag: string;
    id: string
}

export const useAddNewTag = () => {

    const { setTagListLocal } = useListLocalContext()

    return useMutation({
        mutationFn: (newTag: NewTagData) => addNewTag(newTag.title, newTag.colorTag, newTag.id),
        onMutate: (newTag: NewTagData) => {
            const { title, colorTag, id } = newTag;
            setTagListLocal(prevList => [
                {
                    title: title,
                    colorTag: colorTag,
                    id: id,
                    notesInThisTag: []
                },
                ...prevList
            ]);

        },
        onError: () => {
            setTagListLocal(prevList => {
                if (prevList.length > 0) return prevList.slice(1);
                return prevList;
            });

            toast(<div>no fue posible crearlo</div>)
        },
        onSuccess: (response) => {
            if (typeof response === 'boolean' && response) toast(<div>creado con éxito!</div>)
        }
    });
};
