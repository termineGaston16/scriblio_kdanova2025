import { Link } from "react-router-dom";
import { Tag_I } from "../../Domain/tag";
import { FiMinusCircle } from "react-icons/fi";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

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
    setShowTagDeleteWarning: React.Dispatch<React.SetStateAction<boolean>>;
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

    return (
        // 📌 Contenedor con scroll
        <div
            ref={parentRef}
            style={{
                height: 600, // Define una altura fija para el scroll
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
                            style={{
                                position: "absolute", // 📌 Posiciona los elementos correctamente
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`, // 📌 Mueve cada elemento a su posición correcta
                            }}
                        >
                            <Link to={"/"}>
                                <span
                                    style={{
                                        border: "1px solid red",
                                        display: "block",
                                        padding: "10px",
                                    }}
                                >
                                    {title}
                                </span>
                            </Link>

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
    );
};

export default Tags;
