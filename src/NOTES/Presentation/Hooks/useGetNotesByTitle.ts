import { keepPreviousData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getNotesByTitle } from "../../Infraestructure/noteAPI";

export const useGetNotesByTitle = (keyword: string) => {
    return useInfiniteQuery({
        queryKey: ['notesByTile', keyword],
        queryFn: ({ pageParam }: { pageParam: string | null }) => {
            if (typeof keyword !== 'string' || keyword.length <= 0) return [];
            return getNotesByTitle(keyword, pageParam);
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.length > 0 ? lastPage.at(-1)?.id : undefined,
        enabled: typeof keyword === 'string' && keyword.length > 0,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        retry: 2,
        retryDelay: 2000,
        staleTime: 60 * 60 * 1000,
    });
};
