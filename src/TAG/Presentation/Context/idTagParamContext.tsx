import React, { createContext, useContext, useState } from "react";

interface IdTagParamContextParam {
    idTagParam: string | null,
    setIDTagParam: React.Dispatch<React.SetStateAction<string | null>>,
    showListByTag: boolean,
    setShowListByTag: React.Dispatch<React.SetStateAction<boolean>>
};

interface Props {
    children: React.ReactNode
}

export class ContextWithoutProvider extends Error {
    constructor(message: string) {
        super(message),
            this.name = 'ContextWithoutProvider',
            this.message = message
    }
};

const IDTagParamContext = createContext<IdTagParamContextParam | undefined>(undefined);
export const IDTagParamProvider: React.FC<Props> = ({ children }) => {
    const [idTagParam, setIDTagParam] = useState<string | null>(null);
    const [showListByTag, setShowListByTag] = useState<boolean>(false);

    return (
        <IDTagParamContext.Provider value={{
            idTagParam,
            setIDTagParam,
            showListByTag,
            setShowListByTag
        }}>
            {children}
        </IDTagParamContext.Provider>
    )
};

export const useIDTagParamContext = () => {
    const context = useContext(IDTagParamContext);
    if (!context) throw new ContextWithoutProvider(`IDTagParamContext must be used inside IDTagParamProvider`);
    return context;
}   