import { decrypt } from "dotenv";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// buisness logic for register user -
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    console.log(fullname, email, phoneNumber, password, role);
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "some field is missing",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const couldResponse = await cloudinary.uploader.upload(fileUri.content);

    let user = await User.findOne({ email }); // here 'User.findOne()' finds the first occuring email, to verify if the user with that email already exist or not
    if (user) {
      return res.status(400).json({
        message: "user already exists with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //here we are passing the password, and the length of the password(how long we want it to be)

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: couldResponse.secure_url,
      },
    });

    return res.status(200).json({
      message: "account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//business logic for login -

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "some field is missing",
        success: false,
      });
    }
    // finding the existing user based on the entered email.
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    //checking if password matches with the given user/existing user or not.
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    // checking if the role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "account with this role does not exist",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `welcome back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    console.log(fullname, email, phoneNumber, bio, skills);

    const file = req.file;
    // cloudinary logic
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(","); // since user is going to put the skills in string format, seperated by comma(,)
    }
    const userId = req.id; // coming from middleware authentication.
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    // updating the data
    if (fullname) user.fullname = fullname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    //resume uploading activity
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // here we are getting a url(or)link which we are storing in 'user.profile.resume' so that later, we can download or display the file using this link.

      user.profile.resumeOriginalName = file.originalname; // here we are getting the file name to be displayed on the profile
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "profile updated successfully",
      user,
      success: true,
    });

    //here, we will write the logic related to resume updation
  } catch (error) {
    console.log(error);
  }
};

//? how jwt token works? what is the need of jwt token??
//When the user logs in successfully:
//1) The server checks their credentials (e.g., password).

//2) If correct ---→ the server generates a JWT token using jwt.sign().
//This token contains the user’s ID (and maybe role/permissions).
//It is digitally signed with a secret key so it cannot be tampered with.

//3) The token is sent back to the client.

//? why do we generate a token when the user logs in??
//bcoz, After login, every request they make should be linked to their identity, You don’t want users typing username & password for every API call.

//? what is {sameSite : strict} ??
//sameSite is a cookie attribute that controls when the browser should send cookies with cross-site requests. so, inshort,  sameSite: "strict" means,  Cookie is sent only for same-site requests.
//It helps prevent CSRF (Cross-Site Request Forgery) attacks by blocking cookies from being sent in cross-site contexts.

//? sameSite has three values -

//! strict -
// The cookie is sent only for requests from the same site.
// Not sent with cross-site requests (like when you click a link from another domain).
// Strongest CSRF protection.

//Example:
//Your site: myapp.com
//If a request comes from otherwebsite.com, the cookie is NOT sent.

//! lax -
//Cookies are withheld on most cross-site requests except safe ones (like GET when you click a link).
//Balance between usability & security.
//Default in modern browsers.

//! none -
//Cookies are sent with all requests, including cross-site.
//Must be paired with secure: true (HTTPS only).
//Used when your frontend and backend are on different domains (e.g., React app on frontend.com and API on api.com

//here when I was uploading the documents to the cloudinary from my app, it was not allowing me to upload .pdf, and .xip files, but I went ot the security section of the cloudinary, and there I turned on the 'allow pdf and zip option'
