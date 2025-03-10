import React, { useEffect, useState } from "react";
import { theBodyChanged } from "../../NOTES-BODY/Application/note_bodyAPP";
import { IoMdArchive } from "react-icons/io";
import { FaCheck, FaCheckDouble, FaStar } from "react-icons/fa";
import { PiPushPin } from "react-icons/pi";
import { useDetermineClassToNote } from "../Hooks/useDetermineClassToNote";
import { ClassNotes_E } from "../../Domain/classNotes";

interface Props {
    idNoteLocal: string | null,
    bodyFromCall: string,
    bodyLocal: string,
    logosFromNoteLocal: {
        modificationDate: null | string;
        isFav: boolean;
        isNotCompleted: boolean;
        isCompleted: boolean;
        isFixed: boolean;
        isArchived: boolean;
    } | null
};

const NoteActions: React.FC<Props> = ({
    idNoteLocal,
    bodyFromCall,
    bodyLocal,
    logosFromNoteLocal
}) => {

    const [bodyChanged, setBodyChanged] = useState<boolean>(false);
    useEffect(() => {
        setBodyChanged(theBodyChanged(bodyLocal, bodyFromCall))
    }, [bodyLocal, bodyFromCall])

    const {
        mutate: mutateDetermineClass,
        isSuccess: isSuccessDetermineClass
    } = useDetermineClassToNote()


    return (
        <div>
            <form method="post">
                {
                    bodyChanged &&
                    <>
                        <button type="submit">Guardar Cambios</button>
                        <span>*Los cambios no se han guardado</span>
                    </>
                }
            </form>

            {
                logosFromNoteLocal && idNoteLocal &&
                <ul>
                    {
                        logosFromNoteLocal.isArchived &&
                        <li onClick={() => mutateDetermineClass(
                            {
                                id: idNoteLocal,
                                classStyle: ClassNotes_E.ARCH,
                                value: false
                            }
                        )}
                        ><IoMdArchive /></li>
                    }
                    {
                        logosFromNoteLocal.isCompleted &&
                        <li onClick={() => mutateDetermineClass(
                            {
                                id: idNoteLocal,
                                classStyle: ClassNotes_E.COMPLETED,
                                value: false
                            }
                        )}
                        ><FaCheckDouble /></li>
                    }
                    {
                        logosFromNoteLocal.isFav &&
                        <li onClick={() => mutateDetermineClass(
                            {
                                id: idNoteLocal,
                                classStyle: ClassNotes_E.FAV,
                                value: false
                            }
                        )}
                        ><FaStar /></li>
                    }
                    {
                        logosFromNoteLocal.isFixed &&
                        <li onClick={() => mutateDetermineClass(
                            {
                                id: idNoteLocal,
                                classStyle: ClassNotes_E.FIX,
                                value: false
                            }
                        )}
                        ><PiPushPin /></li>
                    }
                    {
                        logosFromNoteLocal.isNotCompleted &&
                        <li><FaCheck /></li>
                    }
                </ul>
            }
        </div>
    )
};

export default NoteActions;