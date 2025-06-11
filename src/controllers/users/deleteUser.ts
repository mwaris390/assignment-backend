import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const DeleteUsers = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const isUserExist = await prisma.user.findFirst({
    where: {
      id: uid,
    },
  });

  if (isUserExist) {
    try {
      const result = await prisma.user.delete({
        where: {
          id: uid,
        },
      });
      res.status(200).json({
        status: true,
        message: "Successfully deleted user",
        detail: result,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Failed to delete user",
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
};
