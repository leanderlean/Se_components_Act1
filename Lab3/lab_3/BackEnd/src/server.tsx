import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface User {
  id?: string; // Optional because Supabase may auto-generate it
  firstName: string;
  lastName: string;
  groupName: string;
  expectedSalary: string;
  expectedDateOfDefense: string;
}

// Register a User =====================================================================
app.post(
  "/registerUser",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        firstName,
        lastName,
        groupName,
        expectedSalary,
        expectedDateOfDefense,
      }: User = req.body;

      if (
        !firstName ||
        !lastName ||
        !groupName ||
        !expectedSalary ||
        !expectedDateOfDefense
      ) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const { data, error } = await supabase
        .from("user")
        .insert([
          {
            firstName,
            lastName,
            groupName,
            expectedSalary,
            expectedDateOfDefense,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res
        .status(201)
        .json({ message: "Successfully registered the user!", data });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get All Users =====================================================================
app.get("/getUsers", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from("user").select();

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({ error: "No users found!" });
      return;
    }

    res.json({ data });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete a User by ID =====================================================================
app.delete(
  "/deleteUser/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const { error } = await supabase.from("user").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

// Edit infos
app.put(
  "/updateUser/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let updatedData = req.body;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Remove undefined values
    updatedData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    try {
      const { data, error } = await supabase
        .from("user")
        .update(updatedData)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      if (!data || data.length === 0) {
        res.status(404).json({ error: "User not found or no changes made" });
        return;
      }

      res.json({ success: true, message: "User updated successfully!", data });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT: ${PORT}`));

console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log(
  "Supabase Key (first 10 chars):",
  process.env.SUPABASE_ANON_KEY?.slice(0, 10)
);
