import { Router } from "express";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const router = Router();

router.post("/", async (req, res) => {
  const { code, input } = req.body;

  // Create a temporary file and write the code to it
  const tempFilePath = "./solution.js";
  const command = "node";
  const args = [tempFilePath];
  writeFileSync(tempFilePath, code);

  // Spawn a new process to execute the Node.js script
  const childProcess = spawn(command, args);

  let stdoutData = "";
  let stderrData = "";

  childProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  childProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  childProcess.on("close", (code) => {
    unlinkSync(tempFilePath);
    if (code !== 0) {
      res.status(500).json({ error: `Process exited with code ${code}` });
    } else {
      res.json({ output: stdoutData, error: stderrData });
    }
    console.log(
      `Command exited with code ${code}\nstdout: ${stdoutData}\nstderr: ${stderrData}`
    );
  });

  // Write input to the process
  childProcess.stdin.write(input);
  childProcess.stdin.end();

  // Set a timeout to kill the process if it takes too long
  const timeoutMilliseconds = 10000; // Adjust the timeout as needed (e.g., 10 seconds)
  const timeoutId = setTimeout(() => {
    childProcess.kill(); // Terminate the process
    res.status(500).json({ error: "Execution timed out" });
  }, timeoutMilliseconds);

  // Clear the timeout if the process finishes before the timeout
  childProcess.on("exit", () => {
    clearTimeout(timeoutId);
  });
});

export default router;
