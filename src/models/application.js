import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  status: {
    type: String,
    enum: ['Submitted', 'Reviewed', 'Interview', 'Rejected', 'Shortlisted', 'Hired'],
    default: 'Submitted'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  analysis: {
    totalTime: Number,
    timePerPage: {
      type: Map,
      of: Number
    },
    topSectionsViewed: [String]
  },
  documents: {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    portfolio: String
  },

}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

applicationSchema.index({ jobId: 1 });
applicationSchema.index({ candidateId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ 'analysis.totalTime': 1 });
applicationSchema.index({ emailSent: 1 });

applicationSchema.virtual('jobDetails', {
  ref: 'JobPost',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true
});

applicationSchema.virtual('candidateDetails', {
  ref: 'Candidate',
  localField: 'candidateId',
  foreignField: '_id',
  justOne: true
});

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;