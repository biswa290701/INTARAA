require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("./config/db");

const unityHeaders = require("./middleware/unityHeaders");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

// SESSION STORE
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log("SESSION STORE ERROR:", err));

// GLOBAL MIDDLEWARE
app.use(unityHeaders);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);