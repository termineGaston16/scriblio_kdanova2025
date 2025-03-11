import { useEffect, useState } from "react";
import { validateCreateNewTag } from "../../Application/tagApp";
import { useAppDispatch, useAppSelector } from "../../../UI/Application/Redux/hooks/hooks";
import { addMessage, cleanMessage } from '../../../UI/Application/Redux/slice/alertMessageSlice'
import { useAddNewTag } from "../Hooks/useAddNewTag";

import '../Styles/formToCreateNewTag.css'

interface Props {
    closeForm: () => void
};

const FormToCreateNewTag: React.FC<Props> = ({ closeForm }) => {

    const messageAlert = useAppSelector((state) => state.alertMessage);
    const dispatch = useAppDispatch();

    const [messageInfo, setMessageInfo] = useState<string | null>(null);

    const {
        mutate: mutateUseAddNewTag,
        isSuccess: isSuccessUseAddNewTag,
        data: dataUseAddNewTag
    } = useAddNewTag();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const titleTag = new FormData(e.currentTarget).get('nameNewTag') as string;
        const colorTag = new FormData(e.currentTarget).get('colorTag') as string;

        const errorMessage = validateCreateNewTag(titleTag, colorTag);
        if (errorMessage) return dispatch(addMessage(errorMessage));
        dispatch(cleanMessage());

        mutateUseAddNewTag({ title: titleTag, colorTag: colorTag, id: crypto.randomUUID() as string });
        closeForm();
    };

    useEffect(() => {
        if (isSuccessUseAddNewTag && typeof dataUseAddNewTag === 'boolean' && dataUseAddNewTag) closeForm();
    }, [isSuccessUseAddNewTag])

    return (<>
        <form
            className="FormToCreateNewTag"
            onSubmit={handleSubmit}>
            <div className="FormToCreateNewTag__closeForm__container">
                <button
                    className="FormToCreateNewTag__closeForm"
                    type="button"
                    onClick={() => closeForm()}
                >⨉</button>
            </div>

            <h2 className="FormToCreateNewTag__titleInfo">Crear nuevo Tag</h2>

            <label
                className="FormToCreateNewTag__labelNameTag"
                htmlFor="nameNewTag">Nombre del Tag: </label>
            <input
                className="FormToCreateNewTag__nameTagInput"
                type="text"
                name="nameNewTag"
                id="nameNewTag"
                onMouseLeave={() => setMessageInfo(null)}
                onMouseEnter={() => setMessageInfo(`
                    Debe contener entre 3 y 50 caracteres.  
                    No se permiten caracteres especiales.
                    `)}
            />

            <label
                className="FormToCreateNewTag__labelColorTag"
                htmlFor="colorTag">Color Representativo:</label>
            <input
                className="FormToCreateNewTag__colorTagInput"
                type="color"
                name="colorTag"
                id="colorTag"
                onMouseLeave={() => setMessageInfo(null)}
                onMouseEnter={() => setMessageInfo(`
                    El color represantará al Tag. 
                `)}
            />

            {
                messageAlert &&
                <aside
                    className="FormToCreateNewTag__messageError"
                >{messageAlert}</aside>
            }
            {
                messageInfo &&
                <aside
                    className="FormToCreateNewTag__messageInfo"
                >[i] {messageInfo}</aside>
            }
            <button
                className="FormToCreateNewTag__btnCreateNewTag"
                type="submit">CREAR</button>
        </form>

        {
            typeof dataUseAddNewTag === 'string' &&
            <div
                className="AlertFetch"
            >
                <span
                    className="AlertFetch__text"
                >{dataUseAddNewTag}</span>
                <button
                    className="AlertFetch__close"
                    onClick={() => closeForm()}
                    type="button">Okey</button>
            </div>
        }
    </>)
};

export default FormToCreateNewTag;