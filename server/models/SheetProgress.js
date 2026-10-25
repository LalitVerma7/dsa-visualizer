import mongoose from "mongoose";

const sheetProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "review"], default: "pending" },
  },
  { timestamps: true }
);

// one row per (user, question)
sheetProgressSchema.index({ user: 1, questionId: 1 }, { unique: true });

export default mongoose.model("SheetProgress", sheetProgressSchema);
