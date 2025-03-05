import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getBruteNotes } from "../../Infraestructure/noteAPI";

export const useGetBruteNotes = (
    path: string
) => {
    return useInfiniteQuery({
        queryKey: ['bruteNotes'],
        queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getBruteNotes(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) =>
            lastPage?.length > 0 ? lastPage.at(-1)?.id : undefined,
        gcTime: 60 * 60 * 1000,
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        retry: 0,
        enabled: path.length <= 0
    });
};

