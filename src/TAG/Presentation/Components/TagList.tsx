import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import WarningBlockToRemove from "../../../UI/ALERTS/Presentation/Components/WarningBlockToRemove";
import { useListTagByQuantity } from "../Hooks/useListTagByQuantity";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import FormToCreateNewTag from "./FormToCreateNewTag";
import { useListLocalContext } from "../Context/listLocalContext";
import { Toaster } from "sonner";
import Tags from "./Tags";
import { useRemoveTag } from "../Hooks/useRemoveTag";


export default function TagList() {

    const [showInfoCreateTag, setShowInfoCreateTag] = useState<boolean>(false);
    const [showInfoTag, setShowInfoTag] = useState<boolean>(false);

    const [showOptionsTag, setShowOptionsTag] = useState<{
        id: string,
        name: string
    } | null>(null)
    const [showTagDeleteWarning, setShowTagDeleteWarning] = useState<boolean>(false)

    const { tagListLocal, setTagListLocal } = useListLocalContext()
    const lastItemLocalRef = useRef<string>('')
    const { data, isLoading, isError, refetch, isFetching } = useListTagByQuantity(lastItemLocalRef.current)

    const [formToCreateNewTag, setFormToCreateNewTag] = useState<boolean>(false)

    const { mutate } = useRemoveTag()

    useEffect(() => {
        if (!data || data.length <= 0) return;

        setTagListLocal(prevList => [...prevList, ...data]);
    }, [data]);


    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItem = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTagListLocal(prevList => {
                    if (prevList.length > 0) {
                        const lastItemInList = prevList[prevList.length - 1]?.id;
                        if (lastItemInList !== lastItemLocalRef.current) {
                            lastItemLocalRef.current = lastItemInList;
                            refetch();
                        }
                    }
                    return prevList;
                });
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .5
        });

        observerRef.current.observe(node);
    }, []);

    return (<>
        <section>

            <button type="button">
                <AiFillPlusCircle
                    onClick={() => setFormToCreateNewTag(true)}
                    onMouseEnter={() => setShowInfoCreateTag(true)}
                    onMouseLeave={() => setShowInfoCreateTag(false)}
                />
            </button>

            <BsFillInfoCircleFill
                onMouseEnter={() => setShowInfoTag(true)}
                onMouseLeave={() => setShowInfoTag(false)}
            />

            {showInfoCreateTag &&
                <p>
                    crear un nuevo tag
                </p>
            }

            {showInfoTag &&
                <p>
                    arrastre el título de una nota para poder asignarle un tag
                </p>
            }

            <Tags
                lastItem={lastItem}
                setShowOptionsTag={setShowOptionsTag}
                setShowTagDeleteWarning={setShowTagDeleteWarning}
                showOptionsTag={showOptionsTag}
                tagListLocal={tagListLocal}
            />
        </section >


        {
            showTagDeleteWarning &&
            <WarningBlockToRemove
                warningText={`se eliminará el Tag ${showOptionsTag?.name}.`}
                option1Text={'cancelar'}
                option2Text={'eliminar'}
                option1Fc={() => setShowTagDeleteWarning(false)}
                option2Fc={() => {
                    if (!showOptionsTag) return;

                    mutate(showOptionsTag?.id)
                    setShowTagDeleteWarning(false)
                }}
            />
        }


        <AsynchronousResponse
            isLoading={isLoading || isFetching}
            isError={isError}
            loadingComponent={
                <span>Cargando Tags...</span>
            }
            errorComponent={
                <span>Error al obtener Tags</span>
            }
        />

        {
            formToCreateNewTag &&
            <FormToCreateNewTag
                closeForm={() => setFormToCreateNewTag(false)}
            />
        }

        <Toaster position="bottom-right" />
    </>)
}