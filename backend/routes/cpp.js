// java.js

import { Router } from "express";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const router = Router();

router.post("/", async (req, res) => {
  const { code, input } = req.body;

  // Create a temporary file and write the code to it
  const tempFilePath = "./program.cpp";
  writeFileSync(tempFilePath, code);

  const compileCommand = "g++";
  const compileArgs = [tempFilePath, "-o", "program"];
  const runCommand = "./program";

  // Spawn a new process to compile the C code
  const compileProcess = spawn(compileCommand, compileArgs);
  let compileErr = "";

  compileProcess.stderr.on("data", (data) => {
    compileErr += data.toString();
  });
  compileProcess.stdout.on("data", (data) => {
    compileErr += data.toString();
  });
  compileProcess.on("close", (compileCode) => {
    if (compileCode !== 0) {
      // Cleanup: Delete the temporary file
      unlinkSync(tempFilePath);
      res
        .status(500)
        .json({
          error: `Compilation failed with code ${compileCode}\n${compileErr}`,
        });
      return;
    }

    // Spawn a new process to run the compiled C program
    const runProcess = spawn(runCommand);

    let runStdout = "";
    let runStderr = "";

    runProcess.stdout.on("data", (data) => {
      runStdout += data.toString();
    });

    runProcess.stderr.on("data", (data) => {
      runStderr += data.toString();
    });

    runProcess.on("close", (runCode) => {
      // Cleanup: Delete the temporary file and compiled program
      unlinkSync(tempFilePath);
      unlinkSync("program.exe");

      if (runCode !== 0) {
        res.status(500).json({
          error: `Execution failed with code ${runCode}\n${compileErr}`,
        });
      } else {
        res.json({ output: runStdout, error: runStderr });
      }
    });

    // Write input to the process
    runProcess.stdin.write(input);
    runProcess.stdin.end();

    // Set a timeout to kill the process if it takes too long
    const timeoutMilliseconds = 10000; // Adjust the timeout as needed (e.g., 10 seconds)
    const timeoutId = setTimeout(() => {
      runProcess.kill(); // Terminate the process
      res.status(500).json({ error: "Execution timed out" });
    }, timeoutMilliseconds);

    // Clear the timeout if the process finishes before the timeout
    runProcess.on("exit", () => {
      clearTimeout(timeoutId);
    });
  });
});

export default router;
