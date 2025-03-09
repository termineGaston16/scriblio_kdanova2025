import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, where } from "firebase/firestore";
import { Tag_I } from "../Domain/tag";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { DataBaseError, DataBaseSystemFailure } from "./tagError";
import { Note_I } from "../../NOTES/Domain/note";

export const LIMIT_TAGS = 2;
export const MAX_TAGS = 50;

{/* method: GET */ }
export const getTags = async (lastID: string | null): Promise<Tag_I[]> => {

    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const tagsRef = collection(db, "TAGS");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "TAGS", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(tagsRef, orderBy("id"), startAfter(lastDocSnap), limit(LIMIT_TAGS));
        } else {
            q = query(tagsRef, orderBy("id"), limit(LIMIT_TAGS));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tag_I[];
    } catch (error) {

        // 🔹 Si el error ya es un `DataBaseError`, lo relanzamos sin modificarlo.
        if (error instanceof DataBaseError) {
            throw error;
        }

        // 🔹 Si es un error desconocido, lo envolvemos en un `DataBaseSystemFailure`.
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};

{/* method: POST */ }
export const addNewTag = async (title: string, colorTag: string, id: string): Promise<string | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");
        const tagsCollection = collection(db, "TAGS");

        const snapshot = await getDocs(tagsCollection);
        const tagCount = snapshot.size;

        if (tagCount >= MAX_TAGS) return `Se ha alcanzado el límite de ${MAX_TAGS} tags.`;

        const tagRef = doc(tagsCollection, id);

        await setDoc(tagRef, {
            id: id,
            title: title,
            colorTag: colorTag,
            notesInThisTag: []
        } as Tag_I);

        return true;

    } catch (error) {
        if (error instanceof DataBaseError) throw error;

        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};

{/* method: DELETE */ }
export const removeTag = async (id: string): Promise<void | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        await deleteDoc(doc(db, "TAGS", id));

        return true;
    } catch (error) {
        if (error instanceof DataBaseError) throw error;

        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: GET */ }
export const getIDsByTag = async (idTag: string): Promise<string[]> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const docRef = doc(db, "TAGS", idTag);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return [];

        return (docSnap.data() as Tag_I).notesInThisTag ?? [];

    } catch (error) {

        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: GET */ }
export const filterNotesByTag = async (idTag: string, lastID: string | null): Promise<Note_I[]> => {
    try {
        if (!db) throw new Error("The database is not initialized.");

        const idsNotes = await getIDsByTag(idTag);
        if (idsNotes.length === 0) return [];

        const notesRef = collection(db, "NOTES");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "NOTES", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(notesRef, where("id", "in", idsNotes), orderBy("id"), startAfter(lastDocSnap), limit(LIMIT_TAGS));
        } else {
            q = query(notesRef, where("id", "in", idsNotes), orderBy("id"), limit(LIMIT_TAGS));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note_I[];

    } catch (error) {
        console.error("Error filtering notes: ", error);
        throw new Error(`Firestore query failed: ${error}`);
    }
};
