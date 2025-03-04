import { ClassNotes_E } from "../Domain/classNotes";

export const validateTitleCreateNote = (title: string): null | string => {
    if (typeof title !== 'string' || title.length <= 0) return 'el título no puede estar vacío.';

    const titleFiltred = title
        .trim()
        .replace(/[^\w\s]/g, '');

    if (titleFiltred.length <= 0) return 'el título no puede estar vacío.'
    if (titleFiltred.length < 3 || titleFiltred.length > 50) return 'el título debe contener una longitud entre 3 - 50 caracters.'

    return null;
}

export const validateLocationToFiltred = (location: string): ClassNotes_E | '' => {
    if (typeof location !== 'string') return '';

    if (location === '/') return '';

    if (location === '/favoritos') return ClassNotes_E.FAV;
    if (location === '/pendientes') return ClassNotes_E.NOT_COMPLETED;
    if (location === '/completadas') return ClassNotes_E.COMPLETED;
    if (location === '/fijas') return ClassNotes_E.FIX;
    if (location === '/archivadas') return ClassNotes_E.ARCH;

    return '';
}