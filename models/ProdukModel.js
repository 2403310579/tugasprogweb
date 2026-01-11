import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define('products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    freezeTableName: true,

});

export default Product;

