import express from "express";
import Progress from "../models/Progress.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/progress
// @desc    Get all progress records for the logged in user
router.get("/", protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch progress", error: err.message });
  }
});

// @route   POST /api/progress/run
// @desc    Log that the user ran a visualization (increments timesRun)
router.post("/run", protect, async (req, res) => {
  try {
    const { algorithmSlug, category } = req.body;
    if (!algorithmSlug) {
      return res.status(400).json({ message: "algorithmSlug is required" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, algorithmSlug },
      {
        $inc: { timesRun: 1 },
        $set: { lastRunAt: new Date(), category: category || "sorting" },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: "Failed to log run", error: err.message });
  }
});

// @route   POST /api/progress/complete
// @desc    Mark an algorithm as completed (visualization finished end to end)
router.post("/complete", protect, async (req, res) => {
  try {
    const { algorithmSlug, category } = req.body;
    if (!algorithmSlug) {
      return res.status(400).json({ message: "algorithmSlug is required" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, algorithmSlug },
      {
        $set: {
          completed: true,
          completedAt: new Date(),
          category: category || "sorting",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: "Failed to update progress", error: err.message });
  }
});

export default router;
