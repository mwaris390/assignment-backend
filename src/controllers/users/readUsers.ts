import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const ReadUsers = async (req: Request, res: Response) => {
  try {
    const result = await prisma.user.findMany();
    res.status(200).json({
      status: true,
      message: "Successfully fetched users",
      detail: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to add user",
      detail: error,
    });
  }
};
