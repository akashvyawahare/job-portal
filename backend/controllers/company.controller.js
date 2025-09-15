import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    //making sure that the user has provided the name of the company in order to register the company
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "company name is required",
        success: false,
      });
    }
    //finding if the company already exists or not
    let company = await Company.findOne({ name: companyName });
    //if exists then,
    if (company) {
      return res.status(400).json({
        message: "company already exists, can not register again",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id, //req.id is the id of the user who is logged in and we are getting it from the authentication
    });
    return res.status(201).json({
      message: "company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //we are finding company based on userId bcoz, we want the company which was created by the logged in user/recruiter
    const companies = await Company.find({ userId }); // find() returns an array of the  companies created by the user with the perticular userId.
    if (!companies) {
      return res.status(401).json({
        message: "companies not found",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(401).json({
        message: "company not found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req?.file;
    // implementing cloudinary here
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url; // here we'll get a public url of the logo, which we can access to get the actual logo on the screen
    const updateData = { name, description, website, location, logo };
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(401).json({
        message: "company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "company info updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
