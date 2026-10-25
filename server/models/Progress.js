import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // e.g. "bubble-sort" -- new algorithms just use a new slug, no schema change needed
    algorithmSlug: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "sorting",
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timesRun: {
      type: Number,
      default: 0,
    },
    lastRunAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, algorithmSlug: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
