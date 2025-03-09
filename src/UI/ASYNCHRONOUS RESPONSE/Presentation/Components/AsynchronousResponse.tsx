import { JSX } from "react"

interface Props {
    isLoading: boolean,
    isError: boolean,
    loadingComponent: JSX.Element,
    errorComponent: JSX.Element
};

const AsynchronousResponse: React.FC<Props> = ({
    isLoading,
    isError,
    loadingComponent,
    errorComponent
}) => {
    if (typeof isLoading !== 'boolean' || typeof isError !== 'boolean') return null;

    if (isLoading) return loadingComponent;
    if (isError) return errorComponent;
    return null;
};

export default AsynchronousResponse;