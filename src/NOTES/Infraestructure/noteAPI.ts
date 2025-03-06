import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { DataBaseError, DataBaseSystemFailure } from "../../TAG/Infraestructure/tagError";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { Note_I } from "../Domain/note";
import { ClassNotes_E } from "../Domain/classNotes";

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
            isNotCompleted: true,
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

{/* method: GET */ }
export const getBruteNotes = async (lastID: string | null): Promise<Note_I[]> => {
    if (!db) throw new DataBaseError("The database is not initialized.");

    try {
        const tagsRef = collection(db, "NOTES");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "NOTES", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(tagsRef, orderBy("id"), startAfter(lastDocSnap), limit(6));
        } else {
            q = query(tagsRef, orderBy("id"), limit(6));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note_I[];
    } catch (error) {

        if (error instanceof DataBaseError) {
            throw error;
        }

        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};

{/* method: GET */ }
export const getFiltredByClassNotes = async (
    lastID: string | null,
    classStyle: ClassNotes_E
) => {
    if (!db) throw new DataBaseError("The database is not initialized.");

    try {
        const tagsRef = collection(db, "NOTES");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "NOTES", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(
                tagsRef,
                startAfter(lastDocSnap),
                where(classStyle, "==", true),
                limit(6)
            );
        } else {
            q = query(tagsRef, where(classStyle, "==", true), limit(6));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note_I[];
    } catch (error) {

        if (error instanceof DataBaseError) {
            throw error;
        }

        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: PATCH */ }
export const determineClassToNote = async (id: string, classStyle: ClassNotes_E, value: boolean): Promise<string | true> => {
    if (!db) throw new DataBaseError("The database is not initialized.");

    try {
        const noteRef = doc(db, "NOTES", id);
        const noteSnap = await getDoc(noteRef);

        throw Error;
        if (noteSnap.exists()) {
            const data = noteSnap.data();

            if (data[classStyle] === value) {
                return `La nota ya posee esa clase. No se realizó ninguna actualización.`;
            } else {
                await updateDoc(noteRef, { [classStyle]: value });
                return true;
            }
        } else {
            return 'no se ha encontrado la nota en el sistema. Compruebe que aún exista.'
        }
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}