import express from "express";
import bodyParser from 'body-parser';
import logger from "morgan";
import * as path from "path";
import connectToDB from "./utils/connectToDB";
import cookieParser from "cookie-parser";
import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import cors from "cors";
import 'dotenv/config'
require('dotenv').config();

// Routes
import { index } from "./routes/index";

import { userRoute } from "./routes/user_routes";
import  chat  from "./routes/chat";
// Create Express server
export const app = express();
connectToDB();
// Express configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 5000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/user", userRoute);


//app.use(errorNotFoundHandler);
//app.use(errorHandler);
