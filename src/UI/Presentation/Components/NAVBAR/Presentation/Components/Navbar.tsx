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

export default function Navbar() {

    const [showInfoNavbar, setShowInfoNavbar] = useState<boolean>(false);
    const [showAlertError, setShowAlertError] = useState<boolean>(false);
    const { mutate, data, isSuccess } = useDetermineClassToNote();

    const handleDropNavbar = (e: React.DragEvent<HTMLLIElement>, zone: string) => {
        e.preventDefault();
        if (zone === 'borrar nota') return;

        const idNote = e.dataTransfer.getData('idNote');
        const classStyle = validateLocationToFiltred(zone);
        if (!classStyle) return;

        mutate({
            id: idNote,
            classStyle: classStyle,
            value: true
        })
    }

    useEffect(() => {
        if (typeof data === 'string') setShowAlertError(true);
    }, [isSuccess])

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
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <Link to={'/favoritos'}>
                        <span>favoritos</span>
                        <IoIosStarOutline />
                    </Link>
                </li>
                <li
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropNavbar(e, '/pendientes')}
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
                    onDrop={(e) => handleDropNavbar(e, 'borrar nota')}
                    style={{
                        border: '1px solid aqua',
                        height: '30px'
                    }}>
                    <button
                        type="button"
                    >
                        <span>borrar nota</span>
                        <TiDeleteOutline />
                    </button>
                </li>
            </ul>
        </nav>

        {
            showAlertError &&
            <div>
                {data}
                <button
                    onClick={() => setShowAlertError(false)}
                    type="button">
                    Okey
                </button>
            </div>
        }
    </>)
}