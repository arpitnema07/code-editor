import { gfs } from "../config/db.js";

async function saveCode() {
  // Database connection
}

// Function to save a file to MongoDB
function saveFileToMongoDB(filename, filePath) {
  return new Promise((resolve, reject) => {
    const writestream = gfs.createWriteStream({
      filename: filename,
    });

    fs.createReadStream(filePath)
      .pipe(writestream)
      .on("close", () => {
        resolve("File saved to MongoDB");
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export default saveFileToMongoDB;
