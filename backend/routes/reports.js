import express from "express";
import * as reportsCtrl from "../controllers/reportsController.js";
import Report from "../models/Report.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { canCreate, canEditOrDelete } from "../middleware/permissions.js";
import multer from "multer";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", authenticate, reportsCtrl.listReports);

router.post(
  "/",
  authenticate,
  canCreate,
  upload.array("files"), // 🔑 name = files
  reportsCtrl.createReport
);

router.get("/:id", authenticate, reportsCtrl.getReport);

router.put(
  "/:id",
  authenticate,
  canEditOrDelete(Report),
  upload.array("files"),
  reportsCtrl.updateReport
);

router.delete(
  "/:id",
  authenticate,
  canEditOrDelete(Report),
  reportsCtrl.deleteReport
);

export default router;
