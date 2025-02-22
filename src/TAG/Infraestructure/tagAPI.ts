import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { Tag_I } from "../Domain/tag";
import { db } from "../../UI/Infraestructure/Firebase/firebase";

{/* method: GET */ }


/* ¿QUE PASA SI HAY ERROR? */
export const listTagByQuantity = async (limitCount: number, lastID: string | null): Promise<Tag_I[]> => {
    if (typeof limitCount !== 'number' || limitCount <= 0) return [];

    const tagsRef = collection(db, "TAGS");
    let q;

    if (lastID) {
        try {
            const lastDocRef = doc(db, "TAGS", lastID);
            const lastDocSnap = await getDoc(lastDocRef);

            if (!lastDocSnap.exists()) return [];

            q = query(tagsRef, orderBy("title"), startAfter(lastDocSnap), limit(limitCount));
        } catch (error) {
            return [];
        }
    } else {
        q = query(tagsRef, orderBy("title"), limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tag_I[];
};