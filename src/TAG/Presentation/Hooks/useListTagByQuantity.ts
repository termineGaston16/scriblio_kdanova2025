import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTagByQuantity } from "../../../TAG/Infraestructure/tagAPI";
import { Tag_I } from "../../../TAG/Domain/tag";
import React from "react";

export const useListTagByQuantity = (lastID: string | null) => {
    const queryClient = useQueryClient();

    const query = useQuery<Tag_I[], Error>({
        queryKey: ['listTag', lastID ?? 'null'],
        queryFn: async () => {
            return await listTagByQuantity(lastID);
        },
        enabled: !lastID || typeof lastID === 'string',
        gcTime: 0,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000,
    });

    React.useEffect(() => {
        if (!query.data || query.data.length <= 0) return;

        queryClient.setQueryData<Tag_I[]>(['allListTag'], (prevList = []) => {

            const newData = query.data.filter(tag =>
                !prevList.some(prevTag => prevTag.id === tag.id)
            );

            if (newData.length === 0) return prevList;

            return [...prevList, ...newData];
        });

    }, [query.data, queryClient]);


    return query;
};
