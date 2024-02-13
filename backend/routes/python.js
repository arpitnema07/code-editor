import { Router } from "express";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const router = Router();

router.post("/", async (req, res) => {
  const { code, input } = req.body;

  // Create a temporary file and write the code to it
  const tempFilePath = "./solution.py";
  const command = "python";
  const args = [tempFilePath];
  writeFileSync(tempFilePath, code);

  // Spawn a new process to execute the Python code
  const childProcess = spawn(command, args);

  childProcess.stdin.write(input); // Pass input to the process
  childProcess.stdin.end(); // Close the input stream

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
});

export default router;
