import express from "express";
import * as newsCtrl from "../controllers/newsController.js";
import News from "../models/News.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { canCreate, canEditOrDelete } from "../middleware/permissions.js";

const router = express.Router();

// إنشاء خبر
router.post("/", authenticate, canCreate, newsCtrl.createNews);

// تعديل وحذف الخبر
router.put("/:id", authenticate, canEditOrDelete(News), newsCtrl.updateNews);
router.delete("/:id", authenticate, canEditOrDelete(News), newsCtrl.deleteNews);

// عرض جميع الأخبار
router.get("/", newsCtrl.listNews);
router.get("/:id", newsCtrl.getNews);

export default router;
