import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useGetNoteByID } from "../Hooks/useGetNoteByID";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { useGetTagsFromNote } from "../Hooks/useGetTagsFromNote";

export default function NoteDetails() {

    const { IDNote_url } = useParams();
    const [idNoteLocal, setIDNoteLocal] = useState<string | null>(null)

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

                <span>Última vez editado:</span>
                <span>
                    {
                        dataNoteLocal.modificationDate ? dataNoteLocal.modificationDate : dataNoteLocal.creationDate
                    }
                </span>
            </div>
        }

        {!isLoadingNoteLocal && !isFetchingNoteLocal && !dataNoteLocal
            && <span>No se encontró la nota</span>}
    </>)
}