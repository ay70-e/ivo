import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";
import reportsRoutes from "./routes/reports.js";
import contactsRoutes from "./routes/contacts.js";
import usersRoutes from "./routes/users.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/users", usersRoutes);

// Test DB and start server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error("Database sync failed:", err);
});
