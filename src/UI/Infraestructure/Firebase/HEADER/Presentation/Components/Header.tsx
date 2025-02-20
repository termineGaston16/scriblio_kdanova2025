import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <Link to={'/'}>
                <img src="" alt="logo de Scriblio" loading="lazy" />
                <h1>Scriblio</h1>
            </Link>


        </header>
    )
}