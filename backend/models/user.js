import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    hashPass: { type: String, required: true },
    profileUrl: { type: String, required: false },
    token: { type: String, required: false },
    loggedIn: { type: Boolean, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
