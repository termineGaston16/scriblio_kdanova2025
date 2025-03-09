import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { DataBaseError, DataBaseSystemFailure } from "../../../TAG/Infraestructure/tagError";
import { db } from "../../../UI/Infraestructure/Firebase/firebase";
import { Note_Body_I } from "../Domain/note_body";

{/* method: POST */ }
export const createNoteBody = async (idNote: string): Promise<void> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const noteRef = doc(collection(db, "NOTES-BODIES"), idNote);
        await setDoc(noteRef, {
            body: '',
            id: crypto.randomUUID(),
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