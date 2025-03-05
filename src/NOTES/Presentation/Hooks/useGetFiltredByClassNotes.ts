import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { getFiltredByClassNotes } from "../../Infraestructure/noteAPI"
import { ClassNotes_E } from "../../Domain/classNotes"

export const useGetFiltredByClassNotes = (
    classStyle: ClassNotes_E
) => {
    return useInfiniteQuery({
        queryKey: ['filtredNotes', classStyle],
        queryFn: ({ pageParam }: { pageParam: string | null }) =>
            getFiltredByClassNotes(pageParam, classStyle),
        initialPageParam: null,
        getNextPageParam: (lastParam) => lastParam.length > 0 ? lastParam.at(-1)?.id : undefined,
        gcTime: 60 * 60 * 1000,
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        retry: 0,
        enabled: Object.values(ClassNotes_E).includes(classStyle)
    })
}