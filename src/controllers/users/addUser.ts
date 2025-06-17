import { Request, Response } from "express";
import { z } from "zod/v4";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";

const schema = z.object({
  fullname: z.string().min(1, "Full name is Required"),
  userName: z.string().min(1, "User name is Required"),
  password: z.string().min(1, "password is Required"),
  branchId: z.uuid().optional(),
  role: z.string().min(1, "password is Required"),
});

export const AddUsers = async (req: Request, res: Response) => {
  const schemaResult = schema.safeParse(req.body);
  if (schemaResult.success) {
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const isUserExist = await prisma.user.findFirst({
      where: {
        username: req.body.userName,
      },
    });
    if (!isUserExist) {
      try {
        const result = await prisma.user.create({
          data: {
            fullname: req.body.fullname,
            username: req.body.userName,
            password: encryptedPassword,
            role: req.body.role,
            branchId: req.body.branchId || null,
          },
        });
        res.status(200).json({
          status: true,
          message: "Successfully added user",
          detail: result,
        });
      } catch (error) {
        res.status(400).json({
          status: false,
          message: "Failed to add user",
          detail: error,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "User name already exist",
        detail: isUserExist,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "Failed to add user",
      detail: z.prettifyError(schemaResult.error),
    });
  }
};
