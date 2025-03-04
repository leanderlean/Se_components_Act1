import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes"; // ✅ Correct import

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
