import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Bill from "../models/billModel";
import { logger } from "../utils/logger";
import {
  BillAttributes,
  BillPostPayload,
  BillUsersBillResponse,
  ErrorType,
  UpdateBillRequest,
  UserAttributes,
} from "../constants/constants";
import BillsUsers from "../models/billUsersModel";
import { Op } from "sequelize";
import User from "../models/userModel";

const router = express.Router();

router.get("/api/v1/bills", async (req: Request, res: Response<BillAttributes[] | ErrorType>) => {
  try {
    const bills: BillAttributes[] = await Bill.findAll();

    if (!bills) {
      return res.status(404).send("Bills not found");
    }

    return res.status(200).json(bills);
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.get(
  "/api/v1/bills/:id",
  async (req: Request<{ id: string }>, res: Response<BillAttributes | ErrorType>) => {
    const billId: string = req.params.id;
    try {
      const bill: BillAttributes = await Bill.findByPk(billId);

      if (!bill) {
        return res.status(404).send("Bill not found");
      }

      return res.status(200).json(bill);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/bills/user/:id",
  async (req: Request, res: Response<BillAttributes[] | ErrorType>) => {
    const userId: string = req.params.id;
    try {
      const billsUsers: BillsUsers[] = await BillsUsers.findAll({
        where: {
          user_id: userId,
        },
      });

      const billsIds: string[] = billsUsers.map(bill => bill.dataValues.bill_id);

      const bills: BillAttributes[] = await Bill.findAll({
        where: {
          id: {
            [Op.in]: billsIds,
          },
        },
      });

      if (!bills) {
        return res.status(404).send("Bills not found");
      }

      return res.status(200).json(bills);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/bills/group/:id",
  async (req: Request, res: Response<BillAttributes[] | ErrorType>) => {
    const groupId: string = req.params.id;
    try {
      const bills: Bill[] = await Bill.findAll({
        where: {
          group_id: groupId,
        },
      });

      if (!bills) {
        return res.status(404).send("Bills not found");
      }

      return res.status(200).json(bills);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/bills/:id/users",
  async (req: Request, res: Response<BillUsersBillResponse | ErrorType>) => {
    const billId: string = req.params.id;

    try {
      const billUsers: BillsUsers[] = await BillsUsers.findAll({
        where: {
          bill_id: billId,
        },
      });

      const usersIds: string[] = billUsers.map(user => user.dataValues.user_id);

      const users: UserAttributes[] = await User.findAll({
        where: {
          id: {
            [Op.in]: usersIds,
          },
        },
      });

      const responseData: BillUsersBillResponse = {
        billUsers,
        users,
      };

      if (!users) {
        return res.status(404).send("Users not found");
      }

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.post(
  "/api/v1/bills",
  async (req: Request<Omit<BillAttributes, "id">>, res: Response<BillAttributes | ErrorType>) => {
    const {
      name,
      description,
      data_created,
      data_end,
      bill_image,
      currency_type,
      currency_code,
      debt,
      code_qr,
      owner_id,
      group_id,
      usersIdDebtList,
    }: Omit<BillPostPayload, "id"> = req.body;

    try {
      const id = uuidv4();
      const newBill: BillAttributes = await Bill.create({
        id,
        name,
        description,
        data_created,
        data_end,
        bill_image,
        currency_type,
        currency_code,
        debt,
        code_qr: `${process.env.FRONTEND_URL}/bill/${id}`,
        owner_id,
        group_id,
      });

      for (const user of usersIdDebtList) {
        try {
          await BillsUsers.create({
            id: uuidv4(),
            debt: user?.debt,
            bill_id: id,
            user_id: user?.id,
          });
          logger.info(`Successfully added user: ${user?.id} to bill in database`);
        } catch (error) {
          logger.error(error.message);
          return res.status(500).json({ error: error.message });
        }
      }

      return res.status(201).json(newBill);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.put(
  "/api/v1/bills/:id",
  async (req: UpdateBillRequest, res: Response<BillAttributes | ErrorType>) => {
    const billId: string = req.params.id;
    const {
      name,
      description,
      data_created,
      data_end,
      bill_image,
      currency_type,
      currency_code,
      debt,
      code_qr,
    }: Partial<BillAttributes> = req.body;

    try {
      const bill = await Bill.findOne({ where: { id: billId } });
      if (!bill) {
        return res.status(404).send("This bill not exists in the system");
      }

      const updatedData: Partial<BillAttributes> = {
        name,
        description,
        data_created,
        data_end,
        bill_image,
        currency_type,
        currency_code,
        debt,
        code_qr,
      };

      const dataToUpdate = Object.keys(updatedData).filter(key => updatedData[key] !== undefined);

      dataToUpdate.forEach(key => (bill[key] = updatedData[key]));

      await bill.save();

      return res.status(200).json(bill);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.delete(
  "/api/v1/bills/:id",
  async (req: Request<{ id: string }>, res: Response<string | ErrorType>) => {
    try {
      const billId: string = req.params.id;

      const deletedBill = await Bill.destroy({ where: { id: billId } });

      if (!deletedBill) {
        return res.status(404).send("Bill with this id not exists in the system");
      }

      return res.status(200).send("Bill successfully deleted from the system!");
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

export default router;
