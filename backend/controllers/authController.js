import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashed, role });
		return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
	} catch (err) {
		return res.status(500).json({ message: "Registration failed", error: err.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ message: "Invalid credentials" });
		const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
		return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		return res.status(500).json({ message: "Login failed" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { name, email } = req.body;
		const userId = req.user.id;
		await User.update({ name, email }, { where: { id: userId } });
		const updatedUser = await User.findByPk(userId);
		return res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
	} catch (err) {
		return res.status(500).json({ message: "Update failed", error: err.message });
	}
};

export const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user.id;
		const user = await User.findByPk(userId);
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) return res.status(400).json({ message: "Current password is incorrect" });
		const hashed = await bcrypt.hash(newPassword, 10);
		await User.update({ password: hashed }, { where: { id: userId } });
		return res.json({ message: "Password updated successfully" });
	} catch (err) {
		return res.status(500).json({ message: "Password change failed", error: err.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch profile" });
	}
};

export default { register, login, updateUser, changePassword, getProfile };
