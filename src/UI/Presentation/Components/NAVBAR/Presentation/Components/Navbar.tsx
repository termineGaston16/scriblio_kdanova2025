import { Link } from "react-router-dom";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineEventNote, MdOutlineNotes } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { TiPinOutline } from "react-icons/ti";
import { IoArchiveOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDetermineClassToNote } from "../../../../../../NOTES/Presentation/Hooks/useDetermineClassToNote";
import { validateLocationToFiltred } from "../../../../../../NOTES/Application/noteAPP";
import { useDeleteNote } from "../../../../../../NOTES/Presentation/Hooks/useDeleteNote";
import { ClassNotes_E } from "../../../../../../NOTES/Domain/classNotes";
import { useIDTagParamContext } from "../../../../../../TAG/Presentation/Context/idTagParamContext";
import { useWordSearchContext } from "../../../../../TOOLBAR/Presentation/Context/WordSearchContext";

import '../Styles/navbar.css'

export default function Navbar() {

    const [showInfoNavbar, setShowInfoNavbar] = useState<boolean>(false);
    const [showAlertError, setShowAlertError] = useState<boolean>(false);
    const {
        mutate: mutateUseDetermineClassToNote,
        data: dataUseDetermineClassToNote,
        isSuccess: isSuccessUseDetermineClassToNote
    } = useDetermineClassToNote();

    const {
        mutate: mutateUseDeleteNote,
    } = useDeleteNote();


    const handleDropNavbar = (e: React.DragEvent<HTMLLIElement>, zone: string) => {
        e.preventDefault();

        const idNote = e.dataTransfer.getData('idNote');
        if (zone === 'deleteNote') return mutateUseDeleteNote(idNote);

        const classStyle = validateLocationToFiltred(zone);
        if (classStyle.length <= 0) return;

        mutateUseDetermineClassToNote({
            id: idNote,
            classStyle: classStyle as ClassNotes_E,
            value: true
        })
    }

    useEffect(() => {
        if (typeof dataUseDetermineClassToNote === 'string') setShowAlertError(true);
    }, [isSuccessUseDetermineClassToNote])

    const { setShowListByTag } = useIDTagParamContext();
    const { setShowLisSearch } = useWordSearchContext();

    return (<>
        <nav className="Navbar">
            <BsFillInfoCircleFill
                className="Navbar__infoICON"
                onMouseOver={() => setShowInfoNavbar(true)}
                onMouseOut={() => setShowInfoNavbar(false)}

                onTouchStart={() => setShowInfoNavbar(true)}
                onTouchEnd={() => setShowInfoNavbar(false)}
            />

            {showInfoNavbar &&
                <aside className="Navbar__infoNote">
                    (i) Arrastre una Nota (<MdOutlineEventNote className="Navbar__infoNote__ReactICON" />) para asignarle una clase.
                </aside>
            }

            <ul className="Navbar__listClass">
                <li
                    className="Navbar__listClass__class"

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Todas las Listas</span>
                        <MdOutlineNotes
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="Navbar__listClass__class"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/favoritos')}

                    onDragStart={(e) => e.preventDefault()}
                    draggable={false}

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/favoritos'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Favoritas</span>
                        <IoIosStarOutline
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="Navbar__listClass__class"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/pendientes')}
                    onDragStart={(e) => e.preventDefault()}
                    draggable={false}

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/pendientes'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Pendientes</span>
                        <FaCheck
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="Navbar__listClass__class"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/completadas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/completadas'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Completadas</span>
                        <FaCheckDouble
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="Navbar__listClass__class"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/fijas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/fijas'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Fijas</span>
                        <TiPinOutline
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="Navbar__listClass__class"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/archivadas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}

                    onClick={() => {
                        setShowListByTag(false)
                        setShowLisSearch(false)
                    }}>
                    <Link
                        className="Navbar__listClass__class__Link"
                        to={'/archivadas'}>
                        <span
                            className="Navbar__listClass__class__Link__text"
                        >Archivadas</span>
                        <IoArchiveOutline
                            className="Navbar__listClass__class__Link__ReactICON"
                        />
                    </Link>
                </li>
                <li
                    className="class_DeleteNoteClass"

                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, 'deleteNote')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}
                >

                    <span
                        className="text_DeleteNoteClassText"
                    >Borrar Nota</span>
                </li>
            </ul>
        </nav>

        {
            showAlertError &&
            <div className="Navbar__alertError">
                <p className="Navbar__alertError__message">{dataUseDetermineClassToNote}</p>
                <button
                    className="Navbar__alertError__btnOk"
                    onClick={() => setShowAlertError(false)}
                    type="button">
                    Okey
                </button>
            </div>
        }
    </>)
}