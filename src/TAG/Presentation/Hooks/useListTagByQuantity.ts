import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listTagByQuantity } from "../../Infraestructure/tagAPI";

export const useListTagByQuantity = (lastID: string | null) => {
    return useQuery({
        queryKey: ['listTag', lastID],
        queryFn: () => listTagByQuantity(lastID),
        enabled: !lastID || typeof lastID === 'string',
        gcTime: 0,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
};