import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import WarningBlockToRemove from "../../../UI/ALERTS/Presentation/Components/WarningBlockToRemove";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import FormToCreateNewTag from "./FormToCreateNewTag";
import { Toaster } from "sonner";
import Tags from "./Tags";
import { Tag_I } from "../../Domain/tag";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useGetTags } from "../Hooks/useGetTags";
import { useRemoveTag } from "../Hooks/useRemoveTag";


export default function TagList() {

    const [showInfoCreateTag, setShowInfoCreateTag] = useState<boolean>(false);
    const [showInfoTag, setShowInfoTag] = useState<boolean>(false);
    const [showTagDeleteWarning, setShowTagDeleteWarning] = useState<boolean>(false);
    const [formToCreateNewTag, setFormToCreateNewTag] = useState<boolean>(false);
    const [showOptionsTag, setShowOptionsTag] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const queryClient = useQueryClient();
    const [tagListLocal, setTagListLocal] = useState<Tag_I[]>(() => {
        return queryClient.getQueryData<InfiniteData<Tag_I[]>>(['tagList'])?.pages.flat() ?? [];
    });

    const {
        data: dataTagList,
        hasNextPage: hasNextPageTagList,
        fetchNextPage: fetchNextPageTagList,
        isLoading: isLoadingTagList,
        isError: isErrorTagList,
        isFetching: isFetchingTagList
    } = useGetTags();

    const {
        mutate: mutateUseRemoveTag
    } = useRemoveTag();

    useEffect(() => {
        if (!dataTagList || dataTagList.pages.length <= 0) return;

        setTagListLocal(dataTagList.pages.flat());
    }, [dataTagList?.pages])

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItem = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                if (hasNextPageTagList) fetchNextPageTagList();
            }
        })

        if (node) observerRef.current.observe(node);
    }, [hasNextPageTagList])


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
                setShowTagDeleteWarning={setShowTagDeleteWarning}
                tagListLocal={tagListLocal}
                setShowOptionsTag={setShowOptionsTag}
                showOptionsTag={showOptionsTag}
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

                    mutateUseRemoveTag(showOptionsTag?.id)
                    setShowTagDeleteWarning(false)
                }}
            />
        }


        <AsynchronousResponse
            isLoading={isLoadingTagList || isFetchingTagList}
            isError={isErrorTagList}
            loadingComponent={
                <span
                    style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        backgroundColor: 'yellow'
                    }}
                >Cargando más notas...</span>
            }
            errorComponent={
                <span style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    backgroundColor: 'red'
                }}>Error al obtener notas</span>
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