import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  res.status(201).json({ message: "User registered successfully!" });
});

export default router;
