import { useEffect } from "react";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { useGetBodyNoteByID } from "../../NOTES-BODY/Presentation/Hooks/useGetBodyNoteByID";

interface Props {
    idNoteLocal: string | null,
    bodyLocal: string,
    setBodyLocal: React.Dispatch<React.SetStateAction<string>>,
    setBodyFromCall: React.Dispatch<React.SetStateAction<string>>,
    setBodyNoteLocal: React.Dispatch<React.SetStateAction<string | null>>
};

const NoteContent: React.FC<Props> = ({
    idNoteLocal,
    bodyLocal,
    setBodyLocal,
    setBodyFromCall,
    setBodyNoteLocal
}) => {

    const {
        data: dataBodyNote,
        isLoading: isLoadingBodyNote,
        isFetching: isFetchingBodyNote,
        isError: isErrorBodyNote
    } = useGetBodyNoteByID(idNoteLocal);

    useEffect(() => {
        if (!dataBodyNote) return;
        setBodyLocal(dataBodyNote.body)
        setBodyFromCall(dataBodyNote.body)
        setBodyNoteLocal(dataBodyNote.id)
    }, [dataBodyNote])

    return (<>

        <AsynchronousResponse
            isLoading={isLoadingBodyNote || isFetchingBodyNote}
            isError={isErrorBodyNote}
            loadingComponent={
                <span>Cargando note body...</span>
            }
            errorComponent={
                <span>Error al obtener el note body</span>
            }
        />

        {
            !isLoadingBodyNote && !isFetchingBodyNote && dataBodyNote &&
            <div role="textbox">
                <textarea
                    value={bodyLocal}
                    onChange={(e) => setBodyLocal(e.currentTarget.value)}
                ></textarea>
            </div>
        }

        {
            !isLoadingBodyNote && !isFetchingBodyNote && !dataBodyNote &&
            <span>Note body no obtenido</span>
        }

    </>)
};

export default NoteContent;