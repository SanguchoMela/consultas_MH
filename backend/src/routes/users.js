import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createUser } from "../models/userModel.js";
import { checkPermission } from "../middlewares/permissions.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { cors } from "../utils/cors.js";

const router = express.Router();

router.post("/create", verifyToken, checkPermission(PERMISSIONS.CREATE_USER), async (req, res) => {
  const isPreflight = cors(req, res)
  if (isPreflight) { return; }

  try {
    const { email, password, name, role } = req.body;

    console.log("Datos recibidos:", { email, password, name, role });

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const user = await createUser({ email, password, name, role });

    console.log("Usuario creado:", user);

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: user.uid,
    });

  } catch (error) {
    console.error("Error completo en /users/create:", error);
    res.status(400).json({
      message: "Error al crear el usuario",
      code: error.code,   // código específico de Firebase Auth
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
