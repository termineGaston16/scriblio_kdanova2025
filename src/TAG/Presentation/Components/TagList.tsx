import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FiMinusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function TagList() {

    const [showInfoCreateTag, setShowInfoCreateTag] = useState<boolean>(false);
    const [showInfoTag, setShowInfoTag] = useState<boolean>(false);



    return (
        <section>

            <button type="button">
                <AiFillPlusCircle
                    onMouseOver={() => setShowInfoCreateTag(true)}
                    onMouseOut={() => setShowInfoCreateTag(false)}
                />
            </button>

            <BsFillInfoCircleFill
                onMouseOver={() => setShowInfoTag(true)}
                onMouseOut={() => setShowInfoTag(false)}
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

            {/* Utilizar css para ocultar el boton */}
            <ul>
                <li>
                    <Link to={'/'}>
                        <span>name tag</span>
                    </Link>

                    <button
                        type="button">
                        <FiMinusCircle />
                    </button>
                </li>
            </ul>

        </section>
    )
}