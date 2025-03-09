import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { filterNotesByTag } from "../../Infraestructure/tagAPI"

export const useFilterNotesByTag = (idTag: string | null) => {
    return useInfiniteQuery({
        queryKey: ['notesByTag', idTag],
        queryFn: ({ pageParam }: { pageParam: string | null }) => {
            if (typeof idTag !== 'string') return []
            return filterNotesByTag(idTag, pageParam);
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.length > 0 ? lastPage.at(-1)?.id : undefined,
        enabled: typeof idTag === 'string' && idTag.length > 0,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 2000,
        staleTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData
    })
};