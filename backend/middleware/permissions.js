// يسمح بالإضافة (مشرف + مدير)
export const canCreate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role === "مشرف" || req.user.role === "مدير") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};

// يسمح بالتعديل والحذف
export const canEditOrDelete = (Model) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // المدير: كل شيء
    if (req.user.role === "مدير") {
      return next();
    }

    // المشرف: فقط محتواه
    if (req.user.role === "مشرف") {
      const item = await Model.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }

      if (item.userId === req.user.id) {
        return next();
      }
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    console.error("Permission middleware error:", err);
    return res.status(500).json({ message: "Permission check failed" });
  }
};
