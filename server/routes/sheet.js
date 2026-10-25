import express from "express";
import auth from "../middleware/auth.js";
import SheetProgress from "../models/SheetProgress.js";

const router = express.Router();
const STATUSES = ["pending", "completed", "review"];

// Match however your auth middleware attaches the user (see routes/progress.js)
const getUserId = (req) => req.user?.id || req.user?._id || req.userId;

// GET /api/sheet/progress -> { "arr-1": "completed", "stk-2": "review", ... }
router.get("/progress", auth, async (req, res) => {
  try {
    const rows = await SheetProgress.find({ user: getUserId(req) }).lean();
    const map = {};
    rows.forEach((r) => (map[r.questionId] = r.status));
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sheet progress" });
  }
});

// POST /api/sheet/progress  { questionId, status }
router.post("/progress", auth, async (req, res) => {
  try {
    const { questionId, status } = req.body;
    if (!questionId || !STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid questionId or status" });
    }
    const doc = await SheetProgress.findOneAndUpdate(
      { user: getUserId(req), questionId },
      { status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ questionId: doc.questionId, status: doc.status });
  } catch (err) {
    res.status(500).json({ message: "Failed to save sheet progress" });
  }
});

export default router;
