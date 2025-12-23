import Report from "../models/Report.js";

export const listReports = async (req, res) => {
  try {
    const items = await Report.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export const createReport = async (req, res) => {
  try {
    const { title, notes } = req.body;

    let fileUrls = [];
    if (req.files && req.files.length > 0) {
      fileUrls = req.files.map(
        file => `/uploads/${file.filename}`
      );
    }

    const item = await Report.create({
      title,
      notes,
      userId: req.user.id,
      fileUrls,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create report" });
  }
};

export const getReport = async (req, res) => {
  try {
    const item = await Report.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

export const updateReport = async (req, res) => {
  try {
    const item = await Report.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const { title, notes } = req.body;
    item.title = title ?? item.title;
    item.notes = notes ?? item.notes;

    if (req.files && req.files.length > 0) {
      item.fileUrls = req.files.map(
        file => `/uploads/${file.filename}`
      );
    }

    await item.save();
    res.json(item);
  } catch {
    res.status(500).json({ message: "Failed to update report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const item = await Report.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    await item.destroy();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete report" });
  }
};
