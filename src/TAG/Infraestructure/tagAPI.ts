import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { Tag_I } from "../Domain/tag";
import { db } from "../../UI/Infraestructure/Firebase/firebase";
import { DataBaseError, DataBaseSystemFailure } from "./tagError";

{/* method: GET */ }
export const listTagByQuantity = async (limitCount: number, lastID: string | null): Promise<Tag_I[]> => {
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

            q = query(tagsRef, orderBy("title"), startAfter(lastDocSnap), limit(limitCount));
        } else {
            q = query(tagsRef, orderBy("title"), limit(limitCount));
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


