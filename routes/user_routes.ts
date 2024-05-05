import { Router } from "express";
import { users ,signin,login,verifyUser,userLogout} from "../controllers/user";
import {verifyToken} from "../utils/token-manager"
import {validate,signupValidator,loginValidator} from "../utils/validator"

const userRoute = Router();

userRoute.get("/", users);
userRoute.post("/signin",validate(signupValidator),signin);
userRoute.post("/login",validate(loginValidator) ,login);
userRoute.get("/auth-status", verifyToken, verifyUser);
userRoute.get("/logout", verifyToken, userLogout);
 export {userRoute};
