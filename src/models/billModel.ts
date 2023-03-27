import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { BillAttributes } from "../constants/constants";
import User from "./userModel";
import Group from "./groupModel";

class Bill extends Model<BillAttributes, Optional<BillAttributes, "id">> implements BillAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public data_created!: Date;
  public data_end!: Date;
  public bill_image!: string;
  public currency_type!: string;
  public currency_code!: string;
  public debt!: number;
  public code_qr!: string;
  public owner_id!: string;
  public group_id!: string;
}

Bill.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    data_created: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    data_end: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    bill_image: {
      type: DataTypes.STRING(1024),
    },
    currency_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    debt: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    code_qr: {
      type: DataTypes.STRING(1024),
    },
    owner_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    group_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: Group,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "bills",
    timestamps: false,
  },
);

// User.belongsToMany(Bill, { through: "bills_users" });
// Bill.belongsToMany(User, { through: "bills_users" });
//
// Group.hasMany(Bill);

export default Bill;
