import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { parsePhoneNumber } from "libphonenumber-js";
import { UserAttributes } from "../constants/constants";

class User extends Model<UserAttributes, Optional<UserAttributes, "id">> implements UserAttributes {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public password!: string;
  public username!: string;
  public gender!: string;
  public service!: string;
  public email!: string;
  public phone!: string;
  public birth_date!: Date;
  public is_admin!: boolean;
  public is_blocked!: boolean;
  public avatar_image!: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isUnique: async function (value: string) {
          const count = await User.count({ where: { email: value } });
          if (count > 0) {
            throw new Error("Email already in use");
          }
          return true;
        },
      },
    },
    phone: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: true,
      validate: {
        isPhoneNumber: async function (value: string) {
          const phoneNumber = parsePhoneNumber(value);
          if (!phoneNumber) {
            throw new Error("Invalid phone number");
          }
          return true;
        },
      },
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: true,
      },
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: true,
      },
    },
    avatar_image: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  },
);

export default User;
