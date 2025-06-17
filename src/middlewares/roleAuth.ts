import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
export const RoleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  let id = "";
  if (token && token.startsWith("Bearer ")) {
    let secret = process.env.JWTSECRET || "temporarySecret";
    let parseToken = token.split(" ")[1];
    jwt.verify(parseToken, secret, { issuer: "server" }, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: "token has error",
          detail: err.message,
        });
      }
      let payload = decoded as any;
      id = payload?.id;
    });
  }
  const isUserExist = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  if (isUserExist?.role == "manager" || isUserExist?.role == "admin") {
    next();
  } else {
    res.status(400).json({
      status: false,
      message: "Only user with role manager or admin can to do this operations",
      detail: "",
    });
  }
};
