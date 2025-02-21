import { Link } from "react-router-dom";

interface Props {
    title: string,
    date: string,
    id: number
};

const NotePreview: React.FC<Props> = ({ title, date, id }) => {
    return (
        <Link
            to={`/note/${id}`}>
            <h3>{title}</h3>
            <span>{date}</span>
        </Link>
    )
};

export default NotePreview;