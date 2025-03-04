import { createContext, ReactNode, useContext, useState } from "react";
import { Note_I } from "../../Domain/note";

interface Props {
    listNoteLocal: Note_I[],
    setListNoteLocal: React.Dispatch<React.SetStateAction<Note_I[]>>,
}

interface ProviderProps {
    children: ReactNode;
}

const ListNotesLocalContext = createContext<Props | undefined>(undefined);

export const ListNotesLocalProvider: React.FC<ProviderProps> = ({ children }) => {

    const [listNoteLocal, setListNoteLocal] = useState<Note_I[]>([])

    return (
        <ListNotesLocalContext.Provider value={{ listNoteLocal, setListNoteLocal }} >
            {children}
        </ListNotesLocalContext.Provider >
    )
}

export const useListNotesLocalContext = () => {
    const context = useContext(ListNotesLocalContext);
    if (!context) throw Error(`ListNotesLocalContext must be used inside ListNotesLocalProvider`)
    return context
};