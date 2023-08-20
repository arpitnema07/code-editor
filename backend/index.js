const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");
const java = require("./routes/java");
const javascript = require("./routes/javascript");
const python = require("./routes/python");
const c = require("./routes/c");
const cpp = require("./routes/cpp");
const php = require("./routes/php");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());

app.use("/execute/java", java);
app.use("/execute/javascript", javascript);
app.use("/execute/python", python);
app.use("/execute/cpp", cpp);
app.use("/execute/c", c);
app.use("/execute/php", php);

// API endpoint for code execution
app.post("/execute", (req, res) => {
  const { code, language } = req.body;

  // Define the command to execute based on the language
  let command = "",
    tempFilePath = "";
  if (language === "python") {
    tempFilePath = "./tempfile.py";
    fs.writeFileSync(tempFilePath, code);
    command = `python "${tempFilePath}"`;
  } else if (language === "javascript") {
    tempFilePath = "./tempfile.js";
    fs.writeFileSync(tempFilePath, code);
    command = `node "${tempFilePath}"`;
  } else if (language == "java") {
    tempFilePath = "./Solution.java";
    fs.writeFileSync(tempFilePath, code);
    command = `javac Solution.java;`;
  } // Add more language cases as needed
  console.log(language);
  // Execute the code
  exec(command, (error, stdout, stderr) => {
    fs.unlinkSync(tempFilePath);
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ output: stdout, error: stderr });
    }
    console.log(command + error + "out:" + stdout + stderr);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
