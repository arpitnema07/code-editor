import express from "express";
import pkg from "body-parser";
import cors from "cors";

import java from "./routes/java.js";
import javascript from "./routes/javascript.js";
import python from "./routes/python.js";
import c from "./routes/c.js";
import cpp from "./routes/cpp.js";
import php from "./routes/php.js";
import typescript from "./routes/typescript.js";

const { json } = pkg;
const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(json());

// Connect to the Database
// connectDb();

app.use("/execute/java", java);
app.use("/execute/javascript", javascript);
app.use("/execute/typescript", typescript);
app.use("/execute/python", python);
app.use("/execute/cpp", cpp);
app.use("/execute/c", c);
app.use("/execute/php", php);

// app.use("/api/login", login);
// app.use("/api/register", register);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
