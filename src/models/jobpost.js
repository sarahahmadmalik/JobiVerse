import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  jobTitle: { 
    type: String, 
    required: true 
  },
  jobDescription: { 
    type: String, 
    required: true 
  },
  responsibilities: { 
    type: [String], 
    required: true 
  },
  requirements: { 
    type: [String], 
    required: true 
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Intermediate', 'Senior', 'Lead', 'Executive'],
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    required: true
  },
  salary: {
    value: Number,
    currency: { 
      type: String, 
      default: 'USD' 
    }
  },
      skills: {
      type: [String],
      // required: true,
      // validate: {
      //   validator: (v) => Array.isArray(v) && v.length > 0,
      //   message: "Please add at least one skill",
      // },
    },
  location: { 
    type: String, 
    required: true 
  },
  workMode: {
    type: String,
    enum: ['Onsite', 'Hybrid', 'Remote'],
    required: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  isOpen: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true } 
});

jobPostSchema.virtual('applicantDetails', {
  ref: 'Candidate',
  localField: 'applications.candidateId',
  foreignField: '_id'
});

jobPostSchema.virtual('recruiterInfo', {
  ref: 'Recruiter',
  localField: 'recruiterId',
  foreignField: '_id',
  justOne: true
});

jobPostSchema.virtual('applicationDetails', {
  ref: 'Application',
  localField: 'applications',
  foreignField: '_id'
});

const JobPost = mongoose.models.JobPost || mongoose.model('JobPost', jobPostSchema);
export default JobPost;