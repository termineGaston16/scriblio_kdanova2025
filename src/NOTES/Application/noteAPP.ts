export const validateTitleCreateNote = (title: string): null | string => {
    const titleFiltred = title
        .trim()
        .replace(/[^/w/s]/g, '')

    if (titleFiltred.length <= 0) return 'el título no puede estar vacío.'
    if (titleFiltred.length < 3 || titleFiltred.length > 50) return 'el título debe contener una longitud entre 3 - 50 caracters.'

    return null;
}