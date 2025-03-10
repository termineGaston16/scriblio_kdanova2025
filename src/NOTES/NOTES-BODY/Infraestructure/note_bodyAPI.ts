import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { DataBaseError, DataBaseSystemFailure } from "../../../TAG/Infraestructure/tagError";
import { db } from "../../../UI/Infraestructure/Firebase/firebase";
import { Note_Body_I } from "../Domain/note_body";

{/* method: POST */ }
export const createNoteBody = async (idNote: string): Promise<void> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");
        const idBody = crypto.randomUUID();

        const noteRef = doc(collection(db, "NOTES-BODIES"), idBody);
        await setDoc(noteRef, {
            body: '',
            id: idBody,
            idNote: idNote
        } as Note_Body_I);
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: GET */ }
export const getBodyNoteByID = async (idNote: string): Promise<Note_Body_I | null> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const notesCollection = collection(db, "NOTES-BODIES");
        const q = query(notesCollection, where("idNote", "==", idNote));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0];
            return { id: docData.id, ...docData.data() } as Note_Body_I;
        } else {
            return null;
        }
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
};

{/* method: PATCH */ }
export const updateBody = async (id: string, newBody: string): Promise<void> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const noteRef = doc(db, "NOTES-BODIES", id);
        await updateDoc(noteRef, { "body": newBody });
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}