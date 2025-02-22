import { useQuery } from "react-query";
import { listTagByQuantity } from "../../Infraestructure/tagAPI";

export const useListTagByQuantity = (limitCount: number, lastID: string | null) => {

    return useQuery({
        queryKey: ['listTag', limitCount, lastID],
        queryFn: () => listTagByQuantity(
            limitCount,
            lastID
        ),
        enabled:
            (!lastID || typeof lastID === 'string') &&
            typeof limitCount === 'number' &&
            limitCount >= 1,
        cacheTime: 0,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
};