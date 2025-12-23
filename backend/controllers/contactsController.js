import Contact from "../models/Contact.js";

export const listContacts = async (req, res) => {
  try {
    const items = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });
    const item = await Contact.create({ name, email, userId: null });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create contact" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const item = await Contact.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    await item.destroy();
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete contact" });
  }
};

export default { listContacts, createContact, deleteContact };
