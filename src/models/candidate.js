import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}[-\s.]?[0-9]{0,6}$/,
        "Please enter a valid phone number",
      ],
    },
      picture: {
        type: String,
        default: ''
      },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    experience: [
      {
        jobTitle: {
          type: String,
          // required: true,
          trim: true,
          maxlength: 100,
        },
        companyName: {
          type: String,
          // required: true,
          trim: true,
          maxlength: 100,
        },
        location: {
          type: String,
          trim: true,
          maxlength: 100,
        },
        employmentType: {
          type: String,
          // required: true,
          enum: [
            "Full-time",
            "Part-time",
            "Contract",
            "Temporary",
            "Internship",
            "Freelance",
          ],
        },
        startDate: {
          type: Date,
          // required: true,
        },
        endDate: {
          type: Date,
          validate: {
            validator(value) {
              return !value || value > this.startDate;
            },
            message: "End date must be after start date",
          },
        },
        description: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      },
    ],
    skills: {
      type: [String],
      // required: true,
      // validate: {
      //   validator: (v) => Array.isArray(v) && v.length > 0,
      //   message: "Please add at least one skill",
      // },
    },
    education: [
      {
        degree: {
          type: String,
          // required: true,
        },
        fieldOfStudy: {
          type: String,
          // required: true,
          trim: true,
          maxlength: 100,
        },
        institution: {
          type: String,
          // required: true,
          trim: true,
          maxlength: 100,
        },
        location: {
          type: String,
          trim: true,
          maxlength: 100,
        },
        startDate: {
          type: Date,
          // required: true,
        },
        endDate: {
          type: Date,
          validate: {
            validator(value) {
              return !value || value > this.startDate;
            },
            message: "End date must be after start date",
          },
        },
        description: {
          type: String,
          trim: true,
          maxlength: 500,
        },
      },
    ],
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i,
          "Please enter a valid LinkedIn URL",
        ],
      },
      portfolio: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
          "Please enter a valid website URL",
        ],
      },
      github: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?github\.com\/.+/i,
          "Please enter a valid GitHub URL",
        ],
      },
      dribbble: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?dribbble\.com\/.+/i,
          "Please enter a valid Dribbble URL",
        ],
      },
    },
    jobPreferences: {
      desiredTitle: {
        type: String,
        // required: true,
        trim: true,
        maxlength: 100,
      },
      preferredLocations: [
        {
          type: String,
          trim: true,
          maxlength: 100,
        },
      ],
      industries: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      salaryExpectation: {
        type: Number,
        min: 0,
      },
      employmentTypes: [
        {
          type: String,
          enum: ["Full-time", "Part-time", "Contract", "Temporary", "Freelance"],
        },
      ],
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CandidateSchema.index({ "experience.jobTitle": "text" });
CandidateSchema.index({ skills: 1 });
CandidateSchema.index({ "education.degree": 1 });
CandidateSchema.index({ "jobPreferences.industries": 1 });
CandidateSchema.index({ "jobPreferences.availability": 1 });
CandidateSchema.index({ firstName: "text", lastName: "text" });

CandidateSchema.pre("save", function (next) {
  const trimStrings = (obj) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === "object") {
          trimStrings(obj[key]);
        }
      });
    }
  };
  trimStrings(this);
  next();
});

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
