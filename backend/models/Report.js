import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Report = sequelize.define("Report", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrls: {
    type: DataTypes.JSON, // array of file paths
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Report;
