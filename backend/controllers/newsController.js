import News from "../models/News.js";

export const listNews = async (req, res) => {
	try {
		const items = await News.findAll({ order: [["createdAt", "DESC"]] });
		return res.json(items);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch news" });
	}
};

export const createNews = async (req, res) => {
	try {
		const { title, content, category, tags, media, publishDate } = req.body;
		const item = await News.create({ title, content, category, tags, media, publishDate, userId: req.user.id });
		return res.status(201).json(item);
	} catch (err) {
		return res.status(500).json({ message: "Failed to create news" });
	}
};

export const getNews = async (req, res) => {
	try {
		const item = await News.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: "Not found" });
		return res.json(item);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch news" });
	}
};

export const updateNews = async (req, res) => {
	try {
		const item = await News.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: "Not found" });
		const { title, content } = req.body;
		item.title = title ?? item.title;
		item.content = content ?? item.content;
		await item.save();
		return res.json(item);
	} catch (err) {
		return res.status(500).json({ message: "Failed to update news" });
	}
};

export const deleteNews = async (req, res) => {
	try {
		const item = await News.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: "Not found" });
		await item.destroy();
		return res.json({ message: "Deleted" });
	} catch (err) {
		return res.status(500).json({ message: "Failed to delete news" });
	}
};

export default { listNews, createNews, getNews, updateNews, deleteNews };

