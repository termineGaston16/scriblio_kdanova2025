import { Link } from "react-router-dom";

export default function NotePreviewList() {
    return (
        <ul>
            <li>
                <Link to={`nota=id:${crypto.randomUUID}`}>
                    <h2>título de la nota</h2>
                    <span>fecha de creación</span>
                </Link>
            </li>
        </ul>
    )
}