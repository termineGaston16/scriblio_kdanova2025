import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getGradesByClassAndByAmount } from "../../Infraestructure/noteAPI"
import { ClassNotes_E } from "../../Domain/classNotes"
import { Note_I } from "../../Domain/note";

export const useGetGradesByClassAndByAmount = (
    lastID: string | null,
    classStyle: ClassNotes_E | null,
    whereValue: boolean
) => {

    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['notesFiltred', classStyle, whereValue],
        queryFn: async () => {
            const notesFiltred = await getGradesByClassAndByAmount(
                lastID,
                classStyle as ClassNotes_E,
                whereValue
            );

            queryClient.setQueryData(['notesFiltred', classStyle, whereValue], (oldNotes: Note_I[]) => {
                if (!oldNotes || oldNotes.length <= 0) return [...notesFiltred];
                return [...oldNotes, ...notesFiltred];
            });

            return queryClient.getQueryData(['notesFiltred', classStyle, whereValue]) as Note_I[];
        },
        gcTime: 60 * 60 * 1000,
        enabled: classStyle !== null && typeof whereValue === 'boolean',
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    });
}