// java.js

const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code } = req.body;

  // Create a temporary file and write the code to it
  const tempFilePath = "./program.cpp";
  fs.writeFileSync(tempFilePath, code);

  const compileCommand = `gcc ${tempFilePath} -o program`;
  const runCommand = `.\\program`;

  // Compile the Java code
  exec(compileCommand, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      // Cleanup: Delete the temporary file
      fs.unlinkSync(tempFilePath);
      return res.status(500).json({ error: compileError.message });
    }

    // Run the compiled Java code
    exec(runCommand, (runError, runStdout, runStderr) => {
      // Cleanup: Delete the temporary file
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync("program.exe");

      if (runError) {
        res.status(500).json({ error: runError.message });
      } else {
        res.json({ output: runStdout, error: runStderr });
      }
    });
  });
});

module.exports = router;
