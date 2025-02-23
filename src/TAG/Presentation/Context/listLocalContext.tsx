import { createContext, ReactNode, useContext, useState } from "react";
import { Tag_I } from "../../Domain/tag";

interface ListLocalProps {
    tagListLocal: Tag_I[],
    setTagListLocal: React.Dispatch<React.SetStateAction<Tag_I[]>>
}

interface Props {
    children: ReactNode;
}

const ListLocalContext = createContext<ListLocalProps | undefined>(undefined)
export const ListLocalProvider: React.FC<Props> = ({ children }) => {

    const [tagListLocal, setTagListLocal] = useState<Tag_I[]>([]);

    return (
        <ListLocalContext.Provider value={{ tagListLocal, setTagListLocal }}>
            {children}
        </ListLocalContext.Provider>
    )
}

export const useListLocalContext = () => {
    const context = useContext(ListLocalContext)
    if (!context) throw Error(`ListLocalContext must be used inside ListLocalProvider`)
    return context
}
