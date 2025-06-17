import { Request, Response } from "express";
import { z } from "zod/v4";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";

export const SeedUsers = async (req: Request, res: Response) => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      username: "johndoe01",
    },
  });
  if (!isUserExist) {
    const parentUser = {
      fullname: "john doe",
      userName: "johndoe01",
      password: "12345678",
    };
    const encryptedPassword = await bcrypt.hash(parentUser.password, 10);
    const branchData = [
      {
        name: "manchester branch",
        location:
          "65 Great Stone Rd., Old Trafford, Stretford, Manchester M32 8GR",
      },
      {
        name: "Del Segura branch",
        location: "Av. Zumalakarregi 29, Guardamar Del Segura",
      },
      {
        name: "birmingham branch",
        location: "22 Waterfront Walk, Birmingham B1 1SN",
      },
    ];
    try {
      const [userCreation, branchCreation] = await prisma.$transaction([
        prisma.user.create({
          data: {
            fullname: parentUser.fullname,
            username: parentUser.userName,
            password: encryptedPassword,
            role: "manager",
          },
        }),
        prisma.branch.createMany({
          data: branchData,
        }),
      ]);

      const createdBranches = await prisma.branch.findMany({
        where: { name: { in: branchData.map((b) => b.name) } },
      });

      const salesData = createdBranches.flatMap((branch) =>
        Array.from({ length: 5 }).map(() => ({
          amount: Math.floor(Math.random() * 1000) + 100,
          branchId: branch.id,
        }))
      );

      const expensesData = createdBranches.flatMap((branch) =>
        Array.from({ length: 5 }).map(() => ({
          description: "Random Expense",
          amount: Math.floor(Math.random() * 500) + 50,
          branchId: branch.id,
        }))
      );

      await prisma.$transaction([
        prisma.sale.createMany({ data: salesData }),
        prisma.expense.createMany({ data: expensesData }),
      ]);

      res.status(200).json({
        status: true,
        message: "Successfully added data",
        detail: { user: userCreation, branch: branchCreation },
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
      message: "User already exist",
      detail: isUserExist,
    });
  }
};
