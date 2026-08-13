import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./routes/auth.routes.js";
import dataRouter from "./routes/data.routes.js";
import profileRouter from "./routes/profile.routes.js";
import itemsRouter from "./routes/items.routes.js";
import skillsRouter from "./routes/skills.routes.js";
import resetRouter from "./routes/reset.routes.js";
import contactRouter from "./routes/contact.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", dataRouter);
app.use("/api", profileRouter);
app.use("/api", skillsRouter);
app.use("/api", itemsRouter);
app.use("/api", resetRouter);
app.use("/api", contactRouter);

const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(distDir, "index.html")));
}

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
