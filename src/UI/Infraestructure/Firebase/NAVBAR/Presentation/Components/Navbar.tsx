import { Link } from "react-router-dom";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { TiDeleteOutline, TiPinOutline } from "react-icons/ti";
import { IoArchiveOutline } from "react-icons/io5";
import { useState } from "react";

export default function Navbar() {

    const [showInfoNavbar, setShowInfoNavbar] = useState<boolean>(false)

    return (
        <nav>
            <BsFillInfoCircleFill
                onMouseEnter={() => setShowInfoNavbar(true)}
                onMouseLeave={() => setShowInfoNavbar(false)}
            />

            {showInfoNavbar &&
                <p>
                    arrastre el título de una nota para poder asignarle una clase
                </p>
            }

            <ul>
                <li>
                    <Link to={'/'}>
                        <span>todas las listas</span>
                        <MdOutlineNotes />
                    </Link>
                </li>
                <li>
                    <Link to={'/favoritos'}>
                        <span>favoritos</span>
                        <IoIosStarOutline />
                    </Link>
                </li>
                <li>
                    <Link to={'/pendientes'}>
                        <span>pendientes</span>
                        <FaCheck />
                    </Link>
                </li>
                <li>
                    <Link to={'/completadas'}>
                        <span>completadas</span>
                        <FaCheckDouble />
                    </Link>
                </li>
                <li>
                    <Link to={'/fijas'}>
                        <span>fijas</span>
                        <TiPinOutline />
                    </Link>
                </li>
                <li>
                    <Link to={'/archivadas'}>
                        <span>archivadas</span>
                        <IoArchiveOutline />
                    </Link>
                </li>
                <li>
                    <button
                        type="button"
                    >
                        <span>borrar nota</span>
                        <TiDeleteOutline />
                    </button>
                </li>
            </ul>
        </nav>
    )
}