import { Tag_I } from "../../Domain/tag";
import { FiMinusCircle } from "react-icons/fi";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { useDetermineTagToNote } from "../Hooks/useDetermineTagToNote";
import { useIDTagParamContext } from "../Context/idTagParamContext";
import { useWordSearchContext } from "../../../UI/TOOLBAR/Presentation/Context/WordSearchContext";

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
        estimateSize: () => 100, // Altura de cada elemento,    
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
            ref={parentRef}
            style={{
                height: 600,
                overflow: "auto",
            }}
        >
            {/* 📌 Contenedor interno con altura dinámica */}
            <ul
                style={{
                    position: "relative",
                    height: rowVirtualizer.getTotalSize(), // Calcula la altura total
                    width: "100%",
                    padding: 0,
                    margin: 0,
                    listStyle: "none"
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow, index, array) => {
                    const isLast = index === array.length - 1;
                    const { title, id } = tagListLocal[virtualRow.index];

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

                            style={{
                                position: "absolute", // 📌 Posiciona los elementos correctamente
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`, // 📌 Mueve cada elemento a su posición correcta
                            }}
                        >
                            <span
                                style={{
                                    border: "1px solid red",
                                    display: "block",
                                    padding: "10px",
                                }}
                            >
                                {title}
                            </span>

                            {showOptionsTag?.id === id && (
                                <button
                                    type="button"
                                    onClick={() => setShowTagDeleteWarning(true)}
                                >
                                    <FiMinusCircle />
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>

        {
            alertAsingTagInNote &&
            <div>
                <span>{dataUseDetermineTagToNote}</span>
                <button
                    onClick={() => setAlertAsingTagInNote(false)}
                    type="button">Okey</button>
            </div>
        }
    </>);
};

export default Tags;
