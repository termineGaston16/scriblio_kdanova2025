import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { DataBaseError, DataBaseSystemFailure } from "../../TAG/Infraestructure/tagError";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { Note_I } from "../Domain/note";

{/* method: POST */ }
export const createNewNote = async (id: string, title: string): Promise<string | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.")

        const tagsCollection = collection(db, "NOTES");

        const snapshot = await getDocs(tagsCollection);
        const tagCount = snapshot.size;

        if (tagCount >= 200) return "Se ha alcanzado el límite de 200 notas.";

        const tagRef = doc(tagsCollection, id);

        await setDoc(tagRef, {
            id: id,
            creationDate: new Date().toLocaleDateString(),
            isArchived: false,
            isCompleted: false,
            isFav: false,
            isFixed: false,
            modificationDate: null,
            title: title
        } as Note_I);

        return true;

    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};

{/* method: DELETE */ }
export const deleteNote = async (id: string): Promise<void | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        await deleteDoc(doc(db, "NOTES", id));

        return true;
    } catch (error) {
        if (error instanceof DataBaseError) throw error;

        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};