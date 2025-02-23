import { addMessage, cleanMessage } from '../../UI/Application/Redux/slice/alertMessageSlice'
import { AppDispatch } from '../../UI/Application/Redux/store/storeRedux';


export const validateCreateNewTag = (titleTag: string, colorTag: string, dispatch: AppDispatch): void => {

    if (typeof titleTag !== 'string' || titleTag.length <= 0) {
        dispatch(addMessage('el título no puede estar vacío.'))
        return;
    };
    if (typeof colorTag !== 'string' || colorTag.length <= 0) {
        dispatch(addMessage('el color no puede estar vacío.'))
        return;
    };


    const titleFiltred = titleTag
        .trim()
        .replace(/[^\w\s]/g, '')

    if (titleFiltred.length < 3 || titleFiltred.length > 50) {
        dispatch(addMessage('el título debe tener entre 3 - 50 caracters'))
        return;
    };

    dispatch(cleanMessage())
    const arrayNotesID: string[] = [];
    const id = crypto.randomUUID();
    const title = titleFiltred;
    const colorTag_ = colorTag;
}