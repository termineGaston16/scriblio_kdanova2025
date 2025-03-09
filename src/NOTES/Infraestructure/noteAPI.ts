import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { DataBaseError, DataBaseSystemFailure } from "../../TAG/Infraestructure/tagError";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { Note_I } from "../Domain/note";
import { ClassNotes_E } from "../Domain/classNotes";
import { Tag_I } from "../../TAG/Domain/tag";
import { createNoteBody } from "../NOTES-BODY/Infraestructure/note_bodyAPI";

export const GET_NOTES_LIMIT = 10;


{/* method: POST */ }
export const createNewNote = async (id: string, title: string): Promise<string | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.")

        const tagsCollection = collection(db, "NOTES");

        const snapshot = await getDocs(tagsCollection);
        const tagCount = snapshot.size;

        if (tagCount >= 200) return "Se ha alcanzado el límite de 200 notas.";

        const tagRef = doc(tagsCollection, id);
        await createNoteBody(id);

        await setDoc(tagRef, {
            id: id,
            creationDate: new Date().toLocaleDateString(),
            isArchived: false,
            isNotCompleted: true,
            isCompleted: false,
            isFav: false,
            isFixed: false,
            modificationDate: null,
            title: title,
            titleLowerCase: title.toLocaleLowerCase()
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

            q = query(tagsRef, orderBy("id"), startAfter(lastDocSnap), limit(GET_NOTES_LIMIT));
        } else {
            q = query(tagsRef, orderBy("id"), limit(GET_NOTES_LIMIT));
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
                limit(GET_NOTES_LIMIT)
            );
        } else {
            q = query(tagsRef, where(classStyle, "==", true), limit(GET_NOTES_LIMIT));
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
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const noteRef = doc(db, "NOTES", id);
        const noteSnap = await getDoc(noteRef);

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

{/* method: PATCH */ }
export const determineTagToNote = async (idNote: string, idTag: string): Promise<string | true> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const tagRef = doc(db, "TAGS", idTag);
        const tagSnap = await getDoc(tagRef);

        if (!tagSnap.exists()) {
            return `No se encontró el Tag. Compruebe que aún siga existiendo.`
        }

        const tagData = tagSnap.data();

        // 2️⃣ Verificar si el documento ya tiene el idNote en "notesInThisTag"
        if (tagData.notesInThisTag?.includes(idNote)) {
            return `Esta Nota ya está en este tag`
        }

        // 3️⃣ Buscar si la nota existe en la colección NOTES
        const noteRef = doc(db, "NOTES", idNote);
        const noteSnap = await getDoc(noteRef);

        if (!noteSnap.exists()) {
            return `No se encontró la nota. Compruebe que aún siga existiendo.`
        }

        // 4️⃣ Agregar el idNote al array "notesInThisTag" en TAGS
        await updateDoc(tagRef, {
            notesInThisTag: arrayUnion(idNote)
        });

        return true;

    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: GET */ }
export const getNotesByTitle = async (keyword: string, lastID: string | null): Promise<Note_I[]> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const notesRef = collection(db, "NOTES");
        let q;

        if (lastID) {
            const lastDocRef = doc(db, "NOTES", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) {
                return [];
            }

            q = query(
                notesRef,
                where("titleLowerCase", ">=", keyword.toLocaleLowerCase()),
                where("titleLowerCase", "<=", keyword.toLocaleLowerCase() + '\uf8ff'),
                startAfter(lastDocSnap),
                limit(GET_NOTES_LIMIT)
            );
        } else {
            q = query(
                notesRef,
                where("titleLowerCase", ">=", keyword.toLocaleLowerCase()),
                where("titleLowerCase", "<=", keyword.toLocaleLowerCase() + '\uf8ff'),
                limit(GET_NOTES_LIMIT)
            );
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

{/* method: GET */ }
export const getNoteByID = async (id: string): Promise<Note_I | null> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const noteRef = doc(db, "NOTES", id);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
            return { id: noteSnap.id, ...noteSnap.data() } as Note_I;
        } else {
            return null;
        }
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}

{/* method: GET */ }
export const getTagsFromNote = async (idNote: string): Promise<Tag_I['title'][]> => {
    try {
        if (!db) throw new DataBaseError("The database is not initialized.");

        const tagsCollectionRef = collection(db, "TAGS");

        const q = query(tagsCollectionRef, where("notesInThisTag", "array-contains", idNote));
        const querySnapshot = await getDocs(q);

        const tagTitles: string[] = querySnapshot.docs.map((doc) => doc.data().title);

        return tagTitles;
    } catch (error) {
        if (error instanceof DataBaseError) throw error;
        throw new DataBaseSystemFailure(`Firestore query failed: ${error}`);
    }
}