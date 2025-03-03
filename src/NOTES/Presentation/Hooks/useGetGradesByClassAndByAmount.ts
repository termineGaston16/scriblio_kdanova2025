import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getGradesByClassAndByAmount } from "../../Infraestructure/noteAPI"
import { ClassNotes_E } from "../../Domain/classNotes"
import { Note_I } from "../../Domain/note";
import React from "react";

export const useGetGradesByClassAndByAmount = (
    lastID: string | null,
    classStyle: ClassNotes_E | null,
    whereValue: boolean
) => {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notesFiltred', classStyle, whereValue],
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
    });

    React.useEffect(() => {
        if (!query.data || query.data.length <= 0) return;

        queryClient.setQueryData(['allNotesFiltred', classStyle, whereValue], (prevList: Note_I[] = []) => {
            // Filtrar solo los datos que NO están en prevList
            const newData = query.data.filter(note =>
                !prevList.some(prevNote => prevNote.id === note.id)
            );

            // Si no hay datos nuevos, no cambiar la caché
            if (newData.length === 0) return prevList;

            return [...prevList, ...newData];
        });

    }, [queryClient, query.data, classStyle, whereValue]);


    return query;

}