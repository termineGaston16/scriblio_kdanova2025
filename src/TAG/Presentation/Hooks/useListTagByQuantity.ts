import { useQuery } from "react-query";
import { listTagByQuantity } from "../../Infraestructure/tagAPI";

export const useListTagByQuantity = (lastID: string | null) => {
    return useQuery({
        queryKey: ['listTag', lastID],
        queryFn: () => listTagByQuantity(lastID),
        enabled: !lastID || typeof lastID === 'string',
        cacheTime: 0,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
};