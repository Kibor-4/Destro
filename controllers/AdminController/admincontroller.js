const db = require("../db/db");
const bcrypt = require("bcrypt");

const adminController = {
  createAdmin: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
        [name, email, hashedPassword]
      );

      const newAdmin = {
        id: result.insertId,
        name,
        email,
        role: "admin",
      };

      res.status(201).json({ message: "Admin created successfully", newAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
};

module.exports = adminController;