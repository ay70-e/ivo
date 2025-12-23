import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const News = sequelize.define("News", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
  media: { type: DataTypes.ARRAY(DataTypes.JSON) },
  publishDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: true },
});

export default News;
