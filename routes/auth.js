import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (role && !["user", "admin", "moderator"].includes(role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const newUser = await User.create({ username, email, password, role });
        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
        next(error);
    }
});



// Login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Генерируем токен
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h", // срок действия токена
        });

        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        next(error);
    }
});


// Update task only admin or moderator
router.patch("/:id", authenticate, authorize(["admin", "moderator"]), async (req, res, next) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found." });
        }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        next(error);
    }
});

// delete task only admin
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found." });
        }
        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        next(error);
    }
});


// // маршрут, доступный только администраторам, чтобы менять роли пользователей:
// router.patch("/role/:id", authenticate, authorize(["admin"]), async (req, res, next) => {
//     try {
//         const { role } = req.body;

//         if (!["user", "admin", "moderator"].includes(role)) {
//             return res.status(400).json({ message: "Invalid role." });
//         }

//         const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         res.status(200).json({ message: "Role updated successfully.", user });
//     } catch (error) {
//         next(error);
//     }
// });



export default router;