import React, { createContext, ReactNode, useContext, useState } from "react";
import { Note_I } from "../../Domain/note";
import { useQueryClient } from "@tanstack/react-query";
import { BruteNotesResponse } from "../Hooks/useGetBruteNotes";

interface PropsContext {
    localBruteNotesList: Note_I[],
    setLocalBruteNotesList: React.Dispatch<React.SetStateAction<Note_I[]>>
};

interface PropsProvider {
    children: ReactNode;
};

export class ContextFailedError extends Error {
    constructor(message: string) {
        super(message),
            this.name = 'ContextFailedError',
            this.message = message;
    }
};

const ListOfNotesBruteContext = createContext<PropsContext | undefined>(undefined);
export const ListOfNotesBruteProvider: React.FC<PropsProvider> = ({ children }) => {

    const queryClient = useQueryClient();

    const [localBruteNotesList, setLocalBruteNotesList] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<BruteNotesResponse>(['bruteNotes'])?.pages.at(-1)?.notes ?? []
    })

    return (
        <ListOfNotesBruteContext.Provider value={{ localBruteNotesList, setLocalBruteNotesList }}>
            {children}
        </ListOfNotesBruteContext.Provider>
    );
};

export const useListOfNotesBruteContext = () => {
    const context = useContext(ListOfNotesBruteContext);
    if (!context) throw new ContextFailedError(`ListOfNotesBruteContext must be used inside ListOfNotesBruteProvider`)
    return context;
};