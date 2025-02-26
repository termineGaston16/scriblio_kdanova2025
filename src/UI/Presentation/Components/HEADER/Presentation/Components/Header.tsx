import { Link } from "react-router-dom";
import TagList from "../../../../../../TAG/Presentation/Components/TagList";
import Navbar from "../../../NAVBAR/Presentation/Components/Navbar";
import { ListLocalProvider } from "../../../../../../TAG/Presentation/Context/listLocalContext";

export default function Header() {
    return (
        <header style={{ backgroundColor: '#979797' }}>
            <Link to={'/'}>
                <img src="" alt="logo de Scriblio" loading="lazy" />
                <h1>Scriblio</h1>
            </Link>

            <Navbar />

            {/* <ListLocalProvider>
                <TagList />
            </ListLocalProvider> */}
        </header>
    )

}

