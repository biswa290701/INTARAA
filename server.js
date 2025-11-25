import express, { urlencoded, json } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import session from "express-session";
import store from "./src/config/db.js";

// Unity Headers Middleware
// import unityHeaders from "./src/middleware/unityHeaders.js";

// ROUTES
import authRoutes from "./src/routes/authRoutes.js";
import passwordRoutes from "./src/routes/passwordRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import caseUploadRoutes from "./src/routes/caseUploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("trust proxy", 1);

// GLOBAL MIDDLEWARE
// app.use(unityHeaders);
app.use(express.static(join(__dirname, "./src/views")));
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretintaraa123",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ROUTES
app.use(authRoutes);
app.use(passwordRoutes);
app.use(contactRoutes);
app.use(sessionRoutes);
app.use(chatRoutes);
app.use(caseUploadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
