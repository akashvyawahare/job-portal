import { Job } from "../models/job.model.js";

// these jobs will be posted by admin
export const postJobs = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobtype,
      position,
      experience,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobtype ||
      !position ||
      !experience ||
      !companyId
    ) {
      return res.status(400).json({
        message: "some fields are missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobtype,
      position,
      experienceLevel: experience,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "new job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// student will fetch all these jobs, to apply.
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""; // we get this from the url
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// student will get to see these jobs.
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// these jobs  are the jobs created by a perticular admin.(since the jobs created by a certain admin)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//? $or -
// is a MongoDB operator.
// It allows you to match documents if any of the given conditions are true.
// Example: "Find jobs where either the title matches or the description matches."

//? $regex -
// Tells MongoDB to use a regular expression for pattern matching.
// { title: { $regex: keyword } } means "find documents where title contains the string in keyword"

//? $options :"i" -
// Makes the regex case-insensitive.
// "developer" will match "Developer", "DEVELOPER", "deVeLoPer", etc.
