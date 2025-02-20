import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FiMinusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import WarningBlockToRemove from "../../../UI/ALERTS/Presentation/Components/WarningBlockToRemove";

export default function TagList() {

    const [showInfoCreateTag, setShowInfoCreateTag] = useState<boolean>(false);
    const [showInfoTag, setShowInfoTag] = useState<boolean>(false);

    const [showOptionsTag, setShowOptionsTag] = useState<string | null>(null)
    const [showTagDeleteWarning, setShowTagDeleteWarning] = useState<boolean>(false)


    return (
        <section>

            <button type="button">
                <AiFillPlusCircle
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
                <li
                    onMouseEnter={() => setShowOptionsTag('name tag')}
                    onMouseLeave={() => setShowOptionsTag(null)}
                >
                    <Link to={'/'}>
                        <span>name tag 1</span>
                    </Link>

                    {
                        showOptionsTag === 'name tag' &&
                        <button
                            type="button"
                            onClick={() => setShowTagDeleteWarning(true)}
                        >
                            <FiMinusCircle />
                        </button>
                    }
                </li>
            </ul>

            {
                showTagDeleteWarning &&
                <WarningBlockToRemove
                    warningText={`se eliminará el Tag "name tag".`}
                    option1Text={'cancelar'}
                    option2Text={'eliminar'}
                    option1Fc={() => setShowTagDeleteWarning(false)}
                    option2Fc={() => alert('Tag borrado!')}
                />
            }

        </section>
    )
}