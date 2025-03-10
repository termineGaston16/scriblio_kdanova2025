import { Link } from "react-router-dom";
import TagList from "../../../../../../TAG/Presentation/Components/TagList";
import Navbar from "../../../NAVBAR/Presentation/Components/Navbar";

import '../Styles/header.css'

export default function Header() {
    return (
        <header
            className="Header"
        >
            <Link
                className="Header__Link"
                to={'/'}>
                <img
                    src='../../../../../public/logo_scriblio.png'
                    alt="logo de Scriblio"
                    loading="lazy"
                    className="Header__Link__logo"
                />
                <h1
                    className="Header__Link__title"
                >Scriblio</h1>
            </Link>

            <Navbar />
            <TagList />
        </header>
    )

}

