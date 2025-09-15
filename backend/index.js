//here we are setting up the server
import path from "path";
import express, { application } from "express";
const app = express();

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({});

import cors from "cors";
import connectDB from "./utils/db.js"; //is is mandatory to write .js extension while importing

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { singleUpload } from "./middlewares/multer.js";

const port = process.env.PORT || 3000; //3000 is optional

//const _dirname = path.resolve(); // here we'll get the path of our whole backend folder, so that we can  deploy it

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use(cors(corsOptions));

//cookie-parser is a middleware in Express that helps you read and manage cookies sent by the client (browser).Without it, cookies are just a raw string in the HTTP header, and parsing them manually is a pain.
//So, cookie-parser makes cookies available in req.cookies (and req.signedCookies if you use signed cookies)

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//app.use(express.static(path.join(_dirname, "/frontend/dist"))); // dist folder will be created when we do 'npm run build'
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
// });
// here "*" means for any GET request, no matter what the path is, run this handler

app.listen(port, (req, res) => {
  connectDB();
  console.log(`server running at port ${port}`);
});
