import { Request, Response } from "express";
import z from "zod/v4";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
const schema = z.object({
  fullname: z.string().min(1, "Full name is Required"),
  userName: z.string().min(1, "User name is Required"),
  password: z.string().optional(),
  branchId: z.uuid().optional(),
  role: z.enum(["Manager", "Admin", "chef"], {
    error: "role must be manager, admin, chef",
  }),
});

export const UpdateUsers = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const schemaResult = schema.safeParse(req.body);
  if (schemaResult.success) {
    let encryptedPassword;
    if (req.body.password && req.body.password != "") {
      encryptedPassword = await bcrypt.hash(req.body.password, 10);
    }
    const isUserExist = await prisma.user.findFirst({
      where: {
        id: uid,
      },
    });
    if (isUserExist) {
      try {
        const result = await prisma.user.update({
          data: {
            fullname: req.body.fullname,
            username: req.body.userName,
            password:
              req.body.password && req.body.password != ""
                ? encryptedPassword
                : isUserExist.password,
            role: req.body.role,
            branchId:
              req.body.role == "Manager" ? null : req.body.branchId || null,
          },
          where: {
            id: uid,
          },
        });
        res.status(200).json({
          status: true,
          message: "Successfully updated user",
          detail: result,
        });
      } catch (error) {
        res.status(400).json({
          status: false,
          message: "Failed to update user",
          detail: error,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "User ID does not exist",
        detail: isUserExist,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "Failed to update user",
      detail: z.prettifyError(schemaResult.error),
    });
  }
};
