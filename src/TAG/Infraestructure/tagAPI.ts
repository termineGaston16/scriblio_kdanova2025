import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter } from "firebase/firestore";
import { Tag_I } from "../Domain/tag";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { DataBaseError, DataBaseSystemFailure } from "./tagError";

{/* method: GET */ }
export const listTagByQuantity = async (lastID: string | null): Promise<Tag_I[]> => {

    if (!db) throw new DataBaseError("The database is not initialized.");

    try {
        const tagsRef = collection(db, "TAGS");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "TAGS", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(tagsRef, orderBy("id"), startAfter(lastDocSnap), limit(4));
        } else {
            q = query(tagsRef, orderBy("id"), limit(4));
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

        if (tagCount >= 50) return "Se ha alcanzado el límite de 50 tags.";

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

