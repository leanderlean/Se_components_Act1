import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/signup", (req: Request, res: Response) => {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ error: "Please fill up all fields" });
  }

  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  res.status(201).json({ message: "Account created successfully!", user: { email, userName } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
