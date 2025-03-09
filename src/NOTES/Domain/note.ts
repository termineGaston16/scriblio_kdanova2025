export interface Note_I {
    id: string,
    title: string,
    creationDate: string,
    modificationDate: null | string,
    isFav: boolean,
    isNotCompleted: boolean,
    isCompleted: boolean,
    isFixed: boolean,
    isArchived: boolean,
    titleLowerCase: string
}