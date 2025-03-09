import { createContext, useContext, useState } from "react";
import { ContextWithoutProvider } from "../../../../TAG/Presentation/Context/idTagParamContext";

interface ContexProps {
    wordSearch: string,
    setWordSearch: React.Dispatch<React.SetStateAction<string>>,
    showListSearch: boolean,
    setShowLisSearch: React.Dispatch<React.SetStateAction<boolean>>
};

interface Props {
    children: React.ReactNode
}

const WordSearchContext = createContext<ContexProps | undefined>(undefined);
export const WordSearchProvider: React.FC<Props> = ({ children }) => {

    const [wordSearch, setWordSearch] = useState<string>('')
    const [showListSearch, setShowLisSearch] = useState<boolean>(false);

    return (
        <WordSearchContext.Provider value={{
            wordSearch,
            setWordSearch,
            showListSearch,
            setShowLisSearch
        }}>
            {children}
        </WordSearchContext.Provider>
    )
};

export const useWordSearchContext = () => {
    const contex = useContext(WordSearchContext);
    if (!contex) throw new ContextWithoutProvider(`WordSearchContext must be used inside WordSearchProvider`)
    return contex;
}
