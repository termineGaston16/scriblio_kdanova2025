import { useState } from "react";
import { validateCreateNewTag } from "../../Application/tagApp";

interface Props {
    closeForm: () => void
};

const FormToCreateNewTag: React.FC<Props> = ({ closeForm }) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const titleTag = new FormData(e.currentTarget).get('nameNewTag') as string;
        const colorTag = new FormData(e.currentTarget).get('colorTag') as string;

        validateCreateNewTag(titleTag, colorTag)
    };
    const [messageInfo, setMessageInfo] = useState<string | null>(null)

    return (
        <form onSubmit={handleSubmit}>
            <button
                type="button"
                onClick={() => closeForm()}
            >X</button>

            <h2>Crear un nuevo Tag</h2>

            <label htmlFor="nameNewTag">Nombre del Tag: </label>
            <input
                type="text"
                name="nameNewTag"
                id="nameNewTag"
                onMouseLeave={() => setMessageInfo(null)}
                onMouseEnter={() => setMessageInfo(` *introduce un nombre para el Tag. 
                    *debe contener entre 3 - 50 caracteres.
                    *no se permiten caracters especiales.
                    `)}
            />

            <label htmlFor="colorTag">Asigna un color al Tag</label>
            <input
                type="color"
                name="colorTag"
                id="colorTag"
                onMouseLeave={() => setMessageInfo(null)}
                onMouseEnter={() => setMessageInfo(`*asigna un color para representar el Tag. `)}
            />

            {
                messageInfo &&
                <p style={{ whiteSpace: "pre-line" }}>(i) {messageInfo}</p>
            }
            <button type="submit">Crear</button>
        </form>
    )
};

export default FormToCreateNewTag;