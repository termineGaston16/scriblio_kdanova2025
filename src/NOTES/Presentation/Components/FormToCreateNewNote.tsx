import { FormEvent, useEffect, useState } from "react";
import { validateTitleCreateNote } from "../../Application/noteAPP";
import { useAppDispatch, useAppSelector } from "../../../UI/Application/Redux/hooks/hooks";
import { } from "@reduxjs/toolkit";
import { addMessage, cleanMessage } from "../../../UI/Application/Redux/slice/alertMessageSlice";
import { useCreateNewNote } from "../Hooks/useCreateNewNote";

interface Props {
    closeForm: () => void
};

const FormToCreateNewNote: React.FC<Props> = ({ closeForm }) => {

    const alertMessage = useAppSelector(state => state.alertMessage);
    const dispatch = useAppDispatch();

    const { mutate, isSuccess, data } = useCreateNewNote()

    const handleCreateNewNote = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const titleNote = new FormData(e.currentTarget).get('titleNewNote') as string;
        const messageError = validateTitleCreateNote(titleNote);

        if (messageError) return dispatch(addMessage(messageError));
        dispatch(cleanMessage());

        mutate({ id: crypto.randomUUID() as string, title: titleNote })
    };
    const [showInputInfo, setShowInputInfo] = useState<null | string>(null);

    useEffect(() => {
        if (isSuccess && typeof data === 'boolean' && data) closeForm();
    }, [isSuccess])

    return (<>
        <form onSubmit={handleCreateNewNote}>

            <label
                htmlFor="titleNewNote">título para la nueva nota:</label>
            <input
                onMouseLeave={() => setShowInputInfo(null)}
                onMouseEnter={() => setShowInputInfo(`
                 *debe contener entre 3 - 50 caracteres.
                 *no se permiten caracters especiales.
                 `)}

                type="text"
                name="titleNewNote"
                id="titleNewNote" />
            {alertMessage && <span>{alertMessage}</span>}
            {showInputInfo && <span>{showInputInfo}</span>}

            <button
                type="button"
                onClick={() => {
                    dispatch(cleanMessage())
                    closeForm()
                }}
            >atrás</button>
            <button type="submit">crear</button>
        </form>

        {
            isSuccess && typeof data === 'string' &&
            <div>
                {data}
                <button
                    onClick={() => {
                        dispatch(cleanMessage())
                        closeForm()
                    }}
                    type="button">Okey</button>
            </div>
        }
    </>)
};

export default FormToCreateNewNote;