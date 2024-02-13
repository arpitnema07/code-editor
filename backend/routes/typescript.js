import { Router } from "express";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const router = Router();

router.post("/", async (req, res) => {
  const { code, input } = req.body;
  const tempFilePath = "./solution.ts";
  const command = "tsc";
  const args = [tempFilePath];
  let compileErr = "";

  try {
    // Write code to temporary file
    writeFileSync(tempFilePath, code);

    // Compile TypeScript code
    const compileProcess = spawn(command, args);

    compileProcess.stderr.on("data", (data) => {
      compileErr += data.toString();
    });

    compileProcess.on("close", (compileCode) => {
      if (compileCode !== 0) {
        cleanup();
        return res.status(500).json({
          error: `Compilation failed with code ${compileCode}\n${compileErr}`,
        });
      }

      // Execute compiled JavaScript
      executeCompiledCode(input);
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal Error!" });
  }

  function executeCompiledCode(input) {
    const runCommand = "node";
    const runArgs = ["./solution.js"];
    let runStdout = "";
    let runStderr = "";

    const runProcess = spawn(runCommand, runArgs);

    runProcess.stdout.on("data", (data) => {
      runStdout += data.toString();
    });

    runProcess.stderr.on("data", (data) => {
      runStderr += data.toString();
    });

    runProcess.on("close", (runCode) => {
      cleanup();
      if (runCode !== 0) {
        return res.status(500).json({
          error: `Execution failed with code ${runCode}\n${runStderr}`,
        });
      }
      return res.json({ output: runStdout, error: runStderr });
    });

    // Write input to the process
    runProcess.stdin.write(input);
    runProcess.stdin.end();

    // Set a timeout to kill the process if it takes too long
    const timeoutMilliseconds = 10000; // Adjust the timeout as needed (e.g., 10 seconds)
    const timeoutId = setTimeout(() => {
      runProcess.kill(); // Terminate the process
      cleanup();
      return res.status(500).json({ error: "Execution timed out" });
    }, timeoutMilliseconds);

    // Clear the timeout if the process finishes before the timeout
    runProcess.on("exit", () => {
      clearTimeout(timeoutId);
    });
  }

  function cleanup() {
    // Cleanup: Delete the temporary file
    unlinkSync(tempFilePath);
  }
});

export default router;
