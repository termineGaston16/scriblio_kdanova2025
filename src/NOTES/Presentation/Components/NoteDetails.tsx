import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useGetNoteByID } from "../Hooks/useGetNoteByID";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { useGetTagsFromNote } from "../Hooks/useGetTagsFromNote";


interface Props {
    idNoteLocal: string | null,
    setIDNoteLocal: React.Dispatch<React.SetStateAction<string | null>>,
    setLogosFromNoteLocal: React.Dispatch<React.SetStateAction<{
        modificationDate: null | string;
        isFav: boolean;
        isNotCompleted: boolean;
        isCompleted: boolean;
        isFixed: boolean;
        isArchived: boolean;
    } | null>>
}

const NoteDetails: React.FC<Props> = ({ idNoteLocal, setIDNoteLocal, setLogosFromNoteLocal }) => {

    const { IDNote_url } = useParams();

    useEffect(() => {
        if (!IDNote_url) return;
        setIDNoteLocal(IDNote_url);
    }, [IDNote_url])

    const {
        data: dataNoteLocal,
        isLoading: isLoadingNoteLocal,
        isFetching: isFetchingNoteLocal,
        isError: isErrorNoteLocal
    } = useGetNoteByID(idNoteLocal)

    const {
        data: dataTagListNames,
        isLoading: isLoadingTagListNames,
        isFetching: isFetchingTagListNames,
        isError: isErrorTagListNames
    } = useGetTagsFromNote(idNoteLocal);

    useEffect(() => {
        if (!dataNoteLocal) {
            setLogosFromNoteLocal(null);
            return
        };

        const {
            isArchived,
            isCompleted,
            isFav,
            isFixed,
            isNotCompleted,
            modificationDate
        } = dataNoteLocal;

        setLogosFromNoteLocal({
            isArchived: isArchived,
            isCompleted: isCompleted,
            isFav: isFav,
            isFixed: isFixed,
            isNotCompleted: isNotCompleted,
            modificationDate: modificationDate
        })
    }, [dataNoteLocal])

    return (<>

        <AsynchronousResponse
            isLoading={isLoadingNoteLocal || isFetchingNoteLocal}
            isError={isErrorNoteLocal}
            loadingComponent={
                <span style={{ color: 'red' }}>Cargando nota...</span>
            }
            errorComponent={
                <span>Ocurrió un error al obtener la nota</span>
            }
        />

        {
            dataNoteLocal &&
            <div>
                <h2>{dataNoteLocal.title}</h2>

                <span>TAGS:</span>
                {<>
                    <AsynchronousResponse
                        isLoading={isLoadingTagListNames || isFetchingTagListNames}
                        isError={isErrorTagListNames}
                        loadingComponent={
                            <span>Cargando tags...</span>
                        }
                        errorComponent={
                            <span>Ocurrió un error al obtener los tags</span>
                        }
                    />

                    {
                        dataTagListNames &&
                        <ul>
                            {
                                dataTagListNames.map((title, index) =>
                                    <li key={index}>
                                        {title}
                                    </li>
                                )
                            }
                        </ul>
                    }
                </>}

                <span>Fecha de creación:</span>
                <span>{dataNoteLocal.creationDate}</span>
            </div>
        }

        {!isLoadingNoteLocal && !isFetchingNoteLocal && !dataNoteLocal
            && <span>No se encontró la nota</span>}
    </>)
}

export default NoteDetails;