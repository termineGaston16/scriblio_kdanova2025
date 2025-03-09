import { useEffect, useState } from "react"
import { defineTitleToolbar } from "../../Application/toolbarApp"
import { useLocation } from "react-router-dom"
import { CiSearch, CiSettings } from "react-icons/ci";
import { useWordSearchContext } from "../Context/WordSearchContext";

export default function Toolbar() {

    const location = useLocation();
    const [titleToolbar, setTitleToolbar] = useState<string>(
        defineTitleToolbar(location.pathname))
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const { setWordSearch, setShowLisSearch } = useWordSearchContext();

    useEffect(() => {
        setTitleToolbar(defineTitleToolbar(location.pathname));
    }, [location.pathname])

    const handleSubmitWordSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const wordKey = new FormData(e.currentTarget).get('wordSearch') as string;
        if (wordKey.length <= 0) return;
        setWordSearch(wordKey);
    };

    return (<>
        <div role="toolbar">
            <h2>{titleToolbar}</h2>

            <a href="" target="_blank" rel="noopener noreferrer">
                © KDA/NOVA 2025
            </a>

            <form
                onSubmit={(e) => handleSubmitWordSearch(e)}
                method="get">
                <input
                    onClick={() => setShowLisSearch(true)}

                    type="search"
                    name="wordSearch"
                    id="wordSearch"
                    maxLength={60}
                    minLength={1}
                />
                <button type="submit"><CiSearch /></button>
            </form>

            <button type="button"><CiSettings /></button>
        </div>

        {/* {
            showSettings &&
            <section></section>
        } */}
    </>)
};