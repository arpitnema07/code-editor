import { Router } from "express";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import saveFileToMongoDB from "../utils/helper.js";

const router = Router();

function extractClassName(javaCode) {
  const classRegex = /class\s+([A-Za-z_][A-Za-z0-9_]*)/; // Regular expression to match class declaration
  const match = javaCode.match(classRegex);

  if (match && match.length >= 2) {
    return match[1];
  } else {
    return null; // Class name not found
  }
}

router.post("/", async (req, res) => {
  const { code, input, email } = req.body;
  const clsName = extractClassName(code);

  // Create a temporary file and write the code to it
  const tempFilePath = `./${clsName}.java`;
  writeFileSync(tempFilePath, code);

  const compileCommand = "javac";
  const compileArgs = [tempFilePath];
  const runCommand = "java";
  const runArgs = [clsName];

  // Compile the Java code
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
      res.status(500).json({
        error: `Compilation failed with code ${compileCode} \n${compileErr}`,
      });
      return;
    }
    // saveFileToMongoDB(`${clsName}.java`, tempFilePath);
    // Run the compiled Java code with a timeout
    const runProcess = spawn(runCommand, runArgs);

    runProcess.stdin.write(input); // Pass input to the process
    runProcess.stdin.end(); // Close the input stream

    let runStdout = "";
    let runStderr = "";

    runProcess.stdout.on("data", (data) => {
      runStdout += data.toString();
    });

    runProcess.stderr.on("data", (data) => {
      runStderr += data.toString();
    });

    runProcess.on("close", async (runCode) => {
      // Cleanup: Delete the temporary file and compiled class
      unlinkSync(tempFilePath);
      unlinkSync(`${clsName}.class`);

      if (runCode !== 0) {
        res.status(500).json({
          error: `Execution failed with code ${runCode}\n${runStderr}`,
        });
      } else {
        // const newCode = new Code({
        //   email,
        //   username,
        //   code,
        //   lang,
        //   input,
        //   output,
        // });

        // const savedCode = await newCode.save();
        res.json({ output: runStdout, error: runStderr });
      }
    });

    // Set a timeout to kill the process if it takes too long
    const timeoutMilliseconds = 10000; // Adjust the timeout as needed (e.g., 10 seconds)
    const timeoutId = setTimeout(() => {
      runProcess.kill(); // Terminate the process
      // res.status(500).json({ error: "Execution timed out" });
    }, timeoutMilliseconds);

    // Clear the timeout if the process finishes before the timeout
    runProcess.on("exit", () => {
      clearTimeout(timeoutId);
    });
  });
});

export default router;
