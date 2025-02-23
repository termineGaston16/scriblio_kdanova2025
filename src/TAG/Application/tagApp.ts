export const validateCreateNewTag = (titleTag: string, colorTag: string): void => {

    if (typeof titleTag !== 'string' || typeof colorTag !== 'string') return; // alert redux
    if (titleTag.length <= 0 || colorTag.length <= 0) return; // alert redux

    const titleFiltred = titleTag
        .trim()
        .replace(/[^\w\s]/g, '')

    if (titleFiltred.length < 3 || titleFiltred.length > 50) return; // alert redux

    const arrayNotesID: string[] = [];
    const id = crypto.randomUUID();
    const title = titleFiltred;
    const colorTag_ = colorTag;
}