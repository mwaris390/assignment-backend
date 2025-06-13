import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { z } from "zod/v4";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

const schema = z.object({
  userName: z.string().min(1, "User name is Required"),
  password: z.string().min(1, "password is Required"),
});

export const Auth = async (req: Request, res: Response) => {
  const schemaResult = schema.safeParse(req.body);
  if (schemaResult.success) {
    const isUserExist = await prisma.user.findFirst({
      where: {
        username: req.body.userName,
      },
    });
    if (isUserExist) {
      const decryptedPassword = await bcrypt.compare(
        req.body.password,
        isUserExist.password
      );
      if (decryptedPassword) {
        let secret = process.env.JWTSECRET || "temporarySecret";
        let token = jwt.sign(
          {
            id: isUserExist.id,
            name: isUserExist.fullname,
            role: isUserExist.role,
          },
          secret,
          {
            // expiresIn: "5m",
            issuer: "server",
            subject: "client",
            header: { alg: "HS256", typ: "JWT" },
          }
        );
        // res.cookie("token", token, {
        //   httpOnly: true,
        //   sameSite: "none",
        //   secure: true,
        // });
        res.status(200).json({
          status: true,
          message: "Successfully authenticate user",
          detail: Object.assign(isUserExist, { token: token }),
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Failed to authenticate user",
          detail: "Password does not exist",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Failed to authenticate user",
        detail: "UserName does not exist",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "Failed to authenticate user",
      detail: z.prettifyError(schemaResult.error),
    });
  }
};
