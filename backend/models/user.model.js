import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },

    phoneNumber: {
      type: Number,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, //url to resume file
      resumeOriginalName: {
        type: String,
      },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

//enum a way to define a set of named constants that represent related values.
//When you add { timestamps: true } as the second argument to mongoose.Schema, Mongoose will automatically add two fields to your documents:
//createdAt → Date when the document was first created.
//updatedAt → Date when the document was last updated
