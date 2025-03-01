import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Note_I } from "../../Domain/note";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Props {
    listNoteLocal: Note_I[];
    lastNote: (node: HTMLElement | null) => void
};


const NotePreviewList: React.FC<Props> = ({ listNoteLocal, lastNote }) => {

    const parentRef = useRef<HTMLDivElement | null>(null);
    const rowVirtualizer = useVirtualizer({
        count: listNoteLocal.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
    });


    return (
        <div
            ref={parentRef}
            style={{
                height: '100vh', // Define una altura fija para el scroll
                overflow: "auto",
            }}
        >
            <ul

                style={{
                    position: "relative",
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    padding: 0,
                    margin: 0,
                    listStyle: "none"
                }}>
                {
                    rowVirtualizer.getVirtualItems().map((virtualRow, index, array) => {

                        const { id, title, creationDate } = listNoteLocal[virtualRow.index];
                        const isLast = index === array.length - 1;

                        return (
                            <li
                                key={id}
                                ref={isLast ? lastNote : null}
                                style={{
                                    position: "absolute", // 📌 Posiciona los elementos correctamente
                                    top: 0,
                                    left: 0,
                                    border: '1px solid yellow',
                                    width: "100%",
                                    transform: `translateY(${virtualRow.start}px)`, // 📌 Mueve cada elemento a su posición correcta
                                }}
                            >
                                <Link to={`nota=id/${id}`}>
                                    <h2>{title}</h2>
                                    <span>{creationDate}</span>
                                </Link>
                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
};

export default NotePreviewList;