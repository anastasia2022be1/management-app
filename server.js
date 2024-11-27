import express from "express"
import connect from "./db.js"
import cors from "cors";
import taskRouter from "./routes/task.js"
import mongoose from "mongoose";


await connect(); // MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter)

app.use((err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: "Validation error", details: err.message });
    } else if (err.name === "CastError") {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: err.message });
});


const port = process.env.PORT || 3000

app.listen(port, () => console.log("Server started on port", port))