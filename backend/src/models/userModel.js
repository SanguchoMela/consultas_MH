import { admin } from '../firebaseAdmin.js';

const VALID_ROLES = ['admin', 'supervisor', 'seller'];

export const createUser = async ({
    email,
    password,
    name,
    role = 'seller',
    company = null
}) => {
    if (!VALID_ROLES.includes(role)) {
        throw new Error(`Role inválido. Los roles válidos son: ${VALID_ROLES.join(', ')}`)
    }

    try {
        // Crear usuario en Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        })

        // Asignar custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, { role })

        // Guardar información adicional en Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            name,
            role,
            company,
            status: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        return {
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            role: role,
            company: company,
        }
    } catch (error) {
        console.error('Error creando usuario:', error)
        throw error
    }
}