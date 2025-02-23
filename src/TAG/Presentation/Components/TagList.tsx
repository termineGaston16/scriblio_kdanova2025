import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FiMinusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import WarningBlockToRemove from "../../../UI/ALERTS/Presentation/Components/WarningBlockToRemove";
import { Tag_I } from "../../Domain/tag";
import { useListTagByQuantity } from "../Hooks/useListTagByQuantity";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import FormToCreateNewTag from "./FormToCreateNewTag";


export default function TagList() {

    const [showInfoCreateTag, setShowInfoCreateTag] = useState<boolean>(false);
    const [showInfoTag, setShowInfoTag] = useState<boolean>(false);

    const [showOptionsTag, setShowOptionsTag] = useState<string | null>(null)
    const [showTagDeleteWarning, setShowTagDeleteWarning] = useState<boolean>(false)

    const [tagListLocal, setTagListLocal] = useState<Tag_I[]>([]);
    const lastItemLocalRef = useRef<string>('')
    const { data, isLoading, isError, refetch } = useListTagByQuantity(2, lastItemLocalRef.current)

    const [formToCreateNewTag, setFormToCreateNewTag] = useState<boolean>(false)

    useEffect(() => {
        if (!data || data.length <= 0) return;

        setTagListLocal(prevList => [...data.slice().reverse(), ...prevList]);
    }, [data]);


    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItem = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTagListLocal(prevList => {
                    if (prevList.length > 0) {
                        const lastItemInList = prevList[0]?.id;
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

    return (
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

            <ul>
                {
                    tagListLocal.map((tag, index, array) => {
                        {

                            const isLast = index === array.length - 1;
                            const { title, id } = tag

                            return (<li
                                ref={isLast ? lastItem : null}
                                key={id}
                                onMouseEnter={() => setShowOptionsTag(id)}
                            >
                                <Link to={'/'}>
                                    <span>{title}</span>
                                </Link>

                                {
                                    showOptionsTag === id &&
                                    <button
                                        type="button"
                                        onClick={() => setShowTagDeleteWarning(true)}
                                    >
                                        <FiMinusCircle />
                                    </button>
                                }
                            </li>)
                        }
                    })
                }
            </ul>

            {
                showTagDeleteWarning &&
                <WarningBlockToRemove
                    warningText={`se eliminará el Tag ${showOptionsTag}.`}
                    option1Text={'cancelar'}
                    option2Text={'eliminar'}
                    option1Fc={() => setShowTagDeleteWarning(false)}
                    option2Fc={() => alert(`Tag ${showOptionsTag} borrado!`)}
                />
            }


            <AsynchronousResponse
                isLoading={isLoading}
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
        </section >
    )
}