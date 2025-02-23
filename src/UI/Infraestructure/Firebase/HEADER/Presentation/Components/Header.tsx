import { Link } from "react-router-dom";
import TagList from "../../../../../../TAG/Presentation/Components/TagList";

export default function Header() {
    return (
        <header>
            <Link to={'/'}>
                <img src="" alt="logo de Scriblio" loading="lazy" />
                <h1>Scriblio</h1>
            </Link>

            <TagList />
        </header>
    )
}