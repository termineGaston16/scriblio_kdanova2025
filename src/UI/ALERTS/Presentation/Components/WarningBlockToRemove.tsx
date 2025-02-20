interface Props {
    warningText: string,
    option1Text: string,
    option2Text: string,
    option1Fc: () => void,
    option2Fc: () => void
};

const WarningBlockToRemove: React.FC<Props> = ({ warningText, option1Text, option2Text, option1Fc, option2Fc }) => {
    return (
        <div>
            <p>{warningText}</p>
            <button
                type="button"
                onClick={() => option1Fc()}
            >
                {option1Text}
            </button>
            <button
                type="button"
                onClick={() => option2Fc()}
            >
                {option2Text}
            </button>
        </div>
    )
};

export default WarningBlockToRemove;