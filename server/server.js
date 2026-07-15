import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { flushSync } from "react-dom";
import { create } from "express-handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const VITE_ORIGIN = process.env.VITE_ORIGIN || "http://localhost:5173";

const hbs = create({ defaultLayout: false });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

// API Routes

//Serve the React app
if (process.env.NODE_ENV === "production" ) {
    const manifestPath = path.join(
        __dirname,
        "../client/dist/.vite/manifest.json"
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const entries = Object.values(manifest).filter((e) => e.isEntry);
    const jsFiles = entries.map((e) => e.file);
    const cssFiles = [...new Set(entries.flatMap((e) => e.css || []))];

    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("/{*splat}", (req, res) => {
        res.render("index", {
            isDev: false,
            jsFiles,
            cssFiles,
        });
    });
} else {
    app.use((req, res, next) => {
        if (req.path.includes(".")) {
            return res.redirect(`${VITE_ORIGIN}${req.path}`);
        }
        next();
    });

    app.get("/{*splat}", (req, res) => {
        res.render("index", { isDev: true, viteOrigin: VITE_ORIGIN });
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})