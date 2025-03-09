export const validateCreateNewTag = (titleTag: string, colorTag: string): string | null => {

    if (typeof titleTag !== 'string' || titleTag.length <= 0) return 'el título no puede estar vacío.';
    if (typeof colorTag !== 'string' || colorTag.length <= 0) return 'el color no puede estar vacío.';

    const titleFiltred = titleTag
        .trim()
        .replace(/[^\w\s]/g, '');

    if (titleFiltred.length < 3 || titleFiltred.length > 50) return 'el título debe tener entre 3 - 50 caracters';

    return null;
}