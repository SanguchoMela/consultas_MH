import {db, admin} from "../firebaseAdmin.js";

export const createDocument = async (req, res) => {
    try {
        const document = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category || "Document",
            allowedRoles: req.body.allowedRoles || ["admin"],
            createdBy: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }

        const docRef = await db.collection("documents").add(document);

        return res.status(201).json({ id: docRef.id, ...document });
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el documento", error: error.message });
    }
}

export const getDocuments = async (req, res) => {
    try {
        const role = req.user.role;

        const snapshot = await db.collection("documents").where("allowedRoles", "array-contains", req.user.role).get();

        const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los documentos", error: error.message });
    }
}

