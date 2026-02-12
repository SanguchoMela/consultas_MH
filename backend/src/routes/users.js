import express from "express";
import { verifyToken, authorize } from "../middlewares/auth.js";
import { createUser } from "../models/userModel.js";
import { checkPermission } from "../middlewares/permissions.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.post("/create", verifyToken, checkPermission(PERMISSIONS.CREATE_USER), async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const user = await createUser({
      email,
      password,
      name,
      role,
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: user.uid,
    })

  } catch (error) {
    res.status(400).json({ message: "Error al crear el usuario", error: error.message });
  }
});

export default router;
