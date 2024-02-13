import mongoose from "mongoose";

const Schema = mongoose.Schema;

const codeSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    code: { type: String, required: true },
    lang: { type: String, required: true },
    input: { type: String, required: false },
    output: { type: String, required: true },
    error: { type: String, required: false },
  },
  { timestamps: true }
);
export default mongoose.model("Code", codeSchema);
