import { Link } from "react-router-dom";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { TiDeleteOutline, TiPinOutline } from "react-icons/ti";
import { IoArchiveOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDetermineClassToNote } from "../../../../../../NOTES/Presentation/Hooks/useDetermineClassToNote";
import { validateLocationToFiltred } from "../../../../../../NOTES/Application/noteAPP";
import { useDeleteNote } from "../../../../../../NOTES/Presentation/Hooks/useDeleteNote";
import { ClassNotes_E } from "../../../../../../NOTES/Domain/classNotes";

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

    return (<>
        <nav>
            <BsFillInfoCircleFill
                onMouseOver={() => setShowInfoNavbar(true)}
                onMouseOut={() => setShowInfoNavbar(false)}
            />

            {showInfoNavbar &&
                <p>
                    arrastre el título de una nota para poder asignarle una clase
                </p>
            }

            <ul style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column'
            }}>
                <li
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/'}>
                        <span>todas las listas</span>
                        <MdOutlineNotes />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/favoritos')}

                    onDragStart={(e) => e.preventDefault()}
                    draggable={false}

                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link
                        to={'/favoritos'}>
                        <span>favoritos</span>
                        <IoIosStarOutline />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/pendientes')}
                    onDragStart={(e) => e.preventDefault()}
                    draggable={false}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/pendientes'}>
                        <span>pendientes</span>
                        <FaCheck />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/completadas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/completadas'}>
                        <span>completadas</span>
                        <FaCheckDouble />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/fijas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/fijas'}>
                        <span>fijas</span>
                        <TiPinOutline />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/archivadas')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/archivadas'}>
                        <span>archivadas</span>
                        <IoArchiveOutline />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, 'deleteNote')}
                    onDragStart={(e) => e.preventDefault()} // Cancela cualquier intento de arrastrar
                    draggable={false}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>

                    <span>borrar nota</span>
                    <TiDeleteOutline />
                </li>
            </ul>
        </nav>

        {
            showAlertError &&
            <div>
                {dataUseDetermineClassToNote}
                <button
                    onClick={() => setShowAlertError(false)}
                    type="button">
                    Okey
                </button>
            </div>
        }
    </>)
}