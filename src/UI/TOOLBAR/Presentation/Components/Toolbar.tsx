import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom"

export default function Toolbar() {

    const location = useLocation();
    const formatTitle = (path: string) => {
        if (typeof path !== 'string' || path === "/") return "tus notas";
        return path
            .replace("/", "")
            .replace(/^./, char => char.toUpperCase())
    };

    const [titleToolbar, setTitleToolbar] = useState<string>(() => formatTitle(location.pathname));
    const [showSettings, setShowSettings] = useState<boolean>(false)

    useEffect(() => {
        setTitleToolbar(formatTitle(location.pathname));
    }, [location.pathname]);

    return (
        <div role="toolbar">
            <h2>{titleToolbar}</h2>
            <a href="" target="_blank" rel="noopener noreferrer">
                KDA/NOVA 2025
            </a>

            <label htmlFor="">Buscar</label>
            <input type="search" name="" id="" />

            <button
                type="button"
                onClick={() => setShowSettings(true)}
            >
                <IoSettingsOutline />
            </button>


        </div>
    )
}