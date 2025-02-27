import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getGradesByClassAndByAmount } from "../../Infraestructure/noteAPI"
import { ClassNotes_E } from "../../Domain/classNotes"

export const useGetGradesByClassAndByAmount = (
    lastID: string | null,
    classStyle: ClassNotes_E | null,
    whereValue: boolean
) => {

    return useQuery({
        queryKey: ['notesFiltred', lastID, classStyle ?? 'null', whereValue],
        queryFn: () => getGradesByClassAndByAmount(
            lastID,
            classStyle as ClassNotes_E,
            whereValue
        ),
        gcTime: 60 * 60 * 1000,
        enabled: classStyle !== null && typeof whereValue === 'boolean',
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
}