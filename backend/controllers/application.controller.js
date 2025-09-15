import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "job id is required",
        success: false,
      });
    }
    // checking if the user has already applied for a perticular job

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.send(400).json({
        message: "you have already applied for this job",
        success: false,
      });
    }
    // check if that job even exist
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "successfully applied for the job",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all the jobs to which a perticular user has applied for

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });

    if (!application) {
      return res.status(404).json({
        message: "no application found",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// admin will get to see the applicants who applied for the job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(400).json({
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

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // finding application using application id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "application not found",
        success: false,
      });
    }
    // updating the status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//? _id -
// It’s the unique identifier for each document in a MongoDB collection. If you don’t provide one, MongoDB automatically creates _id.So whenever you see . _id, it simply means you’re accessing the primary key (unique ID) of that MongoDB document.

//? .populate() -
//.populate() automatically replaces those ObjectIds with the actual documents

//? multer -
//Multer is a middleware that lets you handle file uploads in Express apps. It’s commonly used in MERN projects for profile pictures, resumes, product images, etc.

//? cloudinary -
//In MERN apps, it’s commonly used to store profile pictures, company logos, resumes, job banners, etc
