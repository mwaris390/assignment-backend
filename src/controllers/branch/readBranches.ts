import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const ReadBranches = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    let result;
    let resultOfChef;
    const isUserExist = await prisma.user.findFirst({
      where: {
        id: uid,
      },
    });
    if (uid) {
      if (isUserExist?.role == "chef") {
        resultOfChef = [
          {
            orderId: "ORD-1001",
            table: 5,
            customerName: "John Doe",
            items: [
              { name: "Grilled Chicken", quantity: 2 },
              { name: "Caesar Salad", quantity: 1 },
            ],
            status: "pending", // or "preparing", "ready"
            placedAt: "2025-06-12T12:30:00Z",
            notes: "No onions on salad",
          },
          {
            orderId: "ORD-1002",
            table: 3,
            customerName: "Jane Smith",
            items: [
              { name: "Margherita Pizza", quantity: 1 },
              { name: "Garlic Bread", quantity: 2 },
            ],
            status: "preparing",
            placedAt: "2025-06-12T12:35:00Z",
            notes: "Bread must be over cooked",
          },
          {
            orderId: "ORD-1003",
            table: 7,
            customerName: "Ali Khan",
            items: [
              { name: "Beef Steak", quantity: 1 },
              { name: "Mashed Potatoes", quantity: 1 },
            ],
            status: "ready",
            placedAt: "2025-06-12T12:25:00Z",
            notes: "Medium rare",
          },
        ];
      } else {
        result = await prisma.branch.findMany({
          where: {
            users: { some: { id: uid } },
          },
          include: {
            expenses: {
              select: {
                amount: true,
              },
            },
            sales: {
              select: {
                amount: true,
              },
            },
          },
        });
      }
    } else {
      result = await prisma.branch.findMany({
        include: {
          expenses: {
            select: {
              amount: true,
            },
          },
          sales: {
            select: {
              amount: true,
            },
          },
        },
      });
    }
    if (isUserExist?.role != "chef") {
      result = result?.map((branch) => {
        const totalExpense = branch.expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );
        const totalSale = branch.sales.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );

        return {
          id: branch.id,
          name: branch.name,
          location: branch.location,
          totalExpense,
          totalSale,
        };
      });
    }
    res.status(200).json({
      status: true,
      message: "Successfully fetched branches",
      detail: isUserExist?.role != "chef" ? result : resultOfChef,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to fetched branches",
      detail: error,
    });
  }
};
