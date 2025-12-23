import News from "../models/News.js";
import Report from "../models/Report.js";

// إنشاء محتوى جديد
export const createContent = async (req, res) => {
  try {
    const { type, ...data } = req.body;

    let item;
    if (type === "خبر") {
      item = await News.create({ ...data, userId: req.user.id });
    } else {
      item = await Report.create({ ...data, userId: req.user.id });
    }

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// جلب كل المحتويات (يمكن التعديل لفلترة الأخبار أو التقارير فقط)
export const listContent = async (req, res) => {
  try {
    const news = await News.findAll();
    const reports = await Report.findAll();
    res.json([...news, ...reports].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContent = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (news) return res.json(news);

    const report = await Report.findByPk(req.params.id);
    if (report) return res.json(report);

    res.status(404).json({ message: "Not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// تحديث المحتوى
export const updateContent = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    let item;
    if (type === "خبر") {
      item = await News.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      await item.update(data);
    } else {
      item = await Report.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      await item.update(data);
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// حذف المحتوى
export const deleteContent = async (req, res) => {
  try {
    let item = await News.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      return res.json({ message: "Deleted" });
    }

    item = await Report.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      return res.json({ message: "Deleted" });
    }

    res.status(404).json({ message: "Not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
