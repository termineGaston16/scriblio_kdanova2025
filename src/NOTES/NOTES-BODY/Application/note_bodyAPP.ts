export const theBodyChanged = (bodyLocal: string, bodyFromCall: string): boolean => {
    return bodyLocal === bodyFromCall
};