import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerCompany } from "../controllers/company.controller.js";
import {
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/update/:id").post(isAuthenticated, singleUpload, updateCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
export default router;
