import dotenv from "dotenv";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

dotenv.config();

let conn;

let gfs;

function connectDb() {
  // Database connection
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  conn = mongoose.connection;
  conn.on("error", (err) => {
    console.log("Could not connect to mongo server!");
    console.log(err);
  });
  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("code-files");
    console.log("Database connected.");
  });
}
export { conn, gfs };
export default connectDb;
