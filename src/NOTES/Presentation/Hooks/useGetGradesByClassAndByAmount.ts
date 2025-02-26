import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"
import { ClassNotes_E } from "../../Domain/classNotes"

export const useGetGradesByClassAndByAmount = (lastID: string | null, classStyle: ClassNotes_E, whereValue: boolean) => {
    return useQuery({
        queryKey: ['notes', lastID, classStyle, whereValue],
        queryFn: () => getNotesByQuantity(lastID),
        gcTime: 60 * 60 * 1000,
        enabled: (!lastID || typeof lastID === 'string') &&
            Object.values(classStyle).includes(classStyle) &&
            typeof whereValue === 'boolean',
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    })
}