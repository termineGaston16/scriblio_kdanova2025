import React, { useState } from "react";
import { CiLight } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa";
import { MdNightlight } from "react-icons/md";

interface Props {
    setShowSettings: () => void
};

const GeneralSettings: React.FC<Props> = ({ setShowSettings }) => {

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>('ES_lang');
    const [fontStyle, setFontStyle] = useState<string>("serif");
    const [fontSize, setFontSize] = useState<string>(2);


    return (
        <section>
            <button
                onClick={() => setShowSettings()}
                type="button">
                <FaAngleRight />
            </button>

            <h2>Ajustes</h2>

            {/* // DARK MODE */}
            {
                darkMode
                    ? <button
                        onClick={() => setDarkMode(false)}
                        type="button"
                    ><CiLight />
                    </button>
                    : <button
                        onClick={() => setDarkMode(true)}
                        type="button"
                    ><MdNightlight />
                    </button>
            }

            {/* LANGUAGE */}
            <div>
                <button
                    onClick={() => setLanguage('ES_lang')}
                    type="button">ESP</button>
                <button
                    onClick={() => setLanguage('EN_lang')}
                    type="button">ENG</button>
            </div>


            {/* FONT STYLE */}
            <select
                onChange={(e) => setFontStyle(e.target.value)}
            >
                <option value="serif">serif</option>
                <option value="sans-serif">sans-serif</option>
                <option value="monospace-serif">monospace</option>
                <option value="cursive">cursive</option>
                <option value="fantasy">fantasy</option>
                <option value="Arial">arial</option>
                <option value="Helvetica">helvetica</option>
                <option value='"Times New Roman"'>times new roman</option>
                <option value="Times">times</option>
                <option value='"Courier New"'>courier new</option>
                <option value="Courier">courier</option>
                <option value="Georgia">georgia</option>
                <option value="Verdana">verdana</option>
            </select>

            {/* FONT SIZE */}
            <input
                min={2}
                max={200}
                type="range"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
            />
            <span>{fontSize}</span>

        </section>
    )
};

export default GeneralSettings;