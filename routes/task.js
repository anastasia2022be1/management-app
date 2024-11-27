import express from "express";
import Task from "../models/Task.js";


const router = express.Router();

// ALL TASKS
router.get("/", async (req, res, next) => {
    try {
        //default Wert
        let sortDirection = "asc";
        // falls gesetzt als Query Parameter: passe an
        if (req.query.sortDirection === "desc") {
            sortDirection = "desc";
        }

        //default Wert
        let sortField = "title";
        // falls gesetzt als Query Parameter: passe an
        if (req.query.sortField === "status") {
            sortField = "status";
        } else if (req.query.sortField === "priority") {
            sortField = "priority"
        }

        const tasks = await Task.find().sort({ [sortField]: sortDirection });

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
        const newTask = await Task.create({
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
        // const { id } = req.params;
        // const deletedTask = await Task.findByIdAndDelete(id);

        // if (!deletedTask) {
        //     return res.status(404).json({ message: "Task not found." });
        // }

        // res.status(200).json({ message: "Task deleted successfully", task: deletedTask });

        const data = await Task.deleteOne({ _id: req.params.id })

        if (data.deletedCount === 0) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({ message: "Task deleted successfully", task: data });


    } catch (error) {
        next(error);
    }
});


// UPDATE task
router.patch("/:id", async (req, res, next) => {
    try {

        const data = await Task.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
        if (data.matchedCount === 0) {
            return res.status(404).json({ message: "Task not found." });
        }


        // const { id } = req.params;
        // const { title, description, priority, status } = req.body;

        // const updatedTask = await Task.findByIdAndUpdate(
        //     id,
        //     {
        //         ...(title && { title }),
        //         ...(description && { description }),
        //         ...(priority && { priority }),
        //         ...(status && { status })
        //     },
        //     { new: true, runValidators: true }
        // );

        // if (!updatedTask) {
        //     return res.status(404).json({ message: "Task not found." });
        // }

        res.status(200).json({ message: "Task updated successfully", task: data });
    } catch (error) {
        next(error);
    }
});


export default router;
