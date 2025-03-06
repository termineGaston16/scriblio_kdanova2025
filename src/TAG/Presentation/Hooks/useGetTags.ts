import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { Tag_I } from "../../Domain/tag"
import { getTags } from "../../Infraestructure/tagAPI"

export const useGetTags = () => {
    return useInfiniteQuery({
        queryKey: ['tagList'],
        queryFn: ({ pageParam }: { pageParam: string | null }) => getTags(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage: Tag_I[]) => lastPage.length > 0 ? lastPage.at(-1)?.id : undefined,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}   