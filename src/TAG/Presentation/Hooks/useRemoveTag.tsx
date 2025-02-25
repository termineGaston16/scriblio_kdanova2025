import { useMutation } from "react-query"
import { removeTag } from "../../Infraestructure/tagAPI"
import { useListLocalContext } from "../Context/listLocalContext";
import { useRef } from "react";
import { Tag_I } from "../../Domain/tag";
import { toast } from "sonner";

export const useRemoveTag = () => {

    const { setTagListLocal } = useListLocalContext();
    const indexRef = useRef<number | null>(null)
    const tagRef = useRef<Tag_I | null>(null)

    return useMutation({
        mutationFn: (id: string) => removeTag(id),

        onMutate: (id: string) => {
            if (typeof id !== "string") throw new TypeError(`
                removeTag expected a parameter of type string but received one of type ${typeof id}
            `);

            setTagListLocal(prevTags => {
                const index = prevTags.findIndex(tag => tag.id === id);
                if (index === -1) return prevTags;

                tagRef.current = prevTags[index];
                indexRef.current = index;

                const newList = [...prevTags];
                newList.splice(index, 1);

                return newList;
            });
        },

        onError: () => {
            setTagListLocal(prevTags => {
                if (indexRef.current === null || tagRef.current === null) return prevTags;

                const newList = [...prevTags];
                newList.splice(indexRef.current, 0, tagRef.current);

                return newList;
            });

            toast(<div>No fue posible eliminar el tag</div>);
        },

        onSuccess: (response) => {
            if (typeof response === "boolean" && response) {
                toast(<div>Tag eliminado correctamente</div>);
            }
        },

        onSettled: () => {
            indexRef.current = null;
            tagRef.current = null;
        }
    });
};