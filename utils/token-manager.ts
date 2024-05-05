import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constansts";



export const createToken = (id: string, email: string, expiresIn: string) => {// isse fn se hum, cookie bnayege token bascally usme info daal ke jwt to dedenge after login then vo coolie bana
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async ( //verify token
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`]; 
  console.log(token);
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err: { message: any; }, success: any) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};