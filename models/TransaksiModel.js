import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Produk from "./ProdukModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define('transactions', {
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps:false
});

//relasi antara produk dan transaksi
Produk.hasMany(Transaksi, { foreignKey: "product_id" });
Transaksi.belongsTo(Produk, { foreignKey: "product_id" });

//relasi antara user dan transaksi
Users.hasMany(Transaksi, { foreignKey: "user_id" });
Transaksi.belongsTo(Users, { foreignKey: "user_id" });


export default Transaksi;
