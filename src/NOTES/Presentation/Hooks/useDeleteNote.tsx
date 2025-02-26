import { useMutation } from "@tanstack/react-query"
import { deleteNote } from "../../Infraestructure/noteAPI"
import { useListNotesLocalContext } from "../Context/listNotesLocalContext"
import { useRef } from "react";
import { Note_I } from "../../Domain/note";
import { toast } from "sonner";

export const useDeleteNote = () => {

    const { setListNoteLocal } = useListNotesLocalContext();
    const indexRef = useRef<number | null>(null);
    const noteRef = useRef<Note_I | null>(null)

    return useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onMutate: (id: string) => {
            setListNoteLocal(prevList => {
                const index = prevList.findIndex(note => note.id === id);
                if (index < 0) return prevList;

                indexRef.current = index;
                noteRef.current = prevList[index];

                const newList = [...prevList];
                newList.splice(index, 1);

                return newList;
            });
        },
        onError: () => {
            setListNoteLocal(prevList => {
                if (indexRef.current === null || noteRef.current === null) return prevList;

                const newList = [...prevList];
                newList.splice(indexRef.current, 0, noteRef.current);
                return newList;
            })
            toast(`la nota no pudo eliminarse`)
        },
        onSuccess: (reponse) => {
            if (typeof reponse === 'boolean' && reponse) {
                toast(`nota eliminada correctamente`)
            };
        },
        onSettled: () => {
            indexRef.current = null;
            noteRef.current = null;
        }
    })
}