import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { BillUsersAttributes } from "../constants/constants";

class BillsUsers
    extends Model<BillUsersAttributes, Optional<BillUsersAttributes, "id">>
    implements BillUsersAttributes
{
    public id!: string;
    public debt!: number;
    public is_regulated!: boolean;
    public bill_id!: string;
    public user_id!: string;
}

BillsUsers.init(
    {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        debt: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        is_regulated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                isBoolean: true,
            },
        },
        bill_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "bills_users",
        timestamps: false,
    },
);

export default BillsUsers;
