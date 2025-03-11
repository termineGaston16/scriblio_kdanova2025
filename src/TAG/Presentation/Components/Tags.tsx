import { Tag_I } from "../../Domain/tag";
import { FiMinusCircle } from "react-icons/fi";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { useDetermineTagToNote } from "../Hooks/useDetermineTagToNote";
import { useIDTagParamContext } from "../Context/idTagParamContext";
import { useWordSearchContext } from "../../../UI/TOOLBAR/Presentation/Context/WordSearchContext";

import '../Styles/tags.css'
import { FaTag } from "react-icons/fa";

interface Props {
    tagListLocal: Tag_I[];
    lastItem: (node: HTMLElement | null) => void;
    showOptionsTag: {
        id: string;
        name: string;
    } | null;
    setShowOptionsTag: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
    } | null>>;
    setShowTagDeleteWarning: React.Dispatch<React.SetStateAction<boolean>>
}


const Tags: React.FC<Props> = ({
    tagListLocal,
    lastItem,
    showOptionsTag,
    setShowOptionsTag,
    setShowTagDeleteWarning,
}) => {
    const parentRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: tagListLocal.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50, // Altura de cada elemento,    
    });

    const {
        mutate: mutateUseDetermineTagToNote,
        data: dataUseDetermineTagToNote,
        isSuccess: isSuccessUseDetermineTagToNote
    } = useDetermineTagToNote();

    const handleUseDetermineTagToNote = (e: React.DragEvent<HTMLLIElement>, idTag: string) => {
        const idNote = e.dataTransfer.getData('idNote');
        mutateUseDetermineTagToNote({
            idNote: idNote,
            idTag: idTag
        });
    }

    const [alertAsingTagInNote, setAlertAsingTagInNote] = useState<boolean>(false);
    useEffect(() => {
        if (typeof dataUseDetermineTagToNote === 'boolean' && dataUseDetermineTagToNote || !dataUseDetermineTagToNote) return;
        setAlertAsingTagInNote(true)
    }, [isSuccessUseDetermineTagToNote])

    const { setIDTagParam, setShowListByTag } = useIDTagParamContext();
    const { setShowLisSearch } = useWordSearchContext();

    return (<>
        <div
            className="Tags_parentRef"
            ref={parentRef}
        >
            {/* 📌 Contenedor interno con altura dinámica */}
            <ul
                className="Tags__listTags"
                style={{
                    position: "relative",
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    padding: 0, // Agregamos espacio entre los elementos
                    margin: 0,
                    listStyle: "none",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow, index, array) => {
                    const isLast = index === array.length - 1;
                    const { title, id, colorTag } = tagListLocal[virtualRow.index];

                    return (
                        <li
                            ref={isLast ? lastItem : null}
                            key={id}
                            onMouseEnter={() => setShowOptionsTag({
                                id: id,
                                name: title
                            })}

                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleUseDetermineTagToNote(e, id)}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}

                            onClick={() => {
                                setIDTagParam(id)
                                setShowListByTag(true)
                                setShowLisSearch(false)
                            }}

                            className="Tags__listTags__tag"
                            style={{
                                "--tag-bg-color": colorTag,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start + index * 70}%)`,
                            } as React.CSSProperties}
                        >
                            <span
                                className="Tags__listTags__tag__title"
                                style={{
                                    color: `${colorTag}`
                                }}
                            >
                                {title}
                            </span>
                            <FaTag
                                style={{
                                    color: `${colorTag}`
                                }}
                                className="Tags__listTags__tag__ReactICON" />

                            {showOptionsTag?.id === id && (
                                <div className="container_deleteTag">
                                    <button
                                        className="Tags__listTags__tag__deleteTag"
                                        type="button"
                                        onClick={() => setShowTagDeleteWarning(true)}
                                    >
                                        <FiMinusCircle className="Tags__listTags__tag__deleteTag__ReactICON" />
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>

        {
            dataUseDetermineTagToNote &&
            <div className="alertAsingTagInNote_containter">
                <span className="alertAsingTagInNote_message">{dataUseDetermineTagToNote}</span>
                <button
                    className="alertAsingTagInNote_closeAlert"
                    onClick={() => setAlertAsingTagInNote(false)}
                    type="button">De Acuerdo</button>
            </div>
        }
    </>);
};

export default Tags;
