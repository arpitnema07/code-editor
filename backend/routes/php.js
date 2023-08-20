// java.js

const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code } = req.body;

  // Create a temporary file and write the code to it
  const tempFilePath = "./solution.php";
  const command = "php solution.php";
  fs.writeFileSync(tempFilePath, code);

  // Compile the Java code
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

module.exports = router;
