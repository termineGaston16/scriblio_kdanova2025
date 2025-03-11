export const validateCreateNewTag = (titleTag: string, colorTag: string): string | null => {

    if (typeof titleTag !== 'string' || titleTag.length <= 0) return 'El título NO puede estar vacío.';
    if (typeof colorTag !== 'string' || colorTag.length <= 0) return 'El color debe seleccionarse.';

    const titleFiltred = titleTag
        .trim()
        .replace(/[^\w\s]/g, '');

    if (titleFiltred.length < 3 || titleFiltred.length > 50) return 'El Título debe tener entre 3 - 50 caracteres.';

    return null;
}