import { collection } from "firebase/firestore";
import { Tag_I } from "../Domain/tag";
import { db } from "../../UI/Infraestructure/Firebase/firebase";

{/* method: GET */ }


/* ¿QUE PASA SI HAY ERROR? */
export const listTagByQuantity = async (limit: number, lastID: string | null): Promise<Tag_I[]> => {
    if (typeof limit !== 'number' || limit <= 0) return [];
    if (typeof lastID !== 'string' || !lastID) return [];

    const tagsRef = collection(db, "TAGS");
    let q;

    try {
        const tagsRef = collection(db, "TAGS");
        let q;

        if (lastID) {
            // Si tenemos lastID, buscamos el documento de referencia para paginación
            const lastDocSnapshot = await getDocs(query(tagsRef, orderBy("id"), fbLimit(1)));
            const lastDoc = lastDocSnapshot.docs.find(doc => doc.id === lastID);

            if (!lastDoc) return [];

            q = query(tagsRef, orderBy("id"), startAfter(lastDoc), fbLimit(limit));
        } else {
            // Si no hay lastID, obtenemos los primeros elementos
            q = query(tagsRef, orderBy("id"), fbLimit(limit));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tag_I[];

    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
};