// routes/users.js
import express from "express";
import admin from "../firebaseAdmin.js";
import { verifyToken, onlyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", verifyToken, onlyAdmin, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(user.uid, {
      role: "user",
    });

    res.json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
