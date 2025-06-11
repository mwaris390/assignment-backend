import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  name: string;
  role: "Admin" | "Manager" | "chef";
}

export const VerifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (token) {
    let secret = process.env.JWTSECRET || "temporarySecret";
    jwt.verify(token, secret, { issuer: "server" }, (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: "token has error",
          detail: err.message,
        });
      }
      let payload = decoded as JwtPayload;
      let token = jwt.sign(
        {
          id: payload?.id,
          name: payload?.name,
          role: payload?.role,
        },
        secret,
        {
          expiresIn: "10m",
          issuer: "server",
          subject: "client",
          header: { alg: "HS256", typ: "JWT" },
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      next();
    });
  } else {
    res.status(400).json({
      status: false,
      message: "No token found",
      detail: "Failed to fetch token",
    });
  }
};
