import User from "../models/User.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verificar el email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El email ya está en uso" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({ first_name, last_name, email, age, password: hashedPassword });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario" });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};
