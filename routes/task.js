import express from "express";
import Task from "../models/Task.js";


const router = express.Router();

// ALL TASKS
router.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});


// NEW TASk
router.post("/newtask", async (req, res, next) => {
    try {
        const { title, description, priority, status } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Invalid Task" });
        }

        // Create new task
        const newTask = Task.create({
            title: title,
            description: description ? description : "",
            priority: priority,
            status: status
        });

        res
            .status(201)
            .json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        next(error);
    }
});

//DELETE Task
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        next(error);
    }
});


// UPDATE task
router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(priority && { priority }),
                ...(status && { status })
            },
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


export default router;
